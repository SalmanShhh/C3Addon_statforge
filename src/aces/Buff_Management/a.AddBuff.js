export const config = {
  listName: "Add buff",
  displayText: "Add buff {0} to stat {1} with value {2} and tags {3}",
  description: "Adds a permanent buff to the object. If a buff with the same ID already exists it will be replaced. Use tags to group buffs together for easy removal later.",
  params: [
    { id: "buffId",  name: "Buff ID",  desc: "A unique name for this buff, e.g. \"sword_bonus\".",  type: "string", initialValue: '"my_buff"' },
    { id: "stat",    name: "Stat",     desc: "The stat this buff changes, e.g. \"attack\" or \"speed\".", type: "string", initialValue: '"attack"' },
    { id: "value",   name: "Value",    desc: "How much to add to the stat. Use negative values for debuffs.", type: "number", initialValue: "10" },
    { id: "tags",    name: "Tags",     desc: "Comma-separated labels for grouping, e.g. \"fire,buff\". Use \"\" for none.", type: "string", initialValue: '""' },
  ],
};

export const expose = true;

export default function (buffId, stat, value, tags) {
  this._addBuff({
    id:          buffId,
    stat,
    value,
    mode:        "add",
    tags:        this._parseTags(tags),
    source:      "",
    active:      true,
    temporary:   false,
    duration:    0,
    elapsed:     0,
    timerPaused: false,
  });
}
