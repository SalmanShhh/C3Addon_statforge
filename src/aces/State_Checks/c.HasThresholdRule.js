export const config = {
  listName: "Has threshold rule",
  displayText: "Has threshold rule {0}",
  description: "True if a threshold rule with this ID currently exists.",
  params: [
    { id: "ruleId", name: "Rule ID", desc: "The rule ID to check.", type: "string", initialValue: '"my_rule"' },
  ],
};

export const expose = false;

export default function (ruleId) {
  return this._thresholdMap.has(ruleId);
}
