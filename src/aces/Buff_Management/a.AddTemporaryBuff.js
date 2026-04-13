export const config = {
  listName: "Add timed buff",
  displayText: "Add timed buff {0} to stat {1} value {2} for {3} seconds tags {4}",
  description: "Adds a buff that automatically expires after the given number of seconds. Fires 'On buff expired' and 'On buff removed' when time runs out.",
  params: [
    { id: "buffId",   name: "Buff ID",          desc: "A unique name for this buff.", type: "string", initialValue: '"speed_boost"' },
    { id: "stat",     name: "Stat",             desc: "The stat this buff changes.", type: "string", initialValue: '"speed"' },
    { id: "value",    name: "Value",            desc: "The modifier amount.", type: "number", initialValue: "10" },
    { id: "duration", name: "Duration (secs)",  desc: "How many seconds before the buff expires.", type: "number", initialValue: "5" },
    { id: "tags",     name: "Tags",             desc: "Comma-separated group labels. Use \"\" for none.", type: "string", initialValue: '""' },
  ],
};

export const expose = true;

export default function (buffId, stat, value, duration, tags) {
  this._addBuff({
    id:          buffId,
    stat,
    value,
    mode:        "add",
    tags:        this._parseTags(tags),
    source:      "",
    active:      true,
    temporary:   true,
    duration:    Math.max(0, duration),
    elapsed:     0,
    timerPaused: false,
  });
}
