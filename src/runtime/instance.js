import { id, addonType } from "../../config.caw.js";
import AddonTypeMap from "../../template/addonTypeMap.js";

export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();

      // Properties: 0=autoTickTimers, 1=overflowMode, 2=minValue, 3=maxValue, 4=debugMode
      const properties = this._getInitProperties();
      this._autoTickTimers   = properties ? (properties[0] ?? true) : true;
      // overflowMode combo index -> string
      const omIdx           = properties ? (properties[1] ?? 0) : 0;
      this._overflowMode     = ["clamp", "wrap", "none"][omIdx] ?? "clamp";
      this._minValue         = properties ? (properties[2] ?? -99999) : -99999;
      this._maxValue         = properties ? (properties[3] ?? 99999) : 99999;
      this._debugMode        = properties ? (properties[4] ?? false) : false;

      // Core buff stack
      // Map<buffId, buffEntry>
      this._buffMap      = new Map();
      // Map<stat, number> for base values
      this._statBaseMap  = new Map();
      // Map<linkId, linkEntry>
      this._linkMap      = new Map();
      // Map<ruleId, ruleEntry>
      this._thresholdMap = new Map();

      // Event context variables
      this._lastBuffID            = "";
      this._lastBuffStat          = "";
      this._lastBuffValue         = 0;
      this._lastBuffMode          = "";
      this._lastBuffSource        = "";
      this._lastBuffTags          = [];
      this._lastChangedStat       = "";
      this._lastChangedStatTotal  = 0;
      this._lastFiredLinkID       = "";
      this._lastFiredLinkSourceBuff = "";
      this._lastFiredLinkTargetBuff = "";
      this._lastRuleID            = "";
      this._lastRuleWatchStat     = "";
      this._lastRuleThreshold     = 0;
      this._lastRuleTargetBuff    = "";
      this._lastRuleAction        = "";

      // Enable per-frame tick for timers
      this._setTicking(true);
      this.events = {};
    }

    onCreate() {}

    _tick() {
      if (!this._autoTickTimers) return;
      const dt = this.runtime.dt;
      const toExpire = [];
      for (const [buffId, buff] of this._buffMap) {
        if (buff.temporary && buff.active && !buff.timerPaused) {
          buff.elapsed += dt;
          if (buff.elapsed >= buff.duration) {
            toExpire.push(buffId);
          }
        }
      }
      for (const buffId of toExpire) {
        this._expireBuff(buffId);
      }
    }

    _release() {
      super._release();
    }

    // ─── Trigger helper ──────────────────────────────────────────────────────
    _trigger(method) {
      this.dispatch(method);
      super._trigger(self.C3[AddonTypeMap[addonType]][id].Cnds[method]);
    }

    on(tag, callback, options) {
      if (!this.events[tag]) {
        this.events[tag] = [];
      }
      this.events[tag].push({ callback, options });
    }

    _applyOverflow(value) {
      if (this._overflowMode === "none") return value;
      const min = this._minValue;
      const max = this._maxValue;
      if (this._overflowMode === "clamp") {
        return Math.min(max, Math.max(min, value));
      }
      // wrap
      const range = max - min;
      if (range <= 0) return min;
      let v = value;
      while (v < min) v += range;
      while (v > max) v -= range;
      return v;
    }

    // ─── Internal buff registration ──────────────────────────────────────────
    _registerBuffFromDef(def) {
      if (!def || !def.id || !def.stat) return;
      const modeMap = { add: "add", multiply: "multiply", override: "override" };
      const entry = {
        id:          def.id,
        stat:        def.stat,
        value:       typeof def.value === "number" ? def.value : 0,
        mode:        modeMap[def.mode] ?? "add",
        tags:        this._parseTags(def.tags ?? ""),
        source:      def.source ?? "",
        active:      def.active !== false,
        temporary:   def.temporary === true,
        duration:    typeof def.duration === "number" ? def.duration : 0,
        elapsed:     0,
        timerPaused: false,
      };
      this._buffMap.set(entry.id, entry);
    }

    off(tag, callback) {
      if (this.events[tag]) {
        this.events[tag] = this.events[tag].filter(
          (event) => event.callback !== callback
        );
      }
    }

    dispatch(tag) {
      if (this.events[tag]) {
        this.events[tag].forEach((event) => {
          if (event.options && event.options.params) {
            const fn = self.C3[AddonTypeMap[addonType]][id].Cnds[tag];
            if (fn && !fn.call(this, ...event.options.params)) {
              return;
            }
          }
          event.callback();
          if (event.options && event.options.once) {
            this.off(tag, event.callback);
          }
        });
      }
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────
    _parseTags(tagsStr) {
      if (!tagsStr) return new Set();
      return new Set(String(tagsStr).split(",").map(t => t.trim()).filter(t => t.length > 0));
    }

    _log(msg) {
      if (this._debugMode) console.log(`[StatForge] ${msg}`);
    }

    _combo(value, keys) {
      return keys[value] ?? keys[0];
    }

    // ─── Stat computation ─────────────────────────────────────────────────────
    _computeStatTotal(stat) {
      const base = this._statBaseMap.get(stat) ?? 0;
      let addSum  = 0;
      let multPct = 0;
      let overrideVal = null;
      for (const [, b] of this._buffMap) {
        if (b.stat !== stat || !b.active) continue;
        if      (b.mode === "add")      addSum    += b.value;
        else if (b.mode === "multiply") multPct   += b.value;
        else if (b.mode === "override") {
          overrideVal = overrideVal === null ? b.value : Math.max(overrideVal, b.value);
        }
      }
      let total = (base + addSum) * (1 + multPct / 100);
      if (overrideVal !== null) total = overrideVal;
      return this._applyOverflow(total);
    }

    _notifyStatChangedIfChanged(stat, prevTotal) {
      const newTotal = this._computeStatTotal(stat);
      if (newTotal !== prevTotal) {
        this._lastChangedStat      = stat;
        this._lastChangedStatTotal = newTotal;
        this._trigger("OnStatChanged");
        this._evaluateThresholds(stat);
      }
    }

    // ─── Threshold evaluation ─────────────────────────────────────────────────
    _evaluateThresholds(stat) {
      const total = this._computeStatTotal(stat);
      for (const [, rule] of this._thresholdMap) {
        if (rule.watchStat !== stat) continue;
        if (!rule.armed || rule._inFlight) continue;
        const nowAbove = total >= rule.threshold;
        const wasAbove = rule._prevAbove;
        let fire = false;
        if (rule.triggerMode === "reach"      &&  nowAbove && !wasAbove) fire = true;
        if (rule.triggerMode === "drop_below" && !nowAbove &&  wasAbove) fire = true;
        rule._prevAbove = nowAbove;
        if (fire) {
          if (!rule.canRepeat) rule.armed = false;
          rule._inFlight = true;
          this._lastRuleID         = rule.ruleId;
          this._lastRuleWatchStat  = rule.watchStat;
          this._lastRuleThreshold  = rule.threshold;
          this._lastRuleTargetBuff = rule.targetBuffId ?? "";
          this._lastRuleAction     = rule.ruleAction ?? "";
          this._trigger("OnThresholdReached");
          if (rule.ruleAction && rule.targetBuffId) {
            if      (rule.ruleAction === "activate")   this._setBuffActive(rule.targetBuffId, true);
            else if (rule.ruleAction === "deactivate") this._setBuffActive(rule.targetBuffId, false);
            else if (rule.ruleAction === "remove")     this._removeBuff(rule.targetBuffId);
          }
          if (rule.autoResetValue !== null && rule.autoResetValue !== undefined) {
            const prevTotal2 = this._computeStatTotal(stat);
            this._statBaseMap.set(stat, rule.autoResetValue);
            this._notifyStatChangedIfChanged(stat, prevTotal2);
          }
          rule._inFlight = false;
        }
      }
    }

    // ─── Buff CRUD ────────────────────────────────────────────────────────────
    _setLastBuffContext(buff) {
      this._lastBuffID     = buff.id;
      this._lastBuffStat   = buff.stat;
      this._lastBuffValue  = buff.value;
      this._lastBuffMode   = buff.mode;
      this._lastBuffSource = buff.source;
      this._lastBuffTags   = Array.from(buff.tags);
    }

    _addBuff(entry) {
      const prevTotal = this._computeStatTotal(entry.stat);
      this._buffMap.set(entry.id, entry);
      this._setLastBuffContext(entry);
      this._trigger("OnBuffAdded");
      this._notifyStatChangedIfChanged(entry.stat, prevTotal);
    }

    _removeBuff(buffId) {
      const buff = this._buffMap.get(buffId);
      if (!buff) return;
      const prevTotal = this._computeStatTotal(buff.stat);
      this._buffMap.delete(buffId);
      this._setLastBuffContext(buff);
      this._trigger("OnBuffRemoved");
      this._resolveLinksForBuff(buffId, "removed");
      this._notifyStatChangedIfChanged(buff.stat, prevTotal);
    }

    _expireBuff(buffId) {
      const buff = this._buffMap.get(buffId);
      if (!buff) return;
      const prevTotal = this._computeStatTotal(buff.stat);
      this._setLastBuffContext(buff);
      this._trigger("OnBuffExpired");
      this._buffMap.delete(buffId);
      this._trigger("OnBuffRemoved");
      this._resolveLinksForBuff(buffId, "expired");
      this._resolveLinksForBuff(buffId, "removed");
      this._notifyStatChangedIfChanged(buff.stat, prevTotal);
    }

    _setBuffActive(buffId, active) {
      const buff = this._buffMap.get(buffId);
      if (!buff || buff.active === active) return;
      const prevTotal = this._computeStatTotal(buff.stat);
      buff.active = active;
      this._setLastBuffContext(buff);
      this._trigger(active ? "OnBuffActivated" : "OnBuffDeactivated");
      this._resolveLinksForBuff(buffId, active ? "activated" : "deactivated");
      this._notifyStatChangedIfChanged(buff.stat, prevTotal);
    }

    // ─── Buff links ───────────────────────────────────────────────────────────
    _resolveLinksForBuff(sourceBuffId, sourceEvent) {
      for (const [, link] of this._linkMap) {
        if (link.sourceBuffId !== sourceBuffId) continue;
        if (link.sourceEvent  !== sourceEvent)   continue;
        this._executeLinkAction(link);
      }
    }

    _executeLinkAction(link) {
      const target = this._buffMap.get(link.targetBuffId);
      if (!target && link.targetAction !== "add_from_template") return;
      this._lastFiredLinkID         = link.linkId;
      this._lastFiredLinkSourceBuff = link.sourceBuffId;
      this._lastFiredLinkTargetBuff = link.targetBuffId;
      this._trigger("OnBuffLinkFired");
      if      (link.targetAction === "remove")       this._removeBuff(link.targetBuffId);
      else if (link.targetAction === "activate")     this._setBuffActive(link.targetBuffId, true);
      else if (link.targetAction === "deactivate")   this._setBuffActive(link.targetBuffId, false);
      else if (link.targetAction === "toggle_active" && target) {
        this._setBuffActive(link.targetBuffId, !target.active);
      }
    }

    // ─── Private helper ───────────────────────────────────────────────────────
    _tagsToArray(tags) {
      return Array.from(tags);
    }

    // ─── Public scripting API ─────────────────────────────────────────────────
    // These methods are callable from C3 Script (inst.behaviors.StatForge.statTotal("attack"), etc.)

    // Stat values
    /** @param {string} stat @returns {number} */
    statTotal(stat) { return this._computeStatTotal(stat); }
    /** @param {string} stat @returns {number} */
    statBase(stat) { return this._statBaseMap.get(stat) ?? 0; }
    /** @param {string} stat @returns {number} */
    statAddSum(stat) {
      let sum = 0;
      for (const b of this._buffMap.values()) {
        if (b.stat === stat && b.active && b.mode === "add") sum += b.value;
      }
      return sum;
    }
    /** @param {string} stat @returns {number} */
    statMultiplier(stat) {
      let sum = 0;
      for (const b of this._buffMap.values()) {
        if (b.stat === stat && b.active && b.mode === "multiply") sum += b.value;
      }
      return 1 + sum / 100;
    }
    /** @param {string} stat @returns {number} */
    statMultiplierPercent(stat) {
      return (this.statMultiplier(stat) - 1) * 100;
    }

    // Buff info
    /** @param {string} buffId @returns {number} 1=active, 0=disabled, -1=not found */
    buffActiveState(buffId) { const b = this._buffMap.get(buffId); if (!b) return -1; return b.active ? 1 : 0; }
    /** @param {string} buffId @returns {number} */
    buffDuration(buffId) { const b = this._buffMap.get(buffId); return (b && b.temporary) ? b.duration : 0; }
    /** @param {string} buffId @returns {number} */
    buffElapsedTime(buffId) { const b = this._buffMap.get(buffId); return (b && b.temporary) ? b.elapsed : 0; }
    /** @param {string} buffId @returns {number} */
    buffRemainingTime(buffId) { const b = this._buffMap.get(buffId); if (!b || !b.temporary) return 0; return Math.max(0, b.duration - b.elapsed); }
    /** @param {string} buffId @returns {string} "add" | "multiply" | "override" */
    buffMode(buffId) { return this._buffMap.get(buffId)?.mode ?? ""; }
    /** @param {string} buffId @returns {string} */
    buffSource(buffId) { return this._buffMap.get(buffId)?.source ?? ""; }
    /** @param {string} buffId @returns {string} */
    buffStat(buffId) { return this._buffMap.get(buffId)?.stat ?? ""; }
    /** @param {string} buffId @returns {number} */
    buffValue(buffId) { return this._buffMap.get(buffId)?.value ?? 0; }

    // Buff state checks
    /** @param {string} buffId @returns {boolean} */
    hasBuff(buffId) { return this._buffMap.has(buffId); }
    /** @param {string} buffId @returns {boolean} */
    isBuffActive(buffId) { return this._buffMap.get(buffId)?.active ?? false; }
    /** @param {string} buffId @returns {boolean} */
    isBuffTemporary(buffId) { return this._buffMap.get(buffId)?.temporary ?? false; }
    /** @param {string} buffId @returns {boolean} */
    isTimerPaused(buffId) { return this._buffMap.get(buffId)?.timerPaused ?? false; }
    /** @param {string} buffId @param {string} tag @returns {boolean} */
    buffHasTag(buffId, tag) { return this._buffMap.get(buffId)?.tags.has(tag) ?? false; }
    /** @param {string} buffId @param {string} source @returns {boolean} */
    buffSourceMatches(buffId, source) { const b = this._buffMap.get(buffId); return b ? b.source === source : false; }
    /** @param {string} tag @returns {boolean} */
    hasBuffWithTag(tag) { for (const b of this._buffMap.values()) { if (b.tags.has(tag)) return true; } return false; }
    /** @param {string} tag @returns {boolean} */
    hasActiveBuffWithTag(tag) { for (const b of this._buffMap.values()) { if (b.tags.has(tag) && b.active) return true; } return false; }
    /** @param {string} stat @returns {boolean} */
    hasBuffOnStat(stat) { for (const b of this._buffMap.values()) { if (b.stat === stat) return true; } return false; }
    /** @param {string} stat @returns {boolean} */
    hasActiveBuffOnStat(stat) { for (const b of this._buffMap.values()) { if (b.stat === stat && b.active) return true; } return false; }
    /** @param {string} source @returns {boolean} */
    hasBuffWithSource(source) { for (const b of this._buffMap.values()) { if (b.source === source) return true; } return false; }
    /** @param {string} linkId @returns {boolean} */
    hasBuffLink(linkId) { return this._linkMap.has(linkId); }
    /** @param {string} ruleId @returns {boolean} */
    hasThresholdRule(ruleId) { return this._thresholdMap.has(ruleId); }
    /** @param {string} ruleId @returns {boolean} */
    isThresholdRuleArmed(ruleId) { return this._thresholdMap.get(ruleId)?.armed ?? false; }
    /** @param {string} statId @param {number} value @returns {boolean} */
    stackAbove(statId, value) { return this._computeStatTotal(statId) > value; }
    /** @param {string} statId @param {number} value @returns {boolean} */
    stackBelow(statId, value) { return this._computeStatTotal(statId) < value; }
    /** @param {string} stat @param {number} minVal @param {number} maxVal @returns {boolean} */
    statTotalInRange(stat, minVal, maxVal) { const t = this._computeStatTotal(stat); return t >= minVal && t <= maxVal; }

    // Buff list counts & indexed access
    /** @returns {number} */
    countBuffs() { return this._buffMap.size; }
    /** @returns {number} */
    countActiveBuffs() { let n = 0; for (const b of this._buffMap.values()) { if (b.active) n++; } return n; }
    /** @param {string} tag @returns {number} */
    countBuffsByTag(tag) { let n = 0; for (const b of this._buffMap.values()) { if (b.tags.has(tag)) n++; } return n; }
    /** @param {string} tag @returns {number} */
    countActiveBuffsByTag(tag) { let n = 0; for (const b of this._buffMap.values()) { if (b.tags.has(tag) && b.active) n++; } return n; }
    /** @param {string} stat @returns {number} */
    countBuffsOnStat(stat) { let n = 0; for (const b of this._buffMap.values()) { if (b.stat === stat) n++; } return n; }
    /** @param {string} stat @returns {number} */
    countActiveBuffsOnStat(stat) { let n = 0; for (const b of this._buffMap.values()) { if (b.stat === stat && b.active) n++; } return n; }
    /** @param {string} source @returns {number} */
    countBuffsBySource(source) { let n = 0; for (const b of this._buffMap.values()) { if (b.source === source) n++; } return n; }
    /** @param {number} index @returns {string} */
    getBuffByIndex(index) { return Array.from(this._buffMap.keys())[index] ?? ""; }
    /** @param {string} tag @param {number} index @returns {string} */
    getBuffByTagIndex(tag, index) { let i = 0; for (const b of this._buffMap.values()) { if (b.tags.has(tag)) { if (i === index) return b.id; i++; } } return ""; }
    /** @param {string} source @param {number} index @returns {string} */
    getBuffBySourceIndex(source, index) { let i = 0; for (const b of this._buffMap.values()) { if (b.source === source) { if (i === index) return b.id; i++; } } return ""; }
    /** @param {string} stat @param {number} index @returns {string} */
    getBuffOnStatByIndex(stat, index) { let i = 0; for (const b of this._buffMap.values()) { if (b.stat === stat) { if (i === index) return b.id; i++; } } return ""; }

    // Tag lists
    /** @param {string} buffId @returns {number} */
    countBuffTags(buffId) { return this._buffMap.get(buffId)?.tags.size ?? 0; }
    /** @param {string} buffId @param {number} index @returns {string} */
    getBuffTagByIndex(buffId, index) { const b = this._buffMap.get(buffId); if (!b) return ""; return this._tagsToArray(b.tags)[index] ?? ""; }

    // Link & rule counts
    /** @returns {number} */
    countBuffLinks() { return this._linkMap.size; }
    /** @returns {number} */
    countThresholdRules() { return this._thresholdMap.size; }
    /** @returns {number} */
    countArmedRules() { let n = 0; for (const r of this._thresholdMap.values()) { if (r.armed) n++; } return n; }

    // Event context (read during On buff added / On stat changed / On threshold reached / etc.)
    /** @returns {string} */
    lastBuffID() { return this._lastBuffID; }
    /** @returns {string} */
    lastBuffStat() { return this._lastBuffStat; }
    /** @returns {number} */
    lastBuffValue() { return this._lastBuffValue; }
    /** @returns {string} */
    lastBuffMode() { return this._lastBuffMode; }
    /** @returns {string} */
    lastBuffSource() { return this._lastBuffSource; }
    /** @returns {number} */
    countLastBuffTags() { return this._lastBuffTags.length; }
    /** @param {number} index @returns {string} */
    getLastBuffTagByIndex(index) { return this._lastBuffTags[index] ?? ""; }
    /** @returns {string} */
    lastChangedStat() { return this._lastChangedStat; }
    /** @returns {number} */
    lastChangedStatTotal() { return this._lastChangedStatTotal; }
    /** @returns {string} */
    lastFiredLinkID() { return this._lastFiredLinkID; }
    /** @returns {string} */
    lastFiredLinkSourceBuff() { return this._lastFiredLinkSourceBuff; }
    /** @returns {string} */
    lastFiredLinkTargetBuff() { return this._lastFiredLinkTargetBuff; }
    /** @returns {string} */
    lastRuleID() { return this._lastRuleID; }
    /** @returns {string} */
    lastRuleWatchStat() { return this._lastRuleWatchStat; }
    /** @returns {number} */
    lastRuleThreshold() { return this._lastRuleThreshold; }
    /** @returns {string} */
    lastRuleTargetBuff() { return this._lastRuleTargetBuff; }
    /** @returns {string} */
    lastRuleAction() { return this._lastRuleAction; }

    // ─── Save / Load ──────────────────────────────────────────────────────────
    _saveToJson() {
      const buffs = [];
      for (const [, b] of this._buffMap) {
        buffs.push({
          id:          b.id,
          stat:        b.stat,
          value:       b.value,
          mode:        b.mode,
          tags:        Array.from(b.tags).join(","),
          source:      b.source,
          active:      b.active,
          temporary:   b.temporary,
          duration:    b.duration,
          elapsed:     b.elapsed,
          timerPaused: b.timerPaused,
        });
      }
      const bases = [];
      for (const [stat, val] of this._statBaseMap) bases.push([stat, val]);
      const links = [];
      for (const [, l] of this._linkMap) links.push({ ...l });
      const rules = [];
      for (const [, r] of this._thresholdMap) {
        rules.push({
          ruleId:         r.ruleId,
          watchStat:      r.watchStat,
          threshold:      r.threshold,
          triggerMode:    r.triggerMode,
          targetBuffId:   r.targetBuffId,
          ruleAction:     r.ruleAction,
          autoResetValue: r.autoResetValue,
          canRepeat:      r.canRepeat,
          armed:          r.armed,
          _prevAbove:     r._prevAbove,
        });
      }
      return { buffs, bases, links, rules };
    }

    _loadFromJson(o) {
      this._buffMap.clear();
      this._statBaseMap.clear();
      this._linkMap.clear();
      this._thresholdMap.clear();

      if (Array.isArray(o.buffs)) {
        for (const b of o.buffs) {
          this._buffMap.set(b.id, {
            id:          b.id,
            stat:        b.stat,
            value:       b.value,
            mode:        b.mode,
            tags:        this._parseTags(b.tags ?? ""),
            source:      b.source ?? "",
            active:      b.active !== false,
            temporary:   b.temporary === true,
            duration:    b.duration ?? 0,
            elapsed:     b.elapsed ?? 0,
            timerPaused: b.timerPaused === true,
          });
        }
      }
      if (Array.isArray(o.bases)) {
        for (const [stat, val] of o.bases) this._statBaseMap.set(stat, val);
      }
      if (Array.isArray(o.links)) {
        for (const l of o.links) this._linkMap.set(l.linkId, { ...l });
      }
      if (Array.isArray(o.rules)) {
        for (const r of o.rules) {
          this._thresholdMap.set(r.ruleId, {
            ruleId:         r.ruleId,
            watchStat:      r.watchStat,
            threshold:      r.threshold,
            triggerMode:    r.triggerMode,
            targetBuffId:   r.targetBuffId,
            ruleAction:     r.ruleAction,
            autoResetValue: r.autoResetValue ?? null,
            canRepeat:      r.canRepeat === true,
            armed:          r.armed !== false,
            _prevAbove:     r._prevAbove === true,
            _inFlight:      false,
          });
        }
      }
    }

    // ─── Debugger support ─────────────────────────────────────────────────────
    _getDebuggerProperties() {
      const sections = [];

      // Buff stack
      const buffProps = [];
      for (const [, b] of this._buffMap) {
        const remaining = b.temporary ? Math.max(0, b.duration - b.elapsed).toFixed(2) + "s" : "—";
        buffProps.push({ name: `$${b.id}`, value: `${b.stat} | ${b.mode} ${b.value} | active:${b.active} | ${remaining}` });
      }
      if (buffProps.length === 0) buffProps.push({ name: "$empty", value: "no buffs" });
      sections.push({ title: `$${this.behaviorType.name} - Buff Stack`, properties: buffProps });

      // Stat totals
      const statKeys = new Set();
      for (const [, b] of this._buffMap) statKeys.add(b.stat);
      for (const [s] of this._statBaseMap) statKeys.add(s);
      const statProps = [];
      for (const s of statKeys) statProps.push({ name: `$${s}`, value: this._computeStatTotal(s) });
      if (statProps.length === 0) statProps.push({ name: "$empty", value: "no stats" });
      sections.push({ title: "$Stat Totals", properties: statProps });

      // Counts
      let activeCount = 0, tempCount = 0;
      for (const b of this._buffMap.values()) {
        if (b.active) activeCount++;
        if (b.temporary) tempCount++;
      }
      let armedCount = 0;
      for (const r of this._thresholdMap.values()) { if (r.armed) armedCount++; }
      sections.push({
        title: "$Counts",
        properties: [
          { name: "$Total buffs",       value: this._buffMap.size },
          { name: "$Active buffs",      value: activeCount },
          { name: "$Temporary buffs",   value: tempCount },
          { name: "$Buff links",        value: this._linkMap.size },
          { name: "$Threshold rules",   value: this._thresholdMap.size },
          { name: "$Armed rules",       value: armedCount },
        ],
      });

      return sections;
    }
  };
}
