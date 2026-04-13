export const config = {
  listName: "Remove threshold rule",
  displayText: "Remove threshold rule {0}",
  description: "Removes a threshold rule so it will no longer fire.",
  params: [
    { id: "ruleId", name: "Rule ID", desc: "The rule to remove.", type: "string", initialValue: '"my_rule"' },
  ],
};

export const expose = true;

export default function (ruleId) {
  this._thresholdMap.delete(ruleId);
}
