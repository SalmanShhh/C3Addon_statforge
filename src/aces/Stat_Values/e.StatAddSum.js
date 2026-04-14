export const config = {
  returnType: "number",
  description: "Returns the raw sum of all active 'Add' mode buff values on the stat, before multipliers or overrides are applied.",
  params: [
    { id: "stat", name: "Stat", desc: "The stat name.", type: "string" },
  ],
};

export const expose = false;

export default function (stat) {
  return this.statAddSum(stat);
}
