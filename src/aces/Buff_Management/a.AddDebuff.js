export const config = {
  listName: "Add debuff",
  displayText: "Add debuff {0} to stat {1} with value {2} and tags {3}",
  description: "Adds a permanent debuff to the object. Automatically includes the 'debuff' tag so you can cleanse all debuffs at once. Any extra tags you supply are added alongside it.",
  params: [
    { id: "buffId", name: "Buff ID",  desc: "A unique name for this debuff, e.g. \"weakness\".", type: "string", initialValue: '"my_debuff"' },
    { id: "stat",   name: "Stat",     desc: "The stat this debuff changes, e.g. \"attack\" or \"speed\".", type: "string", initialValue: '"attack"' },
    { id: "value",  name: "Value",    desc: "How much to add to the stat. Negative values reduce the stat.", type: "number", initialValue: "-10" },
    { id: "tags",   name: "Extra Tags", desc: "Additional comma-separated labels beyond 'debuff', e.g. \"poison,fire\". Use \"\" for none.", type: "string", initialValue: '""' },
  ],
};

export const expose = true;

export default function (buffId, stat, value, tags) {
  const tagSet = this._parseTags(tags);
  tagSet.add("debuff");
  this._addBuff({
    id:          buffId,
    stat,
    value,
    mode:        "add",
    tags:        tagSet,
    source:      "",
    active:      true,
    temporary:   false,
    duration:    0,
    elapsed:     0,
    timerPaused: false,
  });
}
