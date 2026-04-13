export const config = {
  returnType: "string",
  description: "Returns the ID of the buff at the given index among buffs targeting the given stat. Returns an empty string if out of range. Pair with CountBuffsOnStat.",
  params: [
    { id: "stat",  name: "Stat",  desc: "The stat name.", type: "string" },
    { id: "index", name: "Index", desc: "0-based position in the filtered list.", type: "number" },
  ],
};

export const expose = false;

export default function (stat, index) {
  let i = 0;
  for (const buff of this._buffMap.values()) {
    if (buff.stat === stat) {
      if (i === index) return buff.id;
      i++;
    }
  }
  return "";
}
