export const config = {
  listName: "Has buff",
  displayText: "Has buff {0}",
  description: "True if a buff with this ID exists, whether it is currently enabled or disabled.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff ID to look for.", type: "string", initialValue: '"my_buff"' },
  ],
};

export const expose = false;

export default function (buffId) {
  return this.hasBuff(buffId);
}
