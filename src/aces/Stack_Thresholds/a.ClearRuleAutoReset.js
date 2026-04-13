export const config = {
  listName: "Clear rule auto-reset",
  displayText: "Clear auto-reset on rule {0}",
  description: "Removes the auto-reset from a threshold rule. After the rule fires, the watched stat will no longer be automatically changed.",
  params: [
    { id: "ruleId", name: "Rule ID", desc: "The rule to update.", type: "string", initialValue: '"my_rule"' },
  ],
};

export const expose = true;

export default function (ruleId) {
  const rule = this._thresholdMap.get(ruleId);
  if (rule) rule.autoResetValue = null;
}
