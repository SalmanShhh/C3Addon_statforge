export const config = {
  listName: "Remove all links for a buff",
  displayText: "Remove all links involving buff {0}",
  description: "Removes every link where the given buff is either the trigger (source) or the target. Call this before removing a buff that has links to avoid ghost references.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff whose links to remove.", type: "string", initialValue: '"my_buff"' },
  ],
};

export const expose = true;

export default function (buffId) {
  const toRemove = [];
  for (const [linkId, link] of this._linkMap) {
    if (link.sourceBuffId === buffId || link.targetBuffId === buffId) toRemove.push(linkId);
  }
  for (const linkId of toRemove) this._linkMap.delete(linkId);
}
