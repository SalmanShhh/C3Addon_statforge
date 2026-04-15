export const config = {
  listName: "Remove buffs by multiple tags",
  displayText: "Remove buffs matching tags {0} ({1})",
  description: "Removes buffs that match a list of tags. 'Any' removes buffs that have at least one of the tags. 'All' removes only buffs that have every tag in the list.",
  params: [
    { id: "tags",      name: "Tags",       desc: "Comma-separated list of tags to match.", type: "string", initialValue: '"fire,debuff"' },
    {
      id: "matchMode", name: "Match mode",
      desc: "Any = buff needs at least one of the tags. All = buff must have every tag listed.",
      type: "combo",
      initialValue: "any",
      items: [{ any: "Any" }, { all: "All" }],
    },
  ],
};

export const expose = true;

export default function (tags, matchMode) {
  const tagSet = this._parseTags(tags);
  const mode   = this._combo(matchMode, ["any", "all"]);
  const toRemove = [];
  for (const [buffId, buff] of this._buffMap) {
    let match = mode === "all"
      ? [...tagSet].every(t => buff.tags.has(t))
      : [...tagSet].some(t => buff.tags.has(t));
    if (match) toRemove.push(buffId);
  }
  for (const buffId of toRemove) this.RemoveBuff(buffId);
}
