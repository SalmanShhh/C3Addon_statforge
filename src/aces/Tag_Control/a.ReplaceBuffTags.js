export const config = {
  listName: "Replace buff tags",
  displayText: "Replace tags on buff {0} with {1}",
  description: "Replaces all tags on a buff at once with the new comma-separated list. Pass an empty string to remove all tags.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff to update.", type: "string", initialValue: '"my_buff"' },
    { id: "tags",   name: "Tags",    desc: "New comma-separated tag list. Use \"\" to clear all tags.", type: "string", initialValue: '"fire,buff"' },
  ],
};

export const expose = true;

export default function (buffId, tags) {
  const buff = this._buffMap.get(buffId);
  if (buff) buff.tags = this._parseTags(tags);
}
