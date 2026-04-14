export const config = {
  returnType: "number",
  description: "Returns the threshold value from the most recent 'On threshold reached' event.",
  params: [],
};

export const expose = false;

export default function () {
  return this.lastRuleThreshold();
}
