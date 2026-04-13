export const config = {
  returnType: "number",
  description: "Returns the number of threshold rules that are currently armed and ready to fire on the next qualifying threshold crossing.",
  params: [],
};

export const expose = false;

export default function () {
  let count = 0;
  for (const rule of this._thresholdMap.values()) { if (rule.armed) count++; }
  return count;
}
