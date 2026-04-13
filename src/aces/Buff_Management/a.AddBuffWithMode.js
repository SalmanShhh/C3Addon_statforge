export const config = {
  listName: "Add buff with stacking mode",
  displayText: "Add buff {0} to stat {1} value {2} mode {3} tags {4}",
  description: "Adds a permanent buff and lets you choose how it stacks with other buffs on the same stat. Add = flat bonus, Multiply = percentage bonus, Override = force to a specific value.",
  params: [
    { id: "buffId", name: "Buff ID",  desc: "A unique name for this buff.", type: "string", initialValue: '"my_buff"' },
    { id: "stat",   name: "Stat",     desc: "The stat this buff changes.", type: "string", initialValue: '"attack"' },
    { id: "value",  name: "Value",    desc: "The modifier amount.", type: "number", initialValue: "10" },
    {
      id: "mode", name: "Stacking mode",
      desc: "Add = flat bonus summed with others. Multiply = percentage bonus (value of 20 means +20%). Override = replaces the stat total if it is the highest override.",
      type: "combo",
      initialValue: "add",
      items: [{ add: "Add" }, { multiply: "Multiply" }, { override: "Override" }],
    },
    { id: "tags",   name: "Tags",     desc: "Comma-separated group labels. Use \"\" for none.", type: "string", initialValue: '""' },
  ],
};

export const expose = true;

export default function (buffId, stat, value, mode, tags) {
  const modeStr = this._combo(mode, ["add", "multiply", "override"]);
  this._addBuff({
    id:          buffId,
    stat,
    value,
    mode:        modeStr,
    tags:        this._parseTags(tags),
    source:      "",
    active:      true,
    temporary:   false,
    duration:    0,
    elapsed:     0,
    timerPaused: false,
  });
}
