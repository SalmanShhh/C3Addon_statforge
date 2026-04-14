export const config = {
  returnType: "number",
  description: "Returns the combined multiplier for the stat: 1 + (sum of all active Multiply buff values / 100). Returns 1.0 if no multiply buffs are active (meaning no bonus).",
  params: [
    { id: "stat", name: "Stat", desc: "The stat name.", type: "string" },
  ],
};

export const expose = false;

export default function (stat) {
  return this.statMultiplier(stat);
}
