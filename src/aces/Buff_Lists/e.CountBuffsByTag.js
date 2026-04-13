export const config = {
  returnType: "number",
  description: "Returns the number of buffs (active or inactive) that have the given tag.",
  params: [
    { id: "tag", name: "Tag", desc: "The tag to count.", type: "string" },
  ],
};

export const expose = false;

export default function (tag) {
  let count = 0;
  for (const buff of this._buffMap.values()) { if (buff.tags.has(tag)) count++; }
  return count;
}
