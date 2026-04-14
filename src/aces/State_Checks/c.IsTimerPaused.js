export const config = {
  listName: "Buff timer is paused",
  displayText: "Buff {0} timer is paused",
  description: "True if the buff's countdown is currently paused.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff ID to check.", type: "string", initialValue: '"my_buff"' },
  ],
};

export const expose = false;

export default function (buffId) {
  return this.isTimerPaused(buffId);
}
