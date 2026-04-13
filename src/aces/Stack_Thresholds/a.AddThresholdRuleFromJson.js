export const config = {
  listName: "Add threshold rule from JSON",
  displayText: "Add threshold rule from JSON: {0}",
  description: "Registers a threshold rule from a JSON string. See the documentation for the threshold rule definition format.",
  params: [
    { id: "json", name: "JSON string", desc: "A JSON object describing the threshold rule.", type: "string", initialValue: '"{}"' },
  ],
};

export const expose = true;

export default function (json) {
  let def;
  try { def = JSON.parse(json); } catch (e) {
    if (this._debugMode) console.warn("[StatForge] AddThresholdRuleFromJson: invalid JSON", e);
    return;
  }
  if (!def.ruleId || !def.watchStat || def.threshold === undefined || !def.triggerMode || !def.targetBuffId || !def.ruleAction) return;
  this._thresholdMap.set(def.ruleId, {
    ruleId:         def.ruleId,
    watchStat:      def.watchStat,
    threshold:      def.threshold,
    triggerMode:    def.triggerMode,
    targetBuffId:   def.targetBuffId,
    ruleAction:     def.ruleAction,
    autoResetValue: def.autoResetValue ?? null,
    canRepeat:      def.canRepeat === true,
    armed:          def.armed !== false,
    _prevAbove:     this._computeStatTotal(def.watchStat) >= def.threshold,
    _inFlight:      false,
  });
  this._trigger("OnThresholdRuleAdded");
}
