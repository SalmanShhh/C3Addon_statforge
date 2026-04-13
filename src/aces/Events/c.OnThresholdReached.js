export const config = {
  listName: "On threshold reached",
  displayText: "On threshold reached",
  description: "Fires when a threshold rule executes its action. Use LastRuleID, LastRuleWatchStat, LastRuleThreshold, LastRuleTargetBuff, and LastRuleAction inside this event. Add 'LastRuleID = \"my_rule\"' as a sub-condition to filter for a specific rule.",
  isTrigger: true,
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
