export const config = {
  listName: "Add timed buff with source",
  displayText: "Add timed buff {0} to stat {1} value {2} for {3}s tags {4} source {5}",
  description: "Adds an additive timed buff and stamps it with a source label. The buff expires after the given seconds.",
  params: [
    { id: "buffId",   name: "Buff ID",         desc: "A unique name for this buff.", type: "string", initialValue: '"my_buff"' },
    { id: "stat",     name: "Stat",            desc: "The stat this buff changes.", type: "string", initialValue: '"speed"' },
    { id: "value",    name: "Value",           desc: "The modifier amount.", type: "number", initialValue: "10" },
    { id: "duration", name: "Duration (secs)", desc: "Seconds before the buff expires.", type: "number", initialValue: "5" },
    { id: "tags",     name: "Tags",            desc: "Comma-separated group labels.", type: "string", initialValue: '""' },
    { id: "source",   name: "Source",          desc: "Who created this buff.", type: "string", initialValue: '"item_id"' },
  ],
};

export const expose = true;

export default function (buffId, stat, value, duration, tags, source) {
  this._addBuff({
    id: buffId, stat, value,
    mode: "add",
    tags: this._parseTags(tags),
    source: source ?? "",
    active: true, temporary: true,
    duration: Math.max(0, duration), elapsed: 0, timerPaused: false,
  });
}
