export const config = {
  returnType: "number",
  description: "Returns the number of buffs whose source exactly matches the given string.",
  params: [
    { id: "source", name: "Source", desc: "The source label to count.", type: "string" },
  ],
};

export const expose = false;

export default function (source) {
  let count = 0;
  for (const buff of this._buffMap.values()) { if (buff.source === source) count++; }
  return count;
}
