export const config = {
  listName: "Stat total is in range",
  displayText: "Stat {0} total is between {1} and {2}",
  description: "True if the computed total of the stat falls within the given range (inclusive on both ends).",
  params: [
    { id: "stat",   name: "Stat",      desc: "The stat to check.", type: "string", initialValue: '"health"' },
    { id: "minVal", name: "Min value", desc: "The lower bound (inclusive).", type: "number", initialValue: "0" },
    { id: "maxVal", name: "Max value", desc: "The upper bound (inclusive).", type: "number", initialValue: "100" },
  ],
};

export const expose = false;

export default function (stat, minVal, maxVal) {
  const total = this._computeStatTotal(stat);
  return total >= minVal && total <= maxVal;
}
