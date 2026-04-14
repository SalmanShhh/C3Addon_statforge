export const config = {
  returnType: "number",
  description: "Returns the base value of the named stat before any buffs are applied. Returns 0 if no base has been set.",
  params: [
    { id: "stat", name: "Stat", desc: "The stat name.", type: "string" },
  ],
};

export const expose = false;

export default function (stat) {
  return this.statBase(stat);
}
