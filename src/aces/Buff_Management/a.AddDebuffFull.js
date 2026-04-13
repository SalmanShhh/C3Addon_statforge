export const config = {
  listName: "Add debuff (full options)",
  displayText: "Add debuff {0} to stat {1} value {2} mode {3} tags {4} source {5}",
  description: "Adds a permanent debuff with full control over stacking mode, tags, and source. Automatically includes the 'debuff' tag. The source lets you remove all debuffs from the same origin at once.",
  params: [
    { id: "buffId",  name: "Buff ID",  desc: "A unique name for this debuff.", type: "string", initialValue: '"my_debuff"' },
    { id: "stat",    name: "Stat",     desc: "The stat this debuff changes.", type: "string", initialValue: '"attack"' },
    { id: "value",   name: "Value",    desc: "The modifier amount. Negative for reductions.", type: "number", initialValue: "-10" },
    {
      id: "mode", name: "Stacking mode",
      desc: "Add = flat reduction. Multiply = percentage reduction. Override = replaces total if highest.",
      type: "combo",
      initialValue: "add",
      items: [{ add: "Add" }, { multiply: "Multiply" }, { override: "Override" }],
    },
    { id: "tags",   name: "Extra Tags", desc: "Additional labels beyond 'debuff', e.g. \"curse,fire\". Use \"\" for none.", type: "string", initialValue: '""' },
    { id: "source", name: "Source",     desc: "Who applied this debuff, e.g. \"enemy_wizard\". Use \"\" for none.", type: "string", initialValue: '""' },
  ],
};

export const expose = true;

export default function (buffId, stat, value, mode, tags, source) {
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
    temporary:   false,
    duration:    0,
    elapsed:     0,
    timerPaused: false,
  });
}
