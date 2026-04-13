export const config = {
  listName: "Has active buff with tag",
  displayText: "Has active buff with tag {0}",
  description: "True if at least one enabled buff has the given tag.",
  params: [
    { id: "tag", name: "Tag", desc: "The tag to look for.", type: "string", initialValue: '"fire"' },
  ],
};

export const expose = false;

export default function (tag) {
  for (const buff of this._buffMap.values()) {
    if (buff.tags.has(tag) && buff.active) return true;
  }
  return false;
}
