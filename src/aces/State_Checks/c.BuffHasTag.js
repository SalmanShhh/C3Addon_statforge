export const config = {
  listName: "Buff has tag",
  displayText: "Buff {0} has tag {1}",
  description: "True if the specified buff exists and has the given tag.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff to check.", type: "string", initialValue: '"my_buff"' },
    { id: "tag",    name: "Tag",     desc: "The tag to look for on the buff.", type: "string", initialValue: '"fire"' },
  ],
};

export const expose = false;

export default function (buffId, tag) {
  const buff = this._buffMap.get(buffId);
  return buff ? buff.tags.has(tag) : false;
}
