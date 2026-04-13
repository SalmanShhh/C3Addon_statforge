export const config = {
  returnType: "number",
  description: "Returns the number of buffs that are currently enabled (active = true).",
  params: [],
};

export const expose = false;

export default function () {
  let count = 0;
  for (const buff of this._buffMap.values()) { if (buff.active) count++; }
  return count;
}
