export const config = {
  returnType: "number",
  description: "Returns the combined multiplier for the stat as a percentage bonus. For example, a multiplier of 1.5 returns 50, and 1.0 (no bonus) returns 0.",
  params: [
    { id: "stat", name: "Stat", desc: "The stat name.", type: "string" },
  ],
};

export const expose = false;

export default function (stat) {
  return this.statMultiplierPercent(stat);
}
