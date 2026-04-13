export const config = {
  listName: "Buff source matches",
  displayText: "Buff {0} source is {1}",
  description: "True if the specified buff exists and its source label exactly matches the given string.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff to check.", type: "string", initialValue: '"my_buff"' },
    { id: "source", name: "Source",  desc: "The source label to match.", type: "string", initialValue: '"item_id"' },
  ],
};

export const expose = false;

export default function (buffId, source) {
  const buff = this._buffMap.get(buffId);
  return buff ? buff.source === source : false;
}
