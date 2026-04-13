export const config = {
  returnType: "string",
  description: "Returns the stat name of the buff from the most recent buff event. Only valid inside buff trigger conditions.",
  params: [],
};

export const expose = false;

export default function () {
  return this._lastBuffStat;
}
