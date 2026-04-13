export const config = {
  listName: "Remove all buffs on stat",
  displayText: "Remove all buffs on stat {0}",
  description: "Removes every buff that targets the given stat, regardless of their tags or source.",
  params: [
    { id: "stat", name: "Stat", desc: "The stat name to clear all buffs from.", type: "string", initialValue: '"attack"' },
  ],
};

export const expose = true;

export default function (stat) {
  const toRemove = [];
  for (const [buffId, buff] of this._buffMap) {
    if (buff.stat === stat) toRemove.push(buffId);
  }
  for (const buffId of toRemove) this._removeBuff(buffId);
}
