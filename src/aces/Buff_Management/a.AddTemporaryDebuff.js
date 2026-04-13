export const config = {
  listName: "Add timed debuff",
  displayText: "Add timed debuff {0} to stat {1} value {2} for {3} seconds tags {4}",
  description: "Adds a debuff that automatically expires after the given number of seconds. Automatically includes the 'debuff' tag. Fires 'On buff expired' and 'On buff removed' when time runs out.",
  params: [
    { id: "buffId",   name: "Buff ID",          desc: "A unique name for this debuff, e.g. \"slow\".", type: "string", initialValue: '"slow"' },
    { id: "stat",     name: "Stat",             desc: "The stat this debuff changes.", type: "string", initialValue: '"speed"' },
    { id: "value",    name: "Value",            desc: "The modifier amount. Negative for reductions.", type: "number", initialValue: "-20" },
    { id: "duration", name: "Duration (secs)",  desc: "How many seconds before the debuff expires.", type: "number", initialValue: "5" },
    { id: "tags",     name: "Extra Tags",       desc: "Additional labels beyond 'debuff'. Use \"\" for none.", type: "string", initialValue: '""' },
  ],
};

export const expose = true;

export default function (buffId, stat, value, duration, tags) {
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
    temporary:   true,
    duration:    Math.max(0, duration),
    elapsed:     0,
    timerPaused: false,
  });
}
