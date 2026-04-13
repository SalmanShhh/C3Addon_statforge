export const config = {
  listName: "Remove tag from buff",
  displayText: "Remove tag {1} from buff {0}",
  description: "Removes a single tag from an existing buff's tag list.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff to update.", type: "string", initialValue: '"my_buff"' },
    { id: "tag",    name: "Tag",     desc: "The tag to remove.", type: "string", initialValue: '"fire"' },
  ],
};

export const expose = true;

export default function (buffId, tag) {
  const buff = this._buffMap.get(buffId);
  if (buff) buff.tags.delete(tag.trim());
}
