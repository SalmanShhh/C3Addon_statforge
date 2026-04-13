export const config = {
  listName: "Add timed debuff (full options)",
  displayText: "Add timed debuff {0} to stat {1} value {2} mode {3} for {4}s tags {5} source {6}",
  description: "Adds a timed debuff with full control: stacking mode, duration, extra tags, and source all in one action. Automatically includes the 'debuff' tag.",
  params: [
    { id: "buffId",   name: "Buff ID",          desc: "A unique name for this debuff.", type: "string", initialValue: '"my_debuff"' },
    { id: "stat",     name: "Stat",             desc: "The stat this debuff changes.", type: "string", initialValue: '"attack"' },
    { id: "value",    name: "Value",            desc: "The modifier amount. Negative for reductions.", type: "number", initialValue: "-10" },
    {
      id: "mode", name: "Stacking mode",
      desc: "Add = flat reduction. Multiply = percentage reduction. Override = replaces total if highest.",
      type: "combo",
      initialValue: "add",
      items: [{ add: "Add" }, { multiply: "Multiply" }, { override: "Override" }],
    },
    { id: "duration", name: "Duration (secs)",  desc: "How many seconds before the debuff expires.", type: "number", initialValue: "5" },
    { id: "tags",     name: "Extra Tags",       desc: "Additional labels beyond 'debuff', e.g. \"curse,fire\". Use \"\" for none.", type: "string", initialValue: '""' },
    { id: "source",   name: "Source",           desc: "Who applied this debuff. Use \"\" for none.", type: "string", initialValue: '""' },
  ],
};

export const expose = true;

export default function (buffId, stat, value, mode, duration, tags, source) {
  const modeStr = this._combo(mode, ["add", "multiply", "override"]);
  const tagSet = this._parseTags(tags);
  tagSet.add("debuff");
  this._addBuff({
    id:          buffId,
    stat,
    value,
    mode:        modeStr,
    tags:        tagSet,
    source:      source ?? "",
    active:      true,
    temporary:   true,
    duration:    Math.max(0, duration),
    elapsed:     0,
    timerPaused: false,
  });
}
