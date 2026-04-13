export const config = {
  listName: "Add timed buff (full options)",
  displayText: "Add timed buff {0} to stat {1} value {2} mode {3} for {4}s tags {5} source {6}",
  description: "Adds a timed buff with full control: stacking mode, duration, tags, and source all in one action.",
  params: [
    { id: "buffId",   name: "Buff ID",          desc: "A unique name for this buff.", type: "string", initialValue: '"my_buff"' },
    { id: "stat",     name: "Stat",             desc: "The stat this buff changes.", type: "string", initialValue: '"attack"' },
    { id: "value",    name: "Value",            desc: "The modifier amount.", type: "number", initialValue: "10" },
    {
      id: "mode", name: "Stacking mode",
      desc: "Add = flat bonus. Multiply = percentage bonus. Override = replaces total if highest.",
      type: "combo",
      initialValue: "add",
      items: [{ add: "Add" }, { multiply: "Multiply" }, { override: "Override" }],
    },
    { id: "duration", name: "Duration (secs)",  desc: "How many seconds before the buff expires.", type: "number", initialValue: "5" },
    { id: "tags",     name: "Tags",             desc: "Comma-separated group labels.", type: "string", initialValue: '""' },
    { id: "source",   name: "Source",           desc: "Label for who created this buff. Use \"\" for none.", type: "string", initialValue: '""' },
  ],
};

export const expose = true;

export default function (buffId, stat, value, mode, duration, tags, source) {
  const modeStr = this._combo(mode, ["add", "multiply", "override"]);
  this._addBuff({
    id:          buffId,
    stat,
    value,
    mode:        modeStr,
    tags:        this._parseTags(tags),
    source:      source ?? "",
    active:      true,
    temporary:   true,
    duration:    Math.max(0, duration),
    elapsed:     0,
    timerPaused: false,
  });
}
