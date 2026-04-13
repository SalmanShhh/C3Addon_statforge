export const config = {
  listName: "Enable/disable buffs by multiple tags",
  displayText: "Set buffs matching tags {0} ({1}) active: {2}",
  description: "Enables or disables buffs matching a tag list. 'Any' affects buffs with at least one matching tag. 'All' only affects buffs that have every tag listed.",
  params: [
    { id: "tags",      name: "Tags",       desc: "Comma-separated list of tags to match.", type: "string", initialValue: '"fire,buff"' },
    {
      id: "matchMode", name: "Match mode",
      desc: "Any = at least one tag matches. All = every tag must match.",
      type: "combo",
      initialValue: "any",
      items: [{ any: "Any" }, { all: "All" }],
    },
    { id: "active",    name: "Active",     desc: "True to enable, false to disable.", type: "boolean", initialValue: "true" },
  ],
};

export const expose = true;

export default function (tags, matchMode, active) {
  const tagSet = this._parseTags(tags);
  const mode   = this._combo(matchMode, ["any", "all"]);
  const matching = [];
  for (const [buffId, buff] of this._buffMap) {
    const match = mode === "all"
      ? [...tagSet].every(t => buff.tags.has(t))
      : [...tagSet].some(t => buff.tags.has(t));
    if (match) matching.push(buffId);
  }
  for (const buffId of matching) this._setBuffActive(buffId, active);
}
