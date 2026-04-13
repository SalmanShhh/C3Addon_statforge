export const config = {
  listName: "Set rule auto-reset value",
  displayText: "After rule {0} fires, reset its stat to {1}",
  description: "After the threshold rule fires, automatically resets the watched stat's base value to the given number. Set to 0 for the classic 'every 5 hits' combo reset pattern.",
  params: [
    { id: "ruleId",     name: "Rule ID",     desc: "The rule to configure.", type: "string", initialValue: '"my_rule"' },
    { id: "resetValue", name: "Reset value", desc: "The value to reset the stat to after the rule fires.", type: "number", initialValue: "0" },
  ],
};

export const expose = true;

export default function (ruleId, resetValue) {
  const rule = this._thresholdMap.get(ruleId);
  if (rule) rule.autoResetValue = resetValue;
}
