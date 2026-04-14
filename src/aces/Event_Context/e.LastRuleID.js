export const config = {
  returnType: "string",
  description: "Returns the rule ID from the most recent 'On threshold reached' event.",
  params: [],
};

export const expose = false;

export default function () {
  return this.lastRuleID();
}
