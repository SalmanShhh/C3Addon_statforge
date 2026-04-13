export const config = {
  listName: "Remove buffs by source",
  displayText: "Remove all buffs from source {0}",
  description: "Removes every buff whose source matches the given label exactly. Use this when an item is unequipped or an ability ends to clean up everything it contributed in one call.",
  params: [
    { id: "source", name: "Source", desc: "The source label to match. Must be exact.", type: "string", initialValue: '"item_id"' },
  ],
};

export const expose = true;

export default function (source) {
  const toRemove = [];
  for (const [buffId, buff] of this._buffMap) {
    if (buff.source === source) toRemove.push(buffId);
  }
  for (const buffId of toRemove) this._removeBuff(buffId);
}
