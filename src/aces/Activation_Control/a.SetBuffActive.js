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
  this._setBuffActive(buffId, active);
}
