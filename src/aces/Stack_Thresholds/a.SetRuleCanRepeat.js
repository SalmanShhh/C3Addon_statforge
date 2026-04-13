export const config = {
  listName: "Set rule can repeat",
  displayText: "Set rule {0} can repeat: {1}",
  description: "Controls whether a threshold rule re-arms itself after firing. Set to true for repeating patterns like 'every 5 hits'. Set to false for one-time triggers.",
  params: [
    { id: "ruleId",    name: "Rule ID",    desc: "The rule to configure.", type: "string", initialValue: '"my_rule"' },
    { id: "canRepeat", name: "Can repeat", desc: "True to re-arm after each fire, false to fire only once.", type: "boolean", initialValue: "true" },
  ],
};

export const expose = true;

export default function (ruleId, canRepeat) {
  const rule = this._thresholdMap.get(ruleId);
  if (rule) rule.canRepeat = canRepeat;
}
