export const config = {
  listName: "Enable/disable buffs by tag",
  displayText: "Set buffs with tag {0} active: {1}",
  description: "Enables or disables every buff that has the given tag. Useful for suppressing an entire group of buffs at once.",
  params: [
    { id: "tag",    name: "Tag",    desc: "The tag to match.", type: "string", initialValue: '"charm"' },
    { id: "active", name: "Active", desc: "True to enable, false to disable.", type: "boolean", initialValue: "true" },
  ],
};

export const expose = true;

export default function (tag, active) {
  const matching = [];
  for (const [buffId, buff] of this._buffMap) {
    if (buff.tags.has(tag)) matching.push(buffId);
  }
  for (const buffId of matching) this.SetBuffActive(buffId, active);
}
