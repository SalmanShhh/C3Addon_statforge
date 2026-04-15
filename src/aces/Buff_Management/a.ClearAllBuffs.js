export const config = {
  listName: "Clear all buffs",
  displayText: "Clear all buffs",
  description: "Removes every buff from this object at once. Fires 'On buff removed' for each buff, then 'On stack cleared' once at the end.",
  params: [],
};

export const expose = true;

export default function () {
  const ids = Array.from(this._buffMap.keys());
  for (const buffId of ids) this.RemoveBuff(buffId);
  this._trigger("OnStackCleared");
}
