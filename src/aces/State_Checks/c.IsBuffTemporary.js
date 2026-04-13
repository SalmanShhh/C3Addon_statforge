export const config = {
  listName: "Buff is timed",
  displayText: "Buff {0} is timed",
  description: "True if the buff is a timed buff with an active countdown.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff ID to check.", type: "string", initialValue: '"my_buff"' },
  ],
};

export const expose = false;

export default function (buffId) {
  const buff = this._buffMap.get(buffId);
  return buff ? buff.temporary : false;
}
