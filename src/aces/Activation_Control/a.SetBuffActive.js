export const config = {
  listName: "Enable or disable buff",
  displayText: "Set buff {0} active: {1}",
  description: "Enables or disables a buff without removing it. Disabled buffs stay in the stack but do not contribute to stat totals.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff to change.", type: "string", initialValue: '"my_buff"' },
    { id: "active", name: "Active",  desc: "True to enable the buff, false to disable it.", type: "boolean", initialValue: "true" },
  ],
};

export const expose = true;

export default function (buffId, active) {
  const buff = this._buffMap.get(buffId);
  if (!buff || buff.active === active) return;
  const prevTotal = this._computeStatTotal(buff.stat);
  buff.active = active;
  this._setLastBuffContext(buff);
  this._trigger(active ? "OnBuffActivated" : "OnBuffDeactivated");
  this._resolveLinksForBuff(buffId, active ? "activated" : "deactivated");
  this._notifyStatChangedIfChanged(buff.stat, prevTotal);
}
