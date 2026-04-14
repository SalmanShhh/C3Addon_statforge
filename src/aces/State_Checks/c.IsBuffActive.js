export const config = {
  listName: "Buff is active",
  displayText: "Buff {0} is active",
  description: "True if the buff exists and is currently enabled. Disabled buffs do not contribute to stat totals.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff ID to check.", type: "string", initialValue: '"my_buff"' },
  ],
};

export const expose = false;

export default function (buffId) {
  return this.isBuffActive(buffId);
}
