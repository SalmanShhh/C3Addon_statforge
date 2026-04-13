export const config = {
  returnType: "number",
  description: "Returns the total number of buffs (active or inactive) that target the given stat.",
  params: [
    { id: "stat", name: "Stat", desc: "The stat name to count buffs for.", type: "string" },
  ],
};

export const expose = false;

export default function (stat) {
  let count = 0;
  for (const buff of this._buffMap.values()) { if (buff.stat === stat) count++; }
  return count;
}
