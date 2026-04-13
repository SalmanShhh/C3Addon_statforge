export const config = {
  returnType: "number",
  description: "Returns the number of active buffs targeting the given stat.",
  params: [
    { id: "stat", name: "Stat", desc: "The stat name.", type: "string" },
  ],
};

export const expose = false;

export default function (stat) {
  let count = 0;
  for (const buff of this._buffMap.values()) { if (buff.stat === stat && buff.active) count++; }
  return count;
}
