export const config = {
  returnType: "number",
  description: "Returns the raw sum of all active 'Add' mode buff values on the stat, before multipliers or overrides are applied.",
  params: [
    { id: "stat", name: "Stat", desc: "The stat name.", type: "string" },
  ],
};

export const expose = false;

export default function (stat) {
  let sum = 0;
  for (const buff of this._buffMap.values()) {
    if (buff.stat === stat && buff.active && buff.mode === "add") sum += buff.value;
  }
  return sum;
}
