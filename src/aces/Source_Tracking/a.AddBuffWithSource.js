export const config = {
  listName: "Add buff with source",
  displayText: "Add buff {0} to stat {1} value {2} tags {3} source {4}",
  description: "Adds a permanent additive buff and tags it with a source label. Use the Remove buffs by source action to strip everything this source added in one call.",
  params: [
    { id: "buffId",  name: "Buff ID",  desc: "A unique name for this buff.", type: "string", initialValue: '"my_buff"' },
    { id: "stat",    name: "Stat",     desc: "The stat this buff changes.", type: "string", initialValue: '"attack"' },
    { id: "value",   name: "Value",    desc: "The modifier amount.", type: "number", initialValue: "10" },
    { id: "tags",    name: "Tags",     desc: "Comma-separated group labels. Use \"\" for none.", type: "string", initialValue: '""' },
    { id: "source",  name: "Source",   desc: "Who created this buff, e.g. \"sword_of_fire\" or an object UID.", type: "string", initialValue: '"item_id"' },
  ],
};

export const expose = true;

export default function (buffId, stat, value, tags, source) {
  this._addBuff({
    id: buffId, stat, value,
    mode: "add",
    tags: this._parseTags(tags),
    source: source ?? "",
    active: true, temporary: false, duration: 0, elapsed: 0, timerPaused: false,
  });
}
