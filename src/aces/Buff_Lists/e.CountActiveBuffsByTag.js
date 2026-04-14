export const config = {
  returnType: "number",
  description: "Returns the number of active buffs that have the given tag.",
  params: [
    { id: "tag", name: "Tag", desc: "The tag to count.", type: "string" },
  ],
};

export const expose = false;

export default function (tag) {
  return this.countActiveBuffsByTag(tag);
}
