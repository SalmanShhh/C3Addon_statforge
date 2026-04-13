export const config = {
  listName: "Add tag to buff",
  displayText: "Add tag {1} to buff {0}",
  description: "Adds a single tag to an existing buff. If the buff already has this tag nothing happens.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff to update.", type: "string", initialValue: '"my_buff"' },
    { id: "tag",    name: "Tag",     desc: "The tag to add.", type: "string", initialValue: '"fire"' },
  ],
};

export const expose = true;

export default function (buffId, tag) {
  const buff = this._buffMap.get(buffId);
  if (buff && tag) buff.tags.add(tag.trim());
}
