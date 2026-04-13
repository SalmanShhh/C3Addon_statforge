export const config = {
  returnType: "number",
  description: "Returns the combined multiplier for the stat: 1 + (sum of all active Multiply buff values / 100). Returns 1.0 if no multiply buffs are active (meaning no bonus).",
  params: [
    { id: "stat", name: "Stat", desc: "The stat name.", type: "string" },
  ],
};

export const expose = false;

export default function (stat) {
  let sum = 0;
  for (const buff of this._buffMap.values()) {
    if (buff.stat === stat && buff.active && buff.mode === "multiply") sum += buff.value;
  }
  return 1 + sum / 100;
}
