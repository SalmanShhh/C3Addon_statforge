<img src="./src/icon.svg" width="100" /><br>
# StatForge
<i>A layered buff and debuff system. Attach to any object to give it named stats that can be boosted, reduced, timed, or chained together using a stack of modifiers.</i> <br>
### Version 1.2.0.0

[<img src="https://placehold.co/200x50/4493f8/FFF?text=Download&font=montserrat" width="200"/>](https://github.com/SalmanShhh/C3Addon_statforge/releases/download/salmanshh_statforge-1.2.0.0.c3addon/salmanshh_statforge-1.2.0.0.c3addon)
<br>
<sub> [See all releases](https://github.com/SalmanShhh/C3Addon_statforge/releases) </sub> <br>

#### What's New in 1.2.0.0
- **Added:** - Add scripting API and refactor ACEs to use it
- **Added:** - Update Guide/Documentation

<sub>[View full changelog](#changelog)</sub>

---
<b><u>Author:</u></b> SalmanShh <br>
<sub>Made using [CAW](https://marketplace.visualstudio.com/items?itemName=skymen.caw) </sub><br>

## Table of Contents
- [Usage](#usage)
- [Examples Files](#examples-files)
- [Properties](#properties)
- [Actions](#actions)
- [Conditions](#conditions)
- [Expressions](#expressions)
---
## Usage
To build the addon, run the following commands:

```
npm i
npm run build
```

To run the dev server, run

```
npm i
npm run dev
```

## Examples Files

---
## Properties
| Property Name | Description | Type |
| --- | --- | --- |
| Auto-tick timers | Automatically counts down temporary buff timers every frame. Disable if you want to advance timers manually. | check |
| Overflow mode | What happens when a stat total goes outside the Min/Max range. Clamp = stop at the boundary. Wrap = loop around. None = no limit. | combo |
| Min value | The lowest a stat total can go when Overflow mode is Clamp or Wrap. | float |
| Max value | The highest a stat total can go when Overflow mode is Clamp or Wrap. | float |
| Debug mode | Logs every buff change, link fire, and threshold trigger to the browser console. Turn off before releasing. | check |


---
## Actions
| Action | Description | Params
| --- | --- | --- |
| Enable or disable buff | Enables or disables a buff without removing it. Disabled buffs stay in the stack but do not contribute to stat totals. | Buff ID             *(string)* <br>Active             *(boolean)* <br> |
| Enable/disable buffs by tag | Enables or disables every buff that has the given tag. Useful for suppressing an entire group of buffs at once. | Tag             *(string)* <br>Active             *(boolean)* <br> |
| Enable/disable buffs by multiple tags | Enables or disables buffs matching a tag list. 'Any' affects buffs with at least one matching tag. 'All' only affects buffs that have every tag listed. | Tags             *(string)* <br>Match mode             *(combo)* <br>Active             *(boolean)* <br> |
| Toggle buff on/off | Flips a buff between enabled and disabled. If it was on it turns off, and vice versa. | Buff ID             *(string)* <br> |
| Add buff link | Creates a reactive link between two buffs. When the source buff has a certain event (e.g. it expires), an action is automatically performed on the target buff. Useful for chains like 'when shield expires, remove armour bonus'. | Link ID             *(string)* <br>Source buff             *(string)* <br>Trigger event             *(combo)* <br>Target buff             *(string)* <br>Target action             *(combo)* <br> |
| Add buff link from JSON | Registers a buff link from a JSON string. See the documentation for the buff link definition format. | JSON string             *(string)* <br> |
| Clear all buff links | Removes all registered buff links. The buff stack is not affected. |  |
| Remove all links for a buff | Removes every link where the given buff is either the trigger (source) or the target. Call this before removing a buff that has links to avoid ghost references. | Buff ID             *(string)* <br> |
| Remove buff link | Removes a specific buff link by its ID. The buffs it connected are not affected. | Link ID             *(string)* <br> |
| Add buff | Adds a permanent buff to the object. If a buff with the same ID already exists it will be replaced. Use tags to group buffs together for easy removal later. | Buff ID             *(string)* <br>Stat             *(string)* <br>Value             *(number)* <br>Tags             *(string)* <br> |
| Add buff from JSON | Registers a buff from a JSON string. Useful for loading buffs from files or variables. The JSON must follow the buff definition format from the documentation. | JSON string             *(string)* <br> |
| Add buff (full options) | Adds a permanent buff with full control over all options in a single action. The source lets you label who created this buff so you can remove it all at once later (e.g. when an item is unequipped). | Buff ID             *(string)* <br>Stat             *(string)* <br>Value             *(number)* <br>Stacking mode             *(combo)* <br>Tags             *(string)* <br>Source             *(string)* <br> |
| Add buff with stacking mode | Adds a permanent buff and lets you choose how it stacks with other buffs on the same stat. Add = flat bonus, Multiply = percentage bonus, Override = force to a specific value. | Buff ID             *(string)* <br>Stat             *(string)* <br>Value             *(number)* <br>Stacking mode             *(combo)* <br>Tags             *(string)* <br> |
| Add debuff | Adds a permanent debuff to the object. Automatically includes the 'debuff' tag so you can cleanse all debuffs at once. Any extra tags you supply are added alongside it. | Buff ID             *(string)* <br>Stat             *(string)* <br>Value             *(number)* <br>Extra Tags             *(string)* <br> |
| Add debuff (full options) | Adds a permanent debuff with full control over stacking mode, tags, and source. Automatically includes the 'debuff' tag. The source lets you remove all debuffs from the same origin at once. | Buff ID             *(string)* <br>Stat             *(string)* <br>Value             *(number)* <br>Stacking mode             *(combo)* <br>Extra Tags             *(string)* <br>Source             *(string)* <br> |
| Add debuff with stacking mode | Adds a permanent debuff with a chosen stacking mode. Automatically includes the 'debuff' tag. Use 'multiply' for percentage penalties (e.g. -30 = -30% speed) and 'override' to hard-cap a stat. | Buff ID             *(string)* <br>Stat             *(string)* <br>Value             *(number)* <br>Stacking mode             *(combo)* <br>Extra Tags             *(string)* <br> |
| Add timed buff | Adds a buff that automatically expires after the given number of seconds. Fires 'On buff expired' and 'On buff removed' when time runs out. | Buff ID             *(string)* <br>Stat             *(string)* <br>Value             *(number)* <br>Duration (secs)             *(number)* <br>Tags             *(string)* <br> |
| Add timed buff (full options) | Adds a timed buff with full control: stacking mode, duration, tags, and source all in one action. | Buff ID             *(string)* <br>Stat             *(string)* <br>Value             *(number)* <br>Stacking mode             *(combo)* <br>Duration (secs)             *(number)* <br>Tags             *(string)* <br>Source             *(string)* <br> |
| Add timed debuff | Adds a debuff that automatically expires after the given number of seconds. Automatically includes the 'debuff' tag. Fires 'On buff expired' and 'On buff removed' when time runs out. | Buff ID             *(string)* <br>Stat             *(string)* <br>Value             *(number)* <br>Duration (secs)             *(number)* <br>Extra Tags             *(string)* <br> |
| Add timed debuff (full options) | Adds a timed debuff with full control: stacking mode, duration, extra tags, and source all in one action. Automatically includes the 'debuff' tag. | Buff ID             *(string)* <br>Stat             *(string)* <br>Value             *(number)* <br>Stacking mode             *(combo)* <br>Duration (secs)             *(number)* <br>Extra Tags             *(string)* <br>Source             *(string)* <br> |
| Clear all buffs | Removes every buff from this object at once. Fires 'On buff removed' for each buff, then 'On stack cleared' once at the end. |  |
| Load buff stack from JSON | Loads a JSON array of buff objects and adds them all to the stack in one action. Use this in 'On start of layout' to pre-load a character's starting buffs from a variable, JSON plugin, or inline string. | JSON string             *(string)* <br> |
| Remove buff | Removes the buff with this ID. If no buff with this ID exists nothing happens. | Buff ID             *(string)* <br> |
| Remove buffs by tag | Removes every buff that has the given tag. Fires 'On buff removed' for each one. | Tag             *(string)* <br> |
| Remove buffs by multiple tags | Removes buffs that match a list of tags. 'Any' removes buffs that have at least one of the tags. 'All' removes only buffs that have every tag in the list. | Tags             *(string)* <br>Match mode             *(combo)* <br> |
| Remove all buffs on stat | Removes every buff that targets the given stat, regardless of their tags or source. | Stat             *(string)* <br> |
| Add buff with source | Adds a permanent additive buff and tags it with a source label. Use the Remove buffs by source action to strip everything this source added in one call. | Buff ID             *(string)* <br>Stat             *(string)* <br>Value             *(number)* <br>Tags             *(string)* <br>Source             *(string)* <br> |
| Add timed buff with source | Adds an additive timed buff and stamps it with a source label. The buff expires after the given seconds. | Buff ID             *(string)* <br>Stat             *(string)* <br>Value             *(number)* <br>Duration (secs)             *(number)* <br>Tags             *(string)* <br>Source             *(string)* <br> |
| Remove buffs by source | Removes every buff whose source matches the given label exactly. Use this when an item is unequipped or an ability ends to clean up everything it contributed in one call. | Source             *(string)* <br> |
| Enable/disable buffs by source | Enables or disables all buffs from a given source without removing them. Disabled buffs stay in the stack but are not counted in stat totals. | Source             *(string)* <br>Active             *(boolean)* <br> |
| Set buff source | Changes the source label on an existing buff without removing or re-adding it. Pass an empty string to clear the source. | Buff ID             *(string)* <br>Source             *(string)* <br> |
| Add threshold rule | Registers a rule that watches a stat and automatically fires an action on a buff when the stat crosses a threshold number. For example: 'when hit_count reaches 5, activate berserk_buff'. | Rule ID             *(string)* <br>Watch stat             *(string)* <br>Threshold             *(number)* <br>Trigger when             *(combo)* <br>Target buff             *(string)* <br>Action             *(combo)* <br> |
| Add threshold rule from JSON | Registers a threshold rule from a JSON string. See the documentation for the threshold rule definition format. | JSON string             *(string)* <br> |
| Re-arm threshold rule | Re-enables a threshold rule that previously fired and was not set to repeat. The rule will fire again on the next qualifying threshold crossing. | Rule ID             *(string)* <br> |
| Clear rule auto-reset | Removes the auto-reset from a threshold rule. After the rule fires, the watched stat will no longer be automatically changed. | Rule ID             *(string)* <br> |
| Clear all threshold rules | Removes all registered threshold rules at once. The buff stack is not affected. |  |
| Decrement stack counter | Decreases a stat's base value by the given amount. Fires 'On stat changed' and evaluates threshold rules. | Stat / Counter             *(string)* <br>Amount             *(number)* <br> |
| Increment stack counter | Increases a stat's base value by the given amount. Use this as a hit counter, combo counter, or charge counter. Fires 'On stat changed' and evaluates any threshold rules watching this stat. | Stat / Counter             *(string)* <br>Amount             *(number)* <br> |
| Remove threshold rule | Removes a threshold rule so it will no longer fire. | Rule ID             *(string)* <br> |
| Reset stack counter | Sets a stat's base value back to 0. Fires 'On stat changed' and evaluates threshold rules. Use this to reset a combo or hit count after the threshold fires. | Stat / Counter             *(string)* <br> |
| Set rule auto-reset value | After the threshold rule fires, automatically resets the watched stat's base value to the given number. Set to 0 for the classic 'every 5 hits' combo reset pattern. | Rule ID             *(string)* <br>Reset value             *(number)* <br> |
| Set rule can repeat | Controls whether a threshold rule re-arms itself after firing. Set to true for repeating patterns like 'every 5 hits'. Set to false for one-time triggers. | Rule ID             *(string)* <br>Can repeat             *(boolean)* <br> |
| Set stack counter value | Sets a stat's base value to an exact number. Fires 'On stat changed' and evaluates threshold rules. | Stat / Counter             *(string)* <br>Value             *(number)* <br> |
| Clear stat base value | Removes the base value for a stat, reverting it to 0. Fires 'On stat changed' if the total changes. | Stat             *(string)* <br> |
| Set stat base value | Sets the starting value of a stat before any buffs are applied. For example, set the base attack to 10 so buffs add on top of that. Fires 'On stat changed' if the total changes. | Stat             *(string)* <br>Value             *(number)* <br> |
| Add tag to buff | Adds a single tag to an existing buff. If the buff already has this tag nothing happens. | Buff ID             *(string)* <br>Tag             *(string)* <br> |
| Remove tag from buff | Removes a single tag from an existing buff's tag list. | Buff ID             *(string)* <br>Tag             *(string)* <br> |
| Replace buff tags | Replaces all tags on a buff at once with the new comma-separated list. Pass an empty string to remove all tags. | Buff ID             *(string)* <br>Tags             *(string)* <br> |
| Advance all timers manually | Manually ticks all active timed buffs forward by the given number of seconds. Only useful when Auto-tick timers is turned off in the behavior properties. | Delta time (secs)             *(number)* <br> |
| Convert buff to permanent | Turns a timed buff into a permanent one, cancelling its countdown. The buff will stay active until removed manually. | Buff ID             *(string)* <br> |
| Convert buff to timed | Turns a permanent buff into a timed one. The countdown starts from zero immediately. | Buff ID             *(string)* <br>Duration (secs)             *(number)* <br> |
| Reset buff timer | Restarts a timed buff's countdown from zero without changing its total duration. | Buff ID             *(string)* <br> |
| Set buff duration | Changes how long a timed buff lasts. Does not reset the time already elapsed — the buff will expire sooner if elapsed is already high. | Buff ID             *(string)* <br>Duration (secs)             *(number)* <br> |
| Set buff elapsed time | Directly sets how much time has passed on a timed buff. If the value is equal to or greater than the duration, the buff expires immediately. | Buff ID             *(string)* <br>Elapsed (secs)             *(number)* <br> |
| Pause/resume buff timer | Pauses or resumes a timed buff's countdown. While paused, the buff stays active and does not count toward expiry. | Buff ID             *(string)* <br>Paused             *(boolean)* <br> |


---
## Conditions
| Condition | Description | Params
| --- | --- | --- |
| On buff activated | Fires when a buff changes from disabled to enabled. Use LastBuffID and LastBuffStat inside this event. |  |
| On buff added | Fires when any buff is added to this object. Use LastBuffID, LastBuffStat, and LastBuffValue expressions inside this event to read details about the buff that was added. |  |
| On buff deactivated | Fires when a buff changes from enabled to disabled. Use LastBuffID and LastBuffStat inside this event. |  |
| On buff expired | Fires when a timed buff's countdown reaches zero, just before it is removed. Use LastBuffID and LastBuffStat inside this event. |  |
| On buff link added | Fires when a new buff link is registered. |  |
| On buff link fired | Fires whenever a buff link automatically executes its action. Use LastFiredLinkID, LastFiredLinkSourceBuff, and LastFiredLinkTargetBuff inside this event. Useful for debugging reactive chains. |  |
| On buff removed | Fires when any buff is removed — whether manually, by tag, by source, from a link, or because it expired. Use LastBuffID and LastBuffStat inside this event. |  |
| On stack cleared | Fires once after all buffs have been removed by the 'Clear all buffs' action. |  |
| On stat changed | Fires whenever the computed total of any stat changes. Use LastChangedStat to see which stat changed and LastChangedStatTotal for its new value. You can add a sub-condition 'LastChangedStat = "attack"' to filter for a specific stat. |  |
| On threshold reached | Fires when a threshold rule executes its action. Use LastRuleID, LastRuleWatchStat, LastRuleThreshold, LastRuleTargetBuff, and LastRuleAction inside this event. Add 'LastRuleID = "my_rule"' as a sub-condition to filter for a specific rule. |  |
| On threshold rule added | Fires when a new threshold rule is registered. |  |
| Buff has tag | True if the specified buff exists and has the given tag. | Buff ID *(string)* <br>Tag *(string)* <br> |
| Buff source matches | True if the specified buff exists and its source label exactly matches the given string. | Buff ID *(string)* <br>Source *(string)* <br> |
| Has active buff on stat | True if at least one enabled buff is currently targeting the given stat. | Stat *(string)* <br> |
| Has active buff with tag | True if at least one enabled buff has the given tag. | Tag *(string)* <br> |
| Has buff | True if a buff with this ID exists, whether it is currently enabled or disabled. | Buff ID *(string)* <br> |
| Has buff link | True if a buff link with this ID currently exists. | Link ID *(string)* <br> |
| Has any buff on stat | True if at least one buff — enabled or disabled — is targeting the given stat. | Stat *(string)* <br> |
| Has buff from source | True if any buff in the stack was created by the given source. | Source *(string)* <br> |
| Has any buff with tag | True if at least one buff in the stack — enabled or disabled — has the given tag. | Tag *(string)* <br> |
| Has threshold rule | True if a threshold rule with this ID currently exists. | Rule ID *(string)* <br> |
| Buff is active | True if the buff exists and is currently enabled. Disabled buffs do not contribute to stat totals. | Buff ID *(string)* <br> |
| Buff is timed | True if the buff is a timed buff with an active countdown. | Buff ID *(string)* <br> |
| Threshold rule is armed | True if the threshold rule exists and will fire on the next qualifying threshold crossing. Rules that have fired and are not set to repeat will return false here. | Rule ID *(string)* <br> |
| Buff timer is paused | True if the buff's countdown is currently paused. | Buff ID *(string)* <br> |
| Stack is above value | True if the stat's computed total is strictly greater than the given value. A handy shortcut for checking counter thresholds in the event sheet. | Stat / Counter *(string)* <br>Value *(number)* <br> |
| Stack is below value | True if the stat's computed total is strictly less than the given value. | Stat / Counter *(string)* <br>Value *(number)* <br> |
| Stat total is in range | True if the computed total of the stat falls within the given range (inclusive on both ends). | Stat *(string)* <br>Min value *(number)* <br>Max value *(number)* <br> |


---
## Expressions
| Expression | Description | Return Type | Params
| --- | --- | --- | --- |
| BuffActiveState | Returns 1 if the buff is active, 0 if disabled, or -1 if it does not exist. | number | Buff ID *(string)* <br> | 
| BuffDuration | Returns the total countdown duration in seconds of a timed buff. Returns 0 for permanent buffs. | number | Buff ID *(string)* <br> | 
| BuffElapsedTime | Returns how many seconds have elapsed since the timed buff was added or last reset. Returns 0 for permanent buffs. | number | Buff ID *(string)* <br> | 
| BuffMode | Returns the stacking mode of a buff: "add", "multiply", or "override". Returns an empty string if the buff does not exist. | string | Buff ID *(string)* <br> | 
| BuffRemainingTime | Returns how many seconds are left before the timed buff expires (duration minus elapsed). Returns 0 for permanent buffs or buffs that do not exist. | number | Buff ID *(string)* <br> | 
| BuffSource | Returns the source label of a buff (who created it). Returns an empty string if the buff has no source or does not exist. | string | Buff ID *(string)* <br> | 
| BuffStat | Returns the stat name that the buff targets. Returns an empty string if the buff does not exist. | string | Buff ID *(string)* <br> | 
| BuffValue | Returns the numeric modifier value of a buff. Returns 0 if the buff does not exist. | number | Buff ID *(string)* <br> | 
| CountActiveBuffs | Returns the number of buffs that are currently enabled (active = true). | number |  | 
| CountActiveBuffsByTag | Returns the number of active buffs that have the given tag. | number | Tag *(string)* <br> | 
| CountActiveBuffsOnStat | Returns the number of active buffs targeting the given stat. | number | Stat *(string)* <br> | 
| CountBuffs | Returns the total number of buffs in the stack, including disabled ones. | number |  | 
| CountBuffsBySource | Returns the number of buffs whose source exactly matches the given string. | number | Source *(string)* <br> | 
| CountBuffsByTag | Returns the number of buffs (active or inactive) that have the given tag. | number | Tag *(string)* <br> | 
| CountBuffsOnStat | Returns the total number of buffs (active or inactive) that target the given stat. | number | Stat *(string)* <br> | 
| GetBuffByIndex | Returns the ID of the buff at the given index (0-based) in the stack. Returns an empty string if the index is out of range. Pair with CountBuffs to loop through all buffs. | string | Index *(number)* <br> | 
| GetBuffBySourceIndex | Returns the buff ID at the given index among buffs matching the given source. Returns an empty string if out of range. Pair with CountBuffsBySource. | string | Source *(string)* <br>Index *(number)* <br> | 
| GetBuffByTagIndex | Returns the ID of the buff at the given index among buffs with the specified tag. Returns an empty string if out of range. Pair with CountBuffsByTag. | string | Tag *(string)* <br>Index *(number)* <br> | 
| GetBuffOnStatByIndex | Returns the ID of the buff at the given index among buffs targeting the given stat. Returns an empty string if out of range. Pair with CountBuffsOnStat. | string | Stat *(string)* <br>Index *(number)* <br> | 
| CountLastBuffTags | Returns the number of tags on the buff from the most recent 'On buff added' event. Pair with GetLastBuffTagByIndex to loop through them. | number |  | 
| GetLastBuffTagByIndex | Returns the tag at the given index from the most recent 'On buff added' event. Pair with CountLastBuffTags. | string | Index *(number)* <br> | 
| LastBuffID | Returns the ID of the buff from the most recent buff event (added, removed, expired, activated, or deactivated). Only valid inside those trigger conditions. | string |  | 
| LastBuffMode | Returns the stacking mode ("add", "multiply", or "override") of the buff from the most recent 'On buff added' event. | string |  | 
| LastBuffSource | Returns the source label of the buff from the most recent 'On buff added', 'On buff removed', or 'On buff expired' event. Returns an empty string if the buff had no source. | string |  | 
| LastBuffStat | Returns the stat name of the buff from the most recent buff event. Only valid inside buff trigger conditions. | string |  | 
| LastBuffValue | Returns the numeric modifier value of the buff from the most recent buff event. Only valid inside buff trigger conditions. | number |  | 
| LastChangedStat | Returns the stat name from the most recent 'On stat changed' event. Use this to identify which stat just changed. | string |  | 
| LastChangedStatTotal | Returns the new computed total of the stat from the most recent 'On stat changed' event. Use this to update a HUD display without polling. | number |  | 
| LastFiredLinkID | Returns the link ID from the most recent 'On buff link fired' event. | string |  | 
| LastFiredLinkSourceBuff | Returns the source buff ID from the most recent 'On buff link fired' event (the buff whose event triggered the link). | string |  | 
| LastFiredLinkTargetBuff | Returns the target buff ID from the most recent 'On buff link fired' event (the buff that received the action). | string |  | 
| LastRuleAction | Returns the action string ("activate", "deactivate", "remove", or "add_from_template") from the most recent 'On threshold reached' event. | string |  | 
| LastRuleID | Returns the rule ID from the most recent 'On threshold reached' event. | string |  | 
| LastRuleTargetBuff | Returns the target buff ID from the most recent 'On threshold reached' event. | string |  | 
| LastRuleThreshold | Returns the threshold value from the most recent 'On threshold reached' event. | number |  | 
| LastRuleWatchStat | Returns the watched stat name from the most recent 'On threshold reached' event. | string |  | 
| CountArmedRules | Returns the number of threshold rules that are currently armed and ready to fire on the next qualifying threshold crossing. | number |  | 
| CountBuffLinks | Returns the total number of registered buff links. | number |  | 
| CountThresholdRules | Returns the total number of registered threshold rules. | number |  | 
| StatAddSum | Returns the raw sum of all active 'Add' mode buff values on the stat, before multipliers or overrides are applied. | number | Stat *(string)* <br> | 
| StatBase | Returns the base value of the named stat before any buffs are applied. Returns 0 if no base has been set. | number | Stat *(string)* <br> | 
| StatMultiplier | Returns the combined multiplier for the stat: 1 + (sum of all active Multiply buff values / 100). Returns 1.0 if no multiply buffs are active (meaning no bonus). | number | Stat *(string)* <br> | 
| StatMultiplierPercent | Returns the combined multiplier for the stat as a percentage bonus. For example, a multiplier of 1.5 returns 50, and 1.0 (no bonus) returns 0. | number | Stat *(string)* <br> | 
| StatTotal | Returns the fully computed total of the named stat: base + add buffs, then multiplied by multiply buffs, then overridden if any override buffs are active. This is the main value to use in your game logic. | number | Stat *(string)* <br> | 
| CountBuffTags | Returns how many tags the given buff has. Returns 0 if the buff does not exist. | number | Buff ID *(string)* <br> | 
| GetBuffTagByIndex | Returns the tag at the given index on the specified buff. Returns an empty string if out of range. Pair with CountBuffTags. | string | Buff ID *(string)* <br>Index *(number)* <br> | 


---
## Changelog

**1.2.0.0**
- **Added:** - Add scripting API and refactor ACEs to use it
- **Added:** - Update Guide/Documentation

**1.1.1.0**
- **Added:** initial release

**0.0.0.0**
- **Added:** Initial release.
