export const config = {
  listName: "Load buff stack from JSON",
  displayText: "Load buff stack from JSON: {0}",
  description: "Loads a JSON array of buff objects and adds them all to the stack in one action. Use this in 'On start of layout' to pre-load a character's starting buffs from a variable, JSON plugin, or inline string.",
  params: [
    {
      id: "json",
      name: "JSON string",
      desc: "A JSON array of buff objects, e.g. [{\"id\":\"base_hp\",\"stat\":\"hp\",\"value\":200}]. Each object supports: id, stat, value, mode, tags, source, active, temporary, duration.",
      type: "string",
      initialValue: '"[]"',
    },
  ],
};

export const expose = true;

export default function (json) {
  let arr;
  try {
    arr = JSON.parse(json);
  } catch (e) {
    if (this._debugMode) console.warn("[StatForge] Load buff stack from JSON: parse error:", e);
    return;
  }
  if (!Array.isArray(arr)) {
    if (this._debugMode) console.warn("[StatForge] Load buff stack from JSON: expected an array.");
    return;
  }
  const modeMap = { add: "add", multiply: "multiply", override: "override" };
  for (const def of arr) {
    if (!def || !def.id || !def.stat) continue;
    this._addBuff({
      id:          def.id,
      stat:        def.stat,
      value:       typeof def.value === "number" ? def.value : 0,
      mode:        modeMap[def.mode] ?? "add",
      tags:        this._parseTags(def.tags ?? ""),
      source:      def.source ?? "",
      active:      def.active !== false,
      temporary:   def.temporary === true,
      duration:    typeof def.duration === "number" ? def.duration : 0,
      elapsed:     0,
      timerPaused: false,
    });
  }
}
