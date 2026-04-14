export const config = {
  listName: "Threshold rule is armed",
  displayText: "Threshold rule {0} is armed",
  description: "True if the threshold rule exists and will fire on the next qualifying threshold crossing. Rules that have fired and are not set to repeat will return false here.",
  params: [
    { id: "ruleId", name: "Rule ID", desc: "The rule ID to check.", type: "string", initialValue: '"my_rule"' },
  ],
};

export const expose = false;

export default function (ruleId) {
  return this.isThresholdRuleArmed(ruleId);
}
