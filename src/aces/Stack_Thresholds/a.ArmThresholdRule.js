export const config = {
  listName: "Re-arm threshold rule",
  displayText: "Re-arm threshold rule {0}",
  description: "Re-enables a threshold rule that previously fired and was not set to repeat. The rule will fire again on the next qualifying threshold crossing.",
  params: [
    { id: "ruleId", name: "Rule ID", desc: "The rule to re-arm.", type: "string", initialValue: '"my_rule"' },
  ],
};

export const expose = true;

export default function (ruleId) {
  const rule = this._thresholdMap.get(ruleId);
  if (rule) rule.armed = true;
}
