export const config = {
  listName: "Add threshold rule",
  displayText: "Add rule {0}: when {1} {2} {3} → {5} buff {4}",
  description: "Registers a rule that watches a stat and automatically fires an action on a buff when the stat crosses a threshold number. For example: 'when hit_count reaches 5, activate berserk_buff'.",
  params: [
    { id: "ruleId",      name: "Rule ID",       desc: "A unique name for this rule.", type: "string", initialValue: '"my_rule"' },
    { id: "watchStat",   name: "Watch stat",    desc: "The stat to monitor.", type: "string", initialValue: '"hit_count"' },
    { id: "threshold",   name: "Threshold",     desc: "The value the stat must cross to fire the rule.", type: "number", initialValue: "5" },
    {
      id: "triggerMode", name: "Trigger when",
      desc: "Reaches = fires when stat goes from below the threshold to at or above it. Falls below = fires when stat goes from at or above back below it.",
      type: "combo",
      initialValue: "reach",
      items: [{ reach: "Reaches threshold" }, { drop_below: "Falls below threshold" }],
    },
    { id: "targetBuffId", name: "Target buff",    desc: "The buff that receives the action when the rule fires.", type: "string", initialValue: '"berserk_buff"' },
    {
      id: "ruleAction",   name: "Action",
      desc: "What to do to the target buff when the rule fires.",
      type: "combo",
      initialValue: "activate",
      items: [{ activate: "Activate" }, { deactivate: "Deactivate" }, { remove: "Remove" }, { add_from_template: "Add from template" }],
    },
  ],
};

export const expose = true;

export default function (ruleId, watchStat, threshold, triggerMode, targetBuffId, ruleAction) {
  const triggerStr = this._combo(triggerMode, ["reach", "drop_below"]);
  const actionStr  = this._combo(ruleAction,  ["activate", "deactivate", "remove", "add_from_template"]);
  this._thresholdMap.set(ruleId, {
    ruleId,
    watchStat,
    threshold,
    triggerMode:    triggerStr,
    targetBuffId,
    ruleAction:     actionStr,
    autoResetValue: null,
    canRepeat:      false,
    armed:          true,
    _prevAbove:     this._computeStatTotal(watchStat) >= threshold,
    _inFlight:      false,
  });
  this._trigger("OnThresholdRuleAdded");
  this._log(`Threshold rule added: ${ruleId}`);
}
