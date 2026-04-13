export const config = {
  listName: "Add buff (full options)",
  displayText: "Add buff {0} to stat {1} value {2} mode {3} tags {4} source {5}",
  description: "Adds a permanent buff with full control over all options in a single action. The source lets you label who created this buff so you can remove it all at once later (e.g. when an item is unequipped).",
  params: [
    { id: "buffId",  name: "Buff ID",  desc: "A unique name for this buff.", type: "string", initialValue: '"my_buff"' },
    { id: "stat",    name: "Stat",     desc: "The stat this buff changes.", type: "string", initialValue: '"attack"' },
    { id: "value",   name: "Value",    desc: "The modifier amount.", type: "number", initialValue: "10" },
    {
      id: "mode", name: "Stacking mode",
      desc: "Add = flat bonus. Multiply = percentage bonus. Override = replaces total if highest.",
      type: "combo",
      initialValue: "add",
      items: [{ add: "Add" }, { multiply: "Multiply" }, { override: "Override" }],
    },
    { id: "tags",    name: "Tags",     desc: "Comma-separated group labels.", type: "string", initialValue: '""' },
    { id: "source",  name: "Source",   desc: "Label for who created this buff, e.g. \"sword_of_fire\". Use \"\" for none.", type: "string", initialValue: '""' },
  ],
};

export const expose = true;

export default function (buffId, stat, value, mode, tags, source) {
  const modeStr = this._combo(mode, ["add", "multiply", "override"]);
  this._addBuff({
    id:          buffId,
    stat,
    value,
    mode:        modeStr,
    tags:        this._parseTags(tags),
    source:      source ?? "",
    active:      true,
    temporary:   false,
    duration:    0,
    elapsed:     0,
    timerPaused: false,
  });
}
