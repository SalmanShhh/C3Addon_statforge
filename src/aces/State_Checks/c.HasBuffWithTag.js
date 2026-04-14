export const config = {
  listName: "Has any buff with tag",
  displayText: "Has any buff with tag {0}",
  description: "True if at least one buff in the stack — enabled or disabled — has the given tag.",
  params: [
    { id: "tag", name: "Tag", desc: "The tag to look for.", type: "string", initialValue: '"fire"' },
  ],
};

export const expose = false;

export default function (tag) {
  return this.hasBuffWithTag(tag);
}
