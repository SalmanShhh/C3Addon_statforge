export const config = {
  listName: "Enable/disable buffs by source",
  displayText: "Set buffs from source {0} active: {1}",
  description: "Enables or disables all buffs from a given source without removing them. Disabled buffs stay in the stack but are not counted in stat totals.",
  params: [
    { id: "source", name: "Source", desc: "The source label to match.", type: "string", initialValue: '"item_id"' },
    { id: "active", name: "Active", desc: "True to enable, false to disable.", type: "boolean", initialValue: "true" },
  ],
};

export const expose = true;

export default function (source, active) {
  const matching = [];
  for (const [buffId, buff] of this._buffMap) {
    if (buff.source === source) matching.push(buffId);
  }
  for (const buffId of matching) this._setBuffActive(buffId, active);
}
