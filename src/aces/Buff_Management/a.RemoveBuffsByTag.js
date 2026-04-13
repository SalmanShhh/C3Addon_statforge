export const config = {
  listName: "Remove buffs by tag",
  displayText: "Remove all buffs with tag {0}",
  description: "Removes every buff that has the given tag. Fires 'On buff removed' for each one.",
  params: [
    { id: "tag", name: "Tag", desc: "The tag label to match. Only buffs that have this exact tag will be removed.", type: "string", initialValue: '"debuff"' },
  ],
};

export const expose = true;

export default function (tag) {
  const toRemove = [];
  for (const [buffId, buff] of this._buffMap) {
    if (buff.tags.has(tag)) toRemove.push(buffId);
  }
  for (const buffId of toRemove) this._removeBuff(buffId);
}
