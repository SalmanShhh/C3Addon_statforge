export const config = {
  listName: "Add buff from JSON",
  displayText: "Add buff from JSON: {0}",
  description: "Registers a buff from a JSON string. Useful for loading buffs from files or variables. The JSON must follow the buff definition format from the documentation.",
  params: [
    { id: "json", name: "JSON string", desc: "A JSON object describing the buff. Must include at least \"id\", \"stat\", and \"value\".", type: "string", initialValue: '"{}"' },
  ],
};

export const expose = true;

export default function (json) {
  let def;
  try { def = JSON.parse(json); } catch (e) {
    if (this._debugMode) console.warn("[StatForge] AddBuffFromJson: invalid JSON", e);
    return;
  }
  if (!def || !def.id || !def.stat) return;
  const modeMap = { add: "add", multiply: "multiply", override: "override" };
  const prevTotal = this._computeStatTotal(def.stat);
  const entry = {
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
  };
  this._addBuff(entry);
}
