# StatForge - Complete Guide

StatForge is a layered buff and debuff system for Construct 3. Attach it to any object - a player, enemy, item, building, or even an invisible controller - and give that object **named stats** that can be raised, lowered, timed out, or chained together using a stack of independent modifiers called **buffs**. Instead of manually tracking a dozen variables and writing custom math for every modifier interaction, StatForge handles the stacking, the timers, and the cascade of events so your event sheets stay clean and composable.

---

## Table of Contents

1. [Core Concepts](#1-core-concepts)
2. [Project Setup](#2-project-setup)
3. [Plugin Properties](#3-plugin-properties)
4. [Buffs - The Building Block](#4-buffs---the-building-block)
5. [Stat Computation - How Numbers Are Calculated](#5-stat-computation---how-numbers-are-calculated)
6. [Timers - Buffs That Expire](#6-timers---buffs-that-expire)
7. [Tags - Grouping and Filtering Buffs](#7-tags---grouping-and-filtering-buffs)
8. [Sources - Tracking Who Applied a Buff](#8-sources---tracking-who-applied-a-buff)
9. [Activation - Enabling and Disabling Buffs](#9-activation---enabling-and-disabling-buffs)
10. [Buff Links - Automated Reactions](#10-buff-links---automated-reactions)
11. [Stack Counters and Threshold Rules](#11-stack-counters-and-threshold-rules)
12. [Save and Load](#12-save-and-load)
13. [Actions Reference](#13-actions-reference)
14. [Conditions Reference](#14-conditions-reference)
15. [Expressions Reference](#15-expressions-reference)
16. [Triggers Reference](#16-triggers-reference)
17. [Game Use Cases](#17-game-use-cases)
18. [C3 Debugger](#18-c3-debugger)
19. [Scripting (C3 Script / JavaScript)](#19-scripting-c3-script--javascript)
20. [Tips and Common Mistakes](#20-tips-and-common-mistakes)

---

## 1. Core Concepts

### The problem this addon solves

Without StatForge, giving a character modifiable stats requires a separate instance variable for every modifier (base speed, speed bonus from level, speed penalty from mud, speed multiplier from haste potion…), custom math expressions sprinkled across dozens of events, and careful cleanup when modifiers expire or the source is removed. The moment a second character or enemy needs the same system, you duplicate all of it.

StatForge replaces that. Every modifier is a **buff** - a named entry in a stack that says "this stat is affected by this amount, in this way, optionally for this long." The stack is entirely per-object: every instance of an object that has StatForge attached has its own independent buff stack. Reading the computed value is always one expression: `StatForge.StatTotal("speed")`.

### Key design decisions

- **Strings as IDs.** Stats, buffs, sources, and tags are all plain strings. There is no registry to set up; you invent names on the fly. `"speed"`, `"fire_resist"`, `"hp"` are all valid stat names the moment you use them.
- **Buff IDs must be unique per instance.** If you add a buff with an ID that already exists on that instance, the new one silently replaces the old one.
- **Inactive buffs stay in the stack but contribute nothing** to the stat total until re-enabled.
- **Override mode is the highest value wins**, not last-added wins. If two override buffs exist on the same stat, only the bigger value counts.

### Key concepts at a glance

| Term | What it is |
|------|-----------|
| **Stat** | A named number (e.g. `"speed"`, `"damage"`) computed from base + modifiers |
| **Buff** | A single modifier entry: it targets one stat with one value and one mode |
| **Mode** | How a buff combines with others: `add`, `multiply`, or `override` |
| **Tag** | A label on a buff (e.g. `"fire"`, `"equipment"`) used for group operations |
| **Source** | A string on a buff identifying who applied it (e.g. `"potion"`, `"enemy_curse"`) |
| **Threshold Rule** | A watcher that fires an action when a stat crosses a value |

### Scenarios where this addon excels

- **RPG stat systems**-Weapons, armour, skills, consumables, and status effects all modify the same stats from independent sources without conflicting.
- **Timed power-ups**-Speed boosts, shields, damage multipliers, and invincibility frames all expire on their own timers without any timer variable management.
- **Enemy AI difficulty scaling**-Apply buffs from a "difficulty" source to all enemies at once and remove them all with one `Remove buffs by source` call.
- **Equipment loadouts**-Each item adds buffs tagged `"equipment"`. Unequipping removes all buffs from that item's ID without touching anything else.
- **Combo and stack systems**-Use a stat as a stack counter, increment it on every hit, and fire threshold rules at 5, 10, 25 stacks to trigger escalating effects.
- **State-machines for status effects**-Poison, freeze, burn, and stun are each a buff. Buff Links react when one expires and automatically remove or activate another.
- **Procedural modifiers**-Load buff stacks from JSON at runtime (dungeon generation, save files, network sync) using `Add buff from JSON`.
- **Non-obvious uses**-Cooldown tracking, dialogue flag stacks, physics modifier layers, in-game economy price modifiers, narrative state machines.

---

## 2. Project Setup

### Step 1 - Add the behavior

In the Construct 3 editor, select the object you want to track stats on (typically your Player, Enemy, or a dedicated invisible Controller object). In the **Behaviors** panel, click **Add behavior** and choose **StatForge**.

You can add StatForge to as many different object types as you like. Each instance of each object has its own completely independent buff stack.

### Step 2 - Configure the properties

Click the object, select the StatForge behavior in the Properties panel. The properties you care about most for a first project:

- Set **Auto-tick timers** to `Yes` (the default)-this means temporary buffs count down automatically every frame.
- Leave **Overflow mode** as `Clamp` and **Min Value** / **Max Value** at their defaults for now. You can tighten the range later once you know what values your stats will reach.

### Step 3 - Add your first buff

Open your event sheet. Create a startup event:

```
Event: System → On start of layout
  Action: Player.StatForge → Add buff
    Buff ID: "base_speed"
    Stat:    "speed"
    Value:   100
    Tags:    "base"
```

### Step 4 - Read the stat total

In any expression field (e.g. a Text object's text):

```
Player.StatForge.StatTotal("speed")
```

That's it-you now have a working stat system. From here, every buff you add to `"speed"` will be reflected the next time you read `StatTotal("speed")`.

### Step 5 - Display a live readout (optional)

```
Event: System → Every tick
  Action: Text → Set text
    Text: "Speed: " & Player.StatForge.StatTotal("speed")
```

---

## 3. Plugin Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Initial Buffs (JSON)** | Long text | *(empty)* | A JSON array of buff objects to pre-load the moment the object is created. Useful for default stats. See [Buff JSON format](#buff-json-format). |
| **Auto-tick timers** | Checkbox | `Yes` | When enabled, temporary buff timers count down every frame using the game's delta time. Disable to advance timers manually with the `Advance all timers` action. |
| **Overflow mode** | Dropdown | `Clamp` | What happens when a computed stat total falls outside the Min/Max range. `Clamp` = stop at the boundary. `Wrap` = loop around. `None` = no limit applied. |
| **Min Value** | Number | `-99999` | The minimum allowed stat total when Overflow mode is `Clamp` or `Wrap`. |
| **Max Value** | Number | `99999` | The maximum allowed stat total when Overflow mode is `Clamp` or `Wrap`. |
| **Debug Mode** | Checkbox | `No` | Logs warnings to the browser console for JSON parse errors and other non-fatal issues. Turn on while developing. |

### Buff JSON format

The **Initial Buffs** property (and the `Add buff from JSON` action) accepts a JSON array. Each object in the array can have these fields:

```json
[
  {
    "id":        "base_hp",
    "stat":      "hp",
    "value":     200,
    "mode":      "add",
    "tags":      "base,permanent",
    "source":    "character_sheet",
    "active":    true,
    "temporary": false,
    "duration":  0
  }
]
```

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| `id` | Yes |-| Unique ID for this buff on this instance |
| `stat` | Yes |-| Which stat this buff modifies |
| `value` | No | `0` | The numeric modifier |
| `mode` | No | `"add"` | `"add"`, `"multiply"`, or `"override"` |
| `tags` | No | `""` | Comma-separated tag string |
| `source` | No | `""` | Source label |
| `active` | No | `true` | Whether the buff starts enabled |
| `temporary` | No | `false` | `true` to enable the countdown timer |
| `duration` | No | `0` | Seconds before expiry (only used if `temporary: true`) |

---

## 4. Buffs - The Building Block

A **buff** is a single modifier attached to one stat on one object instance. Every buff has:

- An **ID**-a string you choose, unique per instance. Think of it as the buff's name tag: `"fire_sword_dmg"`, `"slow_effect_1"`, `"level5_bonus"`.
- A **stat**-which stat it modifies: `"damage"`, `"speed"`, `"defense"`.
- A **value**-the number the buff contributes: `50`, `-20`, `1.5`.
- A **mode**-how the value combines with other buffs (see Section 5).
- Optional: **tags**, **source**, **active** state, **timer** settings.

### The simplest buff

```
Event: On start of layout
  Action: Player.StatForge → Add buff
    Buff ID: "sword_bonus"
    Stat:    "attack"
    Value:   15
    Tags:    ""
```

Now `StatForge.StatTotal("attack")` returns `15` (assuming no base value and no other buffs).

### Adding a base value

Buffs add on top of the stat's **base value**, which starts at zero. Set it explicitly:

```
Event: On start of layout
  Action: Player.StatForge → Set stat base value
    Stat:  "attack"
    Value: 50
  Action: Player.StatForge → Add buff
    Buff ID: "sword_bonus"
    Stat:    "attack"
    Value:   15
    Tags:    ""
// StatTotal("attack") is now 65
```

### Replacing a buff

Adding a buff with an ID that already exists replaces it:

```
Action: Player.StatForge → Add buff
  Buff ID: "sword_bonus"   // same ID as before
  Stat:    "attack"
  Value:   30              // now the sword is stronger
```

Use this intentionally to handle upgrades, where the buff ID represents the slot (e.g. `"main_hand"`) and the value changes when the weapon changes.

### Removing a buff

```
Action: Player.StatForge → Remove buff
  Buff ID: "sword_bonus"
```

The stat total recalculates automatically.

---

## 5. Stat Computation - How Numbers Are Calculated

When you call `StatTotal("stat")` the result is computed in three ordered phases:

**Phase 1 - Base + Additive:**
All active `add` mode buffs are summed together and added to the base value.

```
phase1 = base + sum(all active "add" buff values)
```

**Phase 2 - Multiplicative:**
All active `multiply` mode buffs are treated as percentage bonuses. A multiply value of `25` means "+25%". They stack **additively** - two `multiply 25` buffs give +50%, not +56.25%.

```
phase2 = phase1 × (1 + sum(all active "multiply" buff values) / 100)
```

**Phase 3 - Override:**
If any active `override` mode buffs exist, the phase 2 result is thrown away and replaced with the **highest** override value.

```
final = (any override buffs exist) ? max(override values) : phase2
```

Finally, the **Overflow mode** (clamp/wrap/none) is applied to the final value.

### Example

Player has a base speed of 100. They pick up Boots of Haste (+20 add), enter a swamp (-10 add), and drink a Speed Potion (+50% multiply):

```
phase1 = 100 + 20 + (-10) = 110
phase2 = 110 × (1 + 50/100) = 110 × 1.5 = 165
final  = 165  (no override buffs)
```

### Example with override

Now a "frozen" effect with override value 0 is applied:

```
phase1 = 110
phase2 = 165
final  = max(0) = 0   ← frozen overrides everything
```

Remove the frozen buff and the speed returns to 165 automatically.

### Reading the individual components

| Expression | Returns |
|-----------|---------|
| `StatBase("speed")` | The base value set by `Set stat base value` |
| `StatAddSum("speed")` | Sum of all active `add` buffs only |
| `StatMultiplier("speed")` | The multiplier factor, e.g. `1.5` for +50% |
| `StatMultiplierPercent("speed")` | The multiplier bonus as a percentage, e.g. `50` for +50% |
| `StatTotal("speed")` | The full final result |

---

## 6. Timers - Buffs That Expire

A **temporary buff** counts down and removes itself automatically when its duration runs out.

### Adding a timed buff

```
Event: Player touches power-up
  Action: Player.StatForge → Add timed buff
    Buff ID:  "speed_potion"
    Stat:     "speed"
    Value:    50
    Duration: 10        // seconds
    Tags:     "potion"
```

After 10 seconds, the buff fires `On buff expired`, then `On buff removed`, and the stat total updates.

### Reacting when a timed buff expires

```
Event: Player.StatForge → On buff expired
  Condition: Player.StatForge.LastBuffID = "speed_potion"
  Action: Text → Set text "Potion wore off!"
```

### Showing a countdown in your UI

```
Event: System → Every tick
  Action: BuffTimerText → Set text
    Text: "Potion: " & floor(Player.StatForge.BuffRemainingTime("speed_potion")) & "s"
```

### Pausing a timer

```
// Pause when game is paused
Event: System → On pause
  Action: Player.StatForge → Pause/resume buff timer
    Buff ID: "speed_potion"
    Paused:  true

// Resume when game resumes
Event: System → On resume
  Action: Player.StatForge → Pause/resume buff timer
    Buff ID: "speed_potion"
    Paused:  false
```

### Refreshing a buff's duration

To restart the countdown of a buff that's already running:

```
Action: Player.StatForge → Reset buff timer
  Buff ID: "speed_potion"
// Elapsed is set back to 0; the buff runs for its full duration again
```

### Manual timers (Auto-tick disabled)

If you set **Auto-tick timers** to `No`, timers do nothing on their own. You advance them yourself:

```
Event: System → Every 0.5 seconds
  Action: Player.StatForge → Advance all timers by 0.5 seconds
```

This is useful for turn-based games where "time" advances by player actions, not real time.

---

## 7. Tags - Grouping and Filtering Buffs

A **tag** is a plain-text label you attach to a buff. A single buff can have multiple tags (comma-separated). Tags let you operate on groups of buffs without knowing each buff's exact ID.

### Adding a buff with tags

```
Action: Player.StatForge → Add buff
  Buff ID: "ice_sword_bonus"
  Stat:    "attack"
  Value:   20
  Tags:    "equipment,ice,weapon"
```

### Removing all buffs with a tag

```
// Player unequips all equipment
Action: Player.StatForge → Remove all buffs with tag
  Tag: "equipment"
```

### Checking if a buff currently has a tag

```
Condition: Player.StatForge → Buff has tag
  Buff ID: "ice_sword_bonus"
  Tag:     "ice"
// Returns true
```

### Counting buffs by tag

```
Expression: Player.StatForge.CountBuffsByTag("poison")
// How many poison stacks does the player have?
```

### Iterating over tagged buffs

Use `CountBuffsByTag` and `GetBuffByTagIndex` together to loop through buffs:

```
Event: System → For "i" from 0 to Player.StatForge.CountBuffsByTag("debuff") - 1
  // Get the buff ID at this position
  Local variable: buffId = Player.StatForge.GetBuffByTagIndex("debuff", loopindex)
  Action: Log → Print buffId
```

### Dynamic tag editing

You can add or remove individual tags from a buff at runtime:

```
// Mark a buff as "enhanced" mid-game
Action: Player.StatForge → Add tag to buff
  Buff ID: "base_attack"
  Tag:     "enhanced"

// Later, remove just that tag
Action: Player.StatForge → Remove tag from buff
  Buff ID: "base_attack"
  Tag:     "enhanced"
```

---

## 8. Sources - Tracking Who Applied a Buff

A **source** is a single string label on a buff that identifies where it came from. Unlike tags (which can be many), each buff has exactly one source. Sources make it easy to remove all effects from a specific origin without knowing the individual buff IDs.

### Adding a buff with a source

```
Action: Enemy.StatForge → Add timed buff with source
  Buff ID:  "frost_slow"
  Stat:     "speed"
  Value:    -30
  Duration: 5
  Tags:     "debuff"
  Source:   "ice_mage"
```

### Removing all buffs from a source

When the ice mage dies or the effect is cleansed:

```
Action: Player.StatForge → Remove all buffs from source
  Source: "ice_mage"
```

This removes every buff whose source is `"ice_mage"`, no matter how many there are or what their IDs are.

### Checking if a source is present

```
Condition: Player.StatForge → Has buff from source
  Source: "curse_of_weakness"
// Is the player currently cursed?
```

### Enabling/disabling all buffs from a source

```
// Freeze all "equipment" buffs (e.g. while in a cutscene)
Action: Player.StatForge → Enable/disable buffs by source
  Source: "main_weapon"
  Active: false

// Restore them
Action: Player.StatForge → Enable/disable buffs by source
  Source: "main_weapon"
  Active: true
```

---

## 9. Activation - Enabling and Disabling Buffs

A buff can be **active** (contributes to the stat total) or **inactive** (sits in the stack but contributes nothing). Inactive buffs are not removed - they remain and can be re-enabled at any time.

This is useful for conditional modifiers: a "Rage Mode" buff that only contributes to attack when the player is below 25% HP, equipment bonuses that are "equipped but not usable" in no-weapon zones, etc.

### Disabling and re-enabling a single buff

```
// Player enters a magic-nullifying zone
Action: Player.StatForge → Enable or disable buff
  Buff ID: "magic_staff_bonus"
  Active:  false

// Player exits the zone
Action: Player.StatForge → Enable or disable buff
  Buff ID: "magic_staff_bonus"
  Active:  true
```

### Toggling a buff

```
Action: Player.StatForge → Toggle buff on/off
  Buff ID: "stealth_speed_penalty"
```

### Disabling all buffs with a tag

```
// Disable all environmental buffs when entering a boss room
Action: Player.StatForge → Enable/disable buffs by tag
  Tag:    "environmental"
  Active: false
```

### Reacting to enable/disable events

```
Event: Player.StatForge → On buff activated
  Condition: Player.StatForge.LastBuffID = "rage_mode"
  Action: Player → Play animation "Rage"

Event: Player.StatForge → On buff deactivated
  Condition: Player.StatForge.LastBuffID = "rage_mode"
  Action: Player → Play animation "Normal"
```

---

## 10. Buff Links - Automated Reactions

A **buff link** connects two buffs so that when something happens to the source buff ("it was removed", "it expired", "it was activated"), an automatic action is performed on the target buff ("remove it", "activate it", "toggle it").

Buff links let you build dependency chains without writing explicit events: if the `"poison"` buff expires, automatically remove the `"poison_DoT_visual"` buff; if the `"shield"` buff is deactivated, also deactivate the `"shield_glow"` buff.

### Adding a buff link

```
Action: Player.StatForge → Add buff link
  Link ID:      "poison_cleanup"
  Source buff:  "poison"
  On event:     "expired"       // "removed", "expired", "activated", "deactivated"
  Target buff:  "poison_glow"
  Action:       "remove"        // "remove", "activate", "deactivate", "toggle_active"
```

Now whenever `"poison"` expires, `"poison_glow"` is automatically removed.

### Link events

| Event string | When it fires |
|--------------|--------------|
| `"removed"` | The buff was removed for any reason (manual remove OR expiry) |
| `"expired"` | The buff's timer ran out |
| `"activated"` | The buff was enabled (`active` went from false to true) |
| `"deactivated"` | The buff was disabled (`active` went from true to false) |

### Link actions

| Action string | What happens to the target buff |
|---------------|-------------------------------|
| `"remove"` | The target buff is deleted from the stack |
| `"activate"` | The target buff is enabled |
| `"deactivate"` | The target buff is disabled |
| `"toggle_active"` | The target buff's active state is flipped |

### Reacting when a link fires

```
Event: Player.StatForge → On buff link fired
  Condition: Player.StatForge.LastFiredLinkID = "poison_cleanup"
  Action: SFX → Play "whoosh"
```

### Adding a link from JSON (for data-driven setups)

```
Action: Player.StatForge → Add buff link from JSON
  JSON: "{\"linkId\":\"chain1\",\"sourceBuffId\":\"stun\",\"onEvent\":\"removed\",\"targetBuffId\":\"stun_vfx\",\"action\":\"remove\"}"
```

### Removing a link

When you no longer want the link to fire:

```
Action: Player.StatForge → Remove buff link
  Link ID: "poison_cleanup"
```

---

## 11. Stack Counters and Threshold Rules

StatForge has no separate "stack counter" type. Instead, you use a **stat** as a numeric counter and the `Increment stack counter` / `Decrement stack counter` actions to change it. The stat's **base value** holds the count. Buff stacking still applies on top, but for a pure counter you typically leave the buff stack for that stat empty and just manipulate the base value.

A **threshold rule** watches a stat's total and fires automatically when it crosses a target value. This is the bridge between "the counter changed" and "something should happen at 10".

### Setting up a hit-combo counter

```
// Setup (once at layout start)
Action: Player.StatForge → Set stat base value
  Stat:  "combo"
  Value: 0

// Each time the player lands a hit
Event: On player attack hits enemy
  Action: Player.StatForge → Increment stack counter
    Stat:   "combo"
    Amount: 1

// Reset if the player gets hit
Event: On player takes damage
  Action: Player.StatForge → Reset stack counter
    Stat: "combo"
```

### Adding threshold rules

```
// At layout start
Action: Player.StatForge → Add threshold rule
  Rule ID:     "combo_5"
  Watch stat:  "combo"
  Direction:   "reach"        // fires when value REACHES threshold from below
  Threshold:   5
  Target buff: ""
  Action:      ""
  // The rule fires OnThresholdReached; we handle the effect ourselves

Action: Player.StatForge → Add threshold rule
  Rule ID:     "combo_10"
  Watch stat:  "combo"
  Direction:   "reach"
  Threshold:   10
  Target buff: ""
  Action:      ""
```

### Reacting to threshold events

```
Event: Player.StatForge → On threshold reached
  Condition: Player.StatForge.LastRuleID = "combo_5"
  Action: Player → Unlock "combo_attack_5"

Event: Player.StatForge → On threshold reached
  Condition: Player.StatForge.LastRuleID = "combo_10"
  Action: Player → Unlock "ultra_attack"
```

### Threshold direction

| Direction | When it fires |
|-----------|--------------|
| `"reach"` | Fires when the stat crosses **up through** the threshold (was below, now at or above) |
| `"drop_below"` | Fires when the stat crosses **down through** the threshold (was at or above, now below) |

### Auto-reset after threshold fires

To automatically reset a counter to 0 after the rule fires (so it can trigger again):

```
Action: Player.StatForge → Set rule auto-reset value
  Rule ID:     "combo_5"
  Reset value: 0
```

Now every time combo reaches 5, the rule fires `OnThresholdReached` and the combo base is set back to 0.

### Repeating rules

By default, a rule that fires disarms itself (fires once only). To make it fire every time the condition is met:

```
Action: Player.StatForge → Set rule can repeat
  Rule ID:    "combo_5"
  Can repeat: true
```

### Manually re-arming a rule

If a non-repeating rule has fired and you want to arm it again:

```
Action: Player.StatForge → Re-arm threshold rule
  Rule ID: "combo_5"
```

---

## 12. Save and Load

StatForge integrates with Construct 3's built-in save/load system. When you save the game with `System → Save state`, all buff stacks, base values, links, and threshold rules are saved automatically. When you load, they are restored-no extra actions needed.

Timers (elapsed time) are also saved, so a 10-second buff with 4 seconds remaining will have 4 seconds remaining after loading.

**Important:** `On buff added`, `On stat changed`, and other triggers do **not** fire during load. If your stat totals drive something visual (e.g. a progress bar), update it once after loading:

```
Event: System → On state loaded
  Action: StatBar → Set width  StatForge.StatTotal("hp") * 2
```

---

## 13. Actions Reference

### Actions Reference - Buff Management

| Action | Description |
|--------|-------------|
| **Add buff** | Adds a basic `add`-mode buff to a stat with optional tags. The quickest way to add a bonus. |
| **Add buff with stacking mode** | Like Add buff but lets you choose `add`, `multiply`, or `override` mode. |
| **Add buff (full options)** | Full control: mode, tags, and source all in one action. |
| **Add timed buff** | Adds an `add`-mode buff that automatically expires after a set number of seconds. |
| **Add timed buff (full options)** | Full-control timed buff: mode, tags, source, and duration in one action. |
| **Add buff from JSON** | Adds a single buff defined as a JSON object string. |
| **Load buff stack from JSON** | Parses a JSON array string and adds every buff in it at once. Use in `On start of layout` to pre-load a character's starting stats. |
| **Add debuff** | Adds a permanent `add`-mode debuff. Automatically includes the `"debuff"` tag so cleanse effects work without extra setup. |
| **Add debuff with stacking mode** | Permanent debuff with your choice of `add`, `multiply`, or `override` mode. |
| **Add debuff (full options)** | Permanent debuff with full control: mode, extra tags, and source. |
| **Add timed debuff** | Debuff that expires automatically. Automatically includes the `"debuff"` tag. |
| **Add timed debuff (full options)** | Full-control timed debuff: mode, duration, extra tags, and source. |
| **Remove buff** | Removes one buff by its exact ID. |
| **Remove all buffs with tag** | Removes every buff that has a specific tag. |
| **Remove buffs by multiple tags** | Removes buffs that match all specified tags (AND logic) or any tag (OR logic). |
| **Remove all buffs on stat** | Removes every buff targeting a given stat name. |
| **Clear all buffs** | Removes every buff from the stack and fires `On stack cleared`. |

### Source Tracking
| **Add buff with source** | Same as Add buff but with an explicit source label. |
| **Add timed buff with source** | Timed buff with explicit source. |
| **Set buff source** | Changes the source label of a buff that's already in the stack. |
| **Remove all buffs from source** | Removes every buff whose source matches-useful for "remove all enemy debuffs". |
| **Enable/disable buffs by source** | Activates or deactivates all buffs from a given source without removing them. |

### Tag Control

| Action | Description |
|--------|-------------|
| **Add tag to buff** | Adds a single tag to a buff that already exists. |
| **Remove tag from buff** | Removes one tag from an existing buff, leaving other tags intact. |
| **Replace buff tags** | Replaces the entire tag list on a buff with a new comma-separated string. |

### Activation

| Action | Description |
|--------|-------------|
| **Enable or disable buff** | Sets one buff to active (`true`) or inactive (`false`). |
| **Enable/disable buffs by tag** | Enables or disables every buff that has a given tag. |
| **Enable/disable buffs by multiple tags** | Enables or disables buffs that match multiple tags. |
| **Toggle buff on/off** | Flips the active state of one buff (on→off or off→on). |

### Timers

| Action | Description |
|--------|-------------|
| **Set buff duration** | Changes the total countdown time of a temporary buff. |
| **Set buff elapsed time** | Jumps the elapsed counter forward or backward. |
| **Reset buff timer** | Sets elapsed back to 0, restarting the countdown. |
| **Pause/resume buff timer** | Freezes or unfreezes the countdown for one buff. |
| **Advance all timers manually** | Adds a set number of seconds to every running timer. Use with Auto-tick disabled. |
| **Convert buff to timed** | Turns a permanent buff into a temporary one with a duration. |
| **Convert buff to permanent** | Turns a temporary buff into a permanent one (removes the timer). |

### Stat Base

| Action | Description |
|--------|-------------|
| **Set stat base value** | Sets the starting value of a stat before any buffs apply. |
| **Clear stat base value** | Resets the stat base back to 0. |

### Buff Links

| Action | Description |
|--------|-------------|
| **Add buff link** | Creates a link: when source buff does X, do Y to target buff. |
| **Add buff link from JSON** | Adds a link from a JSON object string. |
| **Remove buff link** | Deletes a link by its ID. |
| **Remove all links for a buff** | Removes every link where the given buff is the source or target. |
| **Clear all buff links** | Removes every link on this instance. |

### Stack Thresholds

| Action | Description |
|--------|-------------|
| **Increment stack counter** | Adds an amount to a stat's base value (shorthand for stack counters). |
| **Decrement stack counter** | Subtracts an amount from a stat's base value. |
| **Reset stack counter** | Sets a stat's base value to zero. |
| **Set stack counter value** | Sets a stat's base value to an exact number. |
| **Add threshold rule** | Adds a watcher that fires when a stat crosses a value. |
| **Add threshold rule from JSON** | Adds a threshold rule from a JSON object string. |
| **Set rule auto-reset value** | After the rule fires, automatically reset the watched stat to this value. |
| **Clear rule auto-reset** | Removes the auto-reset from a rule. |
| **Set rule can repeat** | Controls whether the rule fires once or re-arms after every trigger. |
| **Re-arm threshold rule** | Manually re-enables a rule that has already fired. |
| **Remove threshold rule** | Deletes one threshold rule. |
| **Clear all threshold rules** | Removes every threshold rule on this instance. |

---

## 14. Conditions Reference

| Condition | Description |
|-----------|-------------|
| **Has buff** | True if a buff with that ID exists (active or inactive). |
| **Buff is active** | True if the buff exists AND is currently enabled. |
| **Buff is timed** | True if the buff has a countdown timer (temporary=true). |
| **Buff timer is paused** | True if the buff's timer is currently paused. |
| **Has any buff on stat** | True if any buff (active or inactive) targets the given stat. |
| **Has active buff on stat** | True if at least one active buff targets the given stat. |
| **Has any buff with tag** | True if any buff (active or inactive) has the given tag. |
| **Has active buff with tag** | True if at least one active buff has the given tag. |
| **Buff has tag** | True if a specific named buff has a specific tag. |
| **Has buff from source** | True if any buff has the given source label. |
| **Buff source matches** | True if a specific buff's source is exactly the given string. |
| **Has buff link** | True if a link with the given ID exists. |
| **Has threshold rule** | True if a rule with the given ID exists. |
| **Threshold rule is armed** | True if the rule exists and is currently armed (will fire on next crossing). |
| **Stat total is in range** | True if the stat's computed total falls between two values (inclusive). |
| **Stack is above value** | True if the stat total is greater than the given value. |
| **Stack is below value** | True if the stat total is less than the given value. |

---

## 15. Expressions Reference

### Stat Values

| Expression | Returns | Description |
|-----------|---------|-------------|
| `StatTotal(stat)` | number | The fully computed stat total (base + add → multiply → override → overflow). |
| `StatBase(stat)` | number | The raw base value before any buffs. |
| `StatAddSum(stat)` | number | Sum of all active `add`-mode buff values only. |
| `StatMultiplier(stat)` | number | The combined multiplier factor (e.g. `1.5` for +50%). |
| `StatMultiplierPercent(stat)` | number | The multiplier bonus as a percentage (e.g. `50` for +50%). `1.5` multiplier → `50`. Returns `0` when no multiply buffs are active. |

### Buff Info

| Expression | Returns | Description |
|-----------|---------|-------------|
| `BuffValue(id)` | number | The numeric modifier value of the buff. |
| `BuffStat(id)` | string | Which stat the buff targets. |
| `BuffMode(id)` | string | The stacking mode: `"add"`, `"multiply"`, or `"override"`. |
| `BuffSource(id)` | string | The source label of the buff. |
| `BuffRemainingTime(id)` | number | Seconds remaining before a timed buff expires. |
| `BuffElapsedTime(id)` | number | Seconds elapsed since the buff was added or last reset. |
| `BuffDuration(id)` | number | Total countdown duration in seconds (0 for permanent buffs). |
| `BuffActiveState(id)` | number | `1` = active, `0` = inactive, `-1` = buff doesn't exist. |

### Buff Lists

| Expression | Returns | Description |
|-----------|---------|-------------|
| `CountBuffs()` | number | Total number of buffs (active + inactive). |
| `GetBuffByIndex(i)` | string | Buff ID at position `i` in the full stack (0-based). |
| `CountActiveBuffs()` | number | Number of currently active buffs. |
| `CountBuffsOnStat(stat)` | number | Total buffs targeting a given stat. |
| `GetBuffOnStatByIndex(stat, i)` | string | Buff ID at position `i` among buffs for that stat. |
| `CountActiveBuffsOnStat(stat)` | number | Active buffs targeting a given stat. |
| `CountBuffsByTag(tag)` | number | Buffs (active + inactive) with the given tag. |
| `GetBuffByTagIndex(tag, i)` | string | Buff ID at position `i` among buffs with that tag. |
| `CountActiveBuffsByTag(tag)` | number | Active buffs with the given tag. |
| `CountBuffsBySource(source)` | number | Buffs with the given source label. |
| `GetBuffBySourceIndex(source, i)` | string | Buff ID at position `i` among buffs from that source. |

### Tag Lists

| Expression | Returns | Description |
|-----------|---------|-------------|
| `CountBuffTags(id)` | number | Number of tags on the given buff. |
| `GetBuffTagByIndex(id, i)` | string | The tag at position `i` on the given buff (0-based). |

### Links and Rules

| Expression | Returns | Description |
|-----------|---------|-------------|
| `CountBuffLinks()` | number | Total registered buff links. |
| `CountThresholdRules()` | number | Total registered threshold rules. |
| `CountArmedRules()` | number | Rules that are currently armed and will fire on the next crossing. |

### Event Context-read these inside Trigger event handlers

| Expression | Returns | Description |
|-----------|---------|-------------|
| `LastBuffID()` | string | ID of the buff that triggered the most recent buff event. |
| `LastBuffStat()` | string | Stat of the buff from the most recent event. |
| `LastBuffValue()` | number | Value of the buff from the most recent event. |
| `LastBuffMode()` | string | Mode of the buff from the most recent event. |
| `LastBuffSource()` | string | Source of the buff from the most recent event. |
| `CountLastBuffTags()` | number | Number of tags on the buff from the most recent event. |
| `GetLastBuffTagByIndex(i)` | string | Tag at position `i` from the most recent buff event. |
| `LastChangedStat()` | string | Stat name from the most recent `On stat changed` event. |
| `LastChangedStatTotal()` | number | New computed total from the most recent `On stat changed` event. |
| `LastFiredLinkID()` | string | Link ID from the most recent `On buff link fired` event. |
| `LastFiredLinkSourceBuff()` | string | Source buff ID from the most recent link fire. |
| `LastFiredLinkTargetBuff()` | string | Target buff ID from the most recent link fire. |
| `LastRuleID()` | string | Rule ID from the most recent `On threshold reached` event. |
| `LastRuleWatchStat()` | string | Watched stat from the most recent threshold event. |
| `LastRuleThreshold()` | number | Threshold value from the most recent threshold event. |
| `LastRuleTargetBuff()` | string | Target buff ID from the most recent threshold event. |
| `LastRuleAction()` | string | Action string from the most recent threshold event. |

---

## 16. Triggers Reference

| Trigger | Description |
|---------|-------------|
| **On buff added** | Fires each time any buff is added to the stack. |
| **On buff removed** | Fires each time any buff is removed (manually or on expiry). |
| **On buff expired** | Fires specifically when a timed buff's countdown hits zero (fires before `On buff removed`). |
| **On buff activated** | Fires when a buff's `active` state changes from false to true. |
| **On buff deactivated** | Fires when a buff's `active` state changes from true to false. |
| **On stat changed** | Fires whenever the computed total of any stat changes. |
| **On stack cleared** | Fires after `Clear all buffs` finishes removing every buff. |
| **On buff link added** | Fires when a new buff link is registered. |
| **On buff link fired** | Fires when a buff link executes its action. |
| **On threshold reached** | Fires when a threshold rule triggers. |
| **On threshold rule added** | Fires when a new threshold rule is registered. |

---

## 17. Game Use Cases

Each use case below is a standalone example. They range from the simplest setup to advanced patterns. Copy the event pseudocode directly into your event sheet.

---

### Use Case 1-Basic player stat setup

**Scenario:** Give a player character a base speed of 150 and attack of 50 before any items are collected.

```
Event: System → On start of layout
  Action: Player.StatForge → Set stat base value "speed" to 150
  Action: Player.StatForge → Set stat base value "attack" to 50
  Action: Player.StatForge → Set stat base value "defense" to 20
  Action: Player.StatForge → Set stat base value "hp" to 200

// Read them anywhere
Event: System → Every tick
  Action: UI_Speed → Set text  "SPD:" & Player.StatForge.StatTotal("speed")
  Action: UI_Attack → Set text "ATK:" & Player.StatForge.StatTotal("attack")
```

---

### Use Case 2-Equipping and unequipping a weapon

**Scenario:** An RPG where weapons add attack and the ID is the equipment slot so equipping a new weapon replaces the old one.

```
// Equip: add buff with the slot ID "main_hand"-replaces any previous buff with the same ID
Event: Player picks up Iron Sword
  Action: Player.StatForge → Add buff
    Buff ID: "main_hand"
    Stat:    "attack"
    Value:   30
    Tags:    "equipment,weapon"

// Different weapon-same slot ID, new value replaces the old one
Event: Player picks up Steel Sword
  Action: Player.StatForge → Add buff
    Buff ID: "main_hand"
    Stat:    "attack"
    Value:   55
    Tags:    "equipment,weapon"

// Unequip: remove the buff by slot ID
Event: Player drops weapon
  Action: Player.StatForge → Remove buff "main_hand"
```

---

### Use Case 3-A potion with a timed speed boost

**Scenario:** A speed potion gives +40% speed for 8 seconds. Drinking a second potion refreshes the timer.

```
Event: Player sprite → On collision with SpeedPotion
  Action: SpeedPotion → Destroy
  Action: Player.StatForge → Add timed buff
    Buff ID:  "speed_potion"
    Stat:     "speed"
    Value:    40           // mode defaults to "add"-treat as flat bonus OR use mode "multiply"
    Duration: 8
    Tags:     "potion,speed_buff"
  // If the buff already exists (player drank another potion),
  // the ID collision replaces and resets it-timer refreshed automatically

// Show the countdown UI
Event: StatForge → Has buff "speed_potion"
  Action: PotionTimer → Set text  floor(Player.StatForge.BuffRemainingTime("speed_potion")) & "s"

Event: Player.StatForge → On buff expired
  Condition: Player.StatForge.LastBuffID = "speed_potion"
  Action: PotionTimer → Set text ""
  Action: SFX → Play "potion_end"
```

---

### Use Case 4 - Equipment set with multiple pieces

**Scenario:** An armour set with helm, chest, and boots. Each piece has its own buff. If all three are equipped, an "armour set bonus" buff is added.

```
// Equip a piece
Event: Player equips Helm of Fire
  Action: Player.StatForge → Add buff
    Buff ID: "helm_of_fire"
    Stat:    "defense"
    Value:   15
    Tags:    "equipment,fire_set"

  // Check for set completion after every equip
  Condition: Player.StatForge.CountBuffsByTag("fire_set") >= 3
    Action: Player.StatForge → Add buff
      Buff ID: "fire_set_bonus"
      Stat:    "fire_resist"
      Value:   50
      Tags:    "set_bonus"

// Unequip a piece
Event: Player unequips Helm of Fire
  Action: Player.StatForge → Remove buff "helm_of_fire"

  // Remove set bonus if incomplete
  Condition: Player.StatForge.CountBuffsByTag("fire_set") < 3
    Action: Player.StatForge → Remove buff "fire_set_bonus"
```

---

### Use Case 5 - Stacking poison DoT

**Scenario:** Touching an enemy poison cloud stacks a DoT effect. Each stack is a separate timed buff that deals 5 damage per second for 4 seconds. Maximum of 5 stacks.

```
// Local variable to track stack count
Event: Player touches PoisonCloud
  // Only add if below max stacks
  Condition: Player.StatForge.CountBuffsByTag("poison") < 5
    // Each stack gets a unique ID using newuid
    Action: Player.StatForge → Add timed buff
      Buff ID:  "poison_" & newuid
      Stat:     "poison_dps"    // we'll read this for damage
      Value:    5
      Duration: 4
      Tags:     "poison,debuff"

// Take damage every second per active stack
Event: System → Every 1 second
  Condition: Player.StatForge.StatTotal("poison_dps") > 0
    Action: Player → Subtract StatForge.StatTotal("poison_dps") from HP
    Action: SFX → Play "poison_tick"

// Visual: show stack count
Event: System → Every tick
  Action: PoisonUI → Set visible  Player.StatForge.CountActiveBuffsByTag("poison") > 0
  Action: PoisonStackCount → Set text  Player.StatForge.CountActiveBuffsByTag("poison")
```

---

### Use Case 6 - Freeze that nullifies speed and breaks on fire

**Scenario:** A "frozen" status overrides speed to 0 using override mode. If a "fire" buff is also applied, use a Buff Link to remove the ice buff immediately.

```
// Apply freeze
Action: Player.StatForge → Add buff
  Buff ID: "frozen"
  Stat:    "speed"
  Value:   0
  Mode:    "override"       // use Add buff with stacking mode
  Tags:    "status,ice"
  Source:  "enemy_ice_mage"

// Apply fire debuff (could also be a potion)
Action: Player.StatForge → Add buff
  Buff ID: "on_fire"
  Stat:    "burn_damage"
  Value:   10
  Tags:    "status,fire"

// Link: when "on_fire" is added → remove "frozen"
// Set this up at layout start, or whenever the character exists
Action: Player.StatForge → Add buff link
  Link ID:      "fire_melts_ice"
  Source buff:  "on_fire"
  On event:     "activated"
  Target buff:  "frozen"
  Action:       "remove"
// Now applying "on_fire" to a frozen player automatically thaws them
```

---

### Use Case 7 - Enemy difficulty scaling via source

**Scenario:** On Hard mode, all enemies get a buff that increases their damage and health. Changing difficulty removes the old scaling and adds the new one.

```
// At start or on difficulty change
Event: Function → ApplyDifficulty(diffLevel)

  // Clean up any previous difficulty buffs on all enemies
  For each Enemy instance:
    Action: Enemy.StatForge → Remove all buffs from source "difficulty"

  // Hard mode: +30% damage, +50% hp via multiply mode
  Condition: diffLevel = 2
    For each Enemy instance:
      Action: Enemy.StatForge → Add buff
        Buff ID: "diff_damage"
        Stat:    "damage"
        Value:   30          // mode = multiply: +30%
        Tags:    "difficulty"
        Source:  "difficulty"
      Action: Enemy.StatForge → Set stat base value "hp"
        // (alternatively add a separate buff for HP)
```

---

### Use Case 8 - Combo meter with threshold rewards

**Scenario:** A fighting game combo meter. Every hit increments it. At 5, 10, and 20 hits the player gets escalating attack bonuses. The meter resets if the player is hit.

```
// Setup at layout start
Action: Player.StatForge → Set stat base value "combo" 0

Action: Player.StatForge → Add threshold rule
  Rule ID:    "combo_5"     Direction: "reach"    Threshold: 5
  Target: ""  Action: ""    Can repeat: true

Action: Player.StatForge → Add threshold rule
  Rule ID:    "combo_10"    Direction: "reach"    Threshold: 10
  Target: ""  Action: ""    Can repeat: true

Action: Player.StatForge → Add threshold rule
  Rule ID:    "combo_20"    Direction: "reach"    Threshold: 20
  Target: ""  Action: ""    Can repeat: true

// Each hit
Event: On player lands hit
  Action: Player.StatForge → Increment stack counter "combo" by 1
  Action: ComboText → Set text  "Combo x" & Player.StatForge.StatTotal("combo")

// Reset on getting hit
Event: Player takes damage
  Action: Player.StatForge → Reset stack counter "combo"
  Action: ComboText → Set text ""

// React to thresholds
Event: Player.StatForge → On threshold reached
  Condition: LastRuleID = "combo_5"
    Action: Player.StatForge → Add timed buff "combo_5_bonus" "attack" 10 3s tags "combo_bonus"
    Action: UI → Flash "5 HIT COMBO!"

  Condition: LastRuleID = "combo_10"
    Action: Player.StatForge → Add timed buff "combo_10_bonus" "attack" 25 3s tags "combo_bonus"
    Action: UI → Flash "10 HIT COMBO!!"

  Condition: LastRuleID = "combo_20"
    Action: Player.StatForge → Add timed buff "combo_20_bonus" "attack" 60 5s tags "combo_bonus"
    Action: UI → Flash "ULTRA COMBO!!!"
```

---

### Use Case 9 - Saving and restoring character state

**Scenario:** The player's complete buff stack is saved with the game and restored on load. (Automatic - no extra work required.)

```
Event: Button "Save" → On clicked
  Action: System → Save state
  // StatForge data is included automatically

Event: Button "Load" → On clicked
  Action: System → Load state
  // StatForge data restored automatically

// Refresh UI after load
Event: System → On state loaded
  Action: UI_HP → Set text  "HP:" & Player.StatForge.StatTotal("hp")
  Action: UI_Attack → Set text  "ATK:" & Player.StatForge.StatTotal("attack")
  // Timers also restored - a potion with 3s remaining still has 3s remaining
```

---

### Use Case 10 - Procedural dungeon item rolls from JSON

**Scenario:** Each dungeon room generates a random item whose stats come from a JSON string (from a JSON file, a variable, or server data). Load it directly into StatForge.

```
// When player picks up a procedural item
Event: Player → On collision with DroppedItem
  // itemData is a local variable containing the JSON for this item
  // e.g. {"id":"proc_ring_12","stat":"hp","value":45,"mode":"add","tags":"equipment,ring","source":"room_7"}
  Action: Player.StatForge → Add buff from JSON  DroppedItem.itemData
  Action: DroppedItem → Destroy

// If the item has multiple modifiers, use an array and loop:
Event: Function → LoadItemBuffs(jsonArray)
  Local variable i = 0
  Action: JSON → Parse jsonArray
  For i from 0 to JSON.Size-1:
    Action: Player.StatForge → Add buff from JSON  JSON.GetAt(i)
```

---

### Use Case 11 - Buff Link chain: stun breaks into daze

**Scenario:** A "stunned" status expires and automatically replaces itself with a "dazed" buff (a weaker follow-up). When dazed expires, a "recovery" visual buff briefly activates.

```
// Setup links at layout start
Action: Player.StatForge → Add buff link
  Link ID:     "stun_to_daze"
  Source buff: "stun"
  On event:    "expired"
  Target buff: "daze"
  Action:      "activate"
// "daze" must already exist in inactive state for this to activate it

Action: Player.StatForge → Add buff link
  Link ID:     "daze_to_recovery"
  Source buff: "daze"
  On event:    "expired"
  Target buff: "recovery_flash"
  Action:      "activate"

// Apply stun
Action: Player.StatForge → Add timed buff
  Buff ID: "stun"    Stat: "can_move"    Value: 0    Mode: override    Duration: 2

// Pre-add daze as inactive so the link can activate it
Action: Player.StatForge → Add buff
  Buff ID: "daze"    Stat: "speed"    Value: -40    Active: false

// Pre-add recovery flash as inactive
Action: Player.StatForge → Add timed buff
  Buff ID: "recovery_flash"    Stat: ""    Value: 0    Duration: 0.5    Active: false
```

---

### Use Case 12 - Turn-based game with manual timer advancement

**Scenario:** A tactics game where "time" advances by turns. Buffs last for a number of turns, not seconds. Auto-tick is disabled; each turn you advance by 1.

```
// Properties: Auto-tick timers = No

// Apply a "fortified" buff lasting 3 turns
Event: Player uses Fortify ability
  Action: Player.StatForge → Add timed buff
    Buff ID:  "fortified"
    Stat:     "defense"
    Value:    30
    Duration: 3        // This now means "3 seconds" but we only advance 1 at a time
    Tags:     "status"

// Each time the player ends their turn
Event: Button "End Turn" → On clicked
  Action: Player.StatForge → Advance all timers by 1
  // After 3 clicks, "fortified" expires

// Show turns remaining (floor is fine since we advance in whole units)
Event: Has buff "fortified"
  Action: StatusText → Set text  "Fortified: " & floor(Player.StatForge.BuffRemainingTime("fortified")) & " turns"
```

---

### Use Case 13 - Narrative state machine 

**Scenario:** A dialogue/quest system where each quest state is tracked as a buff. Using tags and sources you can check which quests are active, completed, or failed - all in StatForge without any extra arrays or variables.

```
// Start a quest
Action: QuestController.StatForge → Add buff
  Buff ID: "quest_traders_dilemma"
  Stat:    "quest_active_count"
  Value:   1
  Tags:    "quest,active"
  Source:  "main_story"

// Complete a quest
Action: QuestController.StatForge → Remove tag from buff "quest_traders_dilemma" "active"
Action: QuestController.StatForge → Add tag to buff "quest_traders_dilemma" "completed"

// Check active quest count
Expression: QuestController.StatForge.CountBuffsByTag("active")
// = number of currently active quests

// Check if a specific quest is done
Condition: QuestController.StatForge → Buff has tag "quest_traders_dilemma" "completed"

// Fail all main story quests (e.g. bad ending)
Action: QuestController.StatForge → Remove all buffs from source "main_story"
```

---

### Use Case 14 - Physics modifier layers 

**Scenario:** A platformer where different zones (water, mud, ice, wind) each apply speed and jump modifiers. Multiple zones can overlap. Entering and leaving zones adds/removes their buff.

```
// Player enters water zone
Event: Player overlaps WaterTrigger
  Condition: NOT Player.StatForge → Has buff "water_drag"
    Action: Player.StatForge → Add buff
      Buff ID: "water_drag"
      Stat:    "speed"
      Value:   -40
      Tags:    "environment,water"
    Action: Player.StatForge → Add buff
      Buff ID: "water_jump"
      Stat:    "jump_strength"
      Value:   -25
      Tags:    "environment,water"

// Player leaves water zone
Event: Player NOT overlapping WaterTrigger
  Condition: Player.StatForge → Has buff "water_drag"
    Action: Player.StatForge → Remove tag "environment" buffs from tag "water"
    // OR use: Remove all buffs with tag "water"
    Action: Player.StatForge → Remove all buffs with tag "water"

// Apply to platformer physics each tick
Event: System → Every tick
  Action: Player (Platform) → Set max speed  Player.StatForge.StatTotal("speed")
  Action: Player (Platform) → Set jump strength  Player.StatForge.StatTotal("jump_strength")
```

---

### Use Case 15 - Cooldown tracking 

**Scenario:** Ability cooldowns as temporary buffs. While the buff exists, the ability is on cooldown (`BuffActiveState` returns 1). Zero management code needed.

```
// Player activates Fireball ability
Event: Button "Fireball" → On clicked
  Condition: NOT Player.StatForge → Has buff "cd_fireball"
    // Fire the ability
    Action: Fireball → Create at Player.X, Player.Y

    // Start the cooldown
    Action: Player.StatForge → Add timed buff
      Buff ID:  "cd_fireball"
      Stat:     "fireball_ready"
      Value:    0
      Duration: 5
      Tags:     "cooldown"

// UI: show cooldown overlay
Event: System → Every tick
  Action: FireballButton → Set opacity
    200 * (1 - Player.StatForge.BuffElapsedTime("cd_fireball") / 5)
    // fades from opaque (on cooldown) to transparent (ready)

// Cooldowns also survive save/load automatically
```

---

### Use Case 16 - Economy price modifiers 

**Scenario:** A shop that adjusts item prices based on reputation, events, and active bonuses. Multiple price modifiers stack correctly using multiply mode.

```
// Base prices set via stat base values
Action: ShopController.StatForge → Set stat base value "sword_price" 100
Action: ShopController.StatForge → Set stat base value "potion_price" 30

// Reputation discount (player is liked) - applied once
Action: ShopController.StatForge → Add buff
  Buff ID: "reputation_discount"
  Stat:    "sword_price"
  Value:   -15    // multiply mode: -15% = cheaper
  Mode:    multiply
  Tags:    "reputation"

// Festival event: everything momentarily cheaper
Action: ShopController.StatForge → Add timed buff
  Buff ID:  "festival_sale"
  Stat:     "sword_price"
  Value:    -20    // multiply: -20%
  Duration: 300    // 5 minutes
  Tags:     "event"

// Read the final price
Expression: floor(ShopController.StatForge.StatTotal("sword_price"))
// base 100 × (1 + (-15-20)/100) = 100 × 0.65 = 65 gold
```

---

### Use Case 17 - Light radius and vision system 

**Scenario:** A stealth or horror game where the player's visible radius is a stat. Torches add to it, darkness zones reduce it, and a "blind" status overrides it to 0.

```
// Base vision
Action: Player.StatForge → Set stat base value "vision_radius" 200

// Each held torch
Event: Player picks up torch
  Action: Player.StatForge → Add buff
    Buff ID: "torch_" & torchCount   // unique per torch
    Stat:    "vision_radius"
    Value:   80
    Tags:    "light_source"

// Dark zone penalty
Event: Player enters DarkZone
  Action: Player.StatForge → Add buff
    Buff ID: "darkzone_penalty"
    Stat:    "vision_radius"
    Value:   -150
    Tags:    "environment"

// Blind status - overrides everything
Event: Player.StatForge → Add buff
  Buff ID: "blind"
  Stat:    "vision_radius"
  Value:   0
  Mode:    override
  Tags:    "status"
  Duration: 3   // timed

// Apply to light object every tick
Event: System → Every tick
  Action: PlayerLight → Set size  Player.StatForge.StatTotal("vision_radius") * 2
```

---

### Use Case 18 - Debuff immunity window 

**Scenario:** After recovering from stun, the player is immune to being re-stunned for 2 seconds. Use a buff to represent the immunity and check for it before applying stun.

```
// When something tries to stun the player
Event: Enemy ability hits Player (stun)
  Condition: NOT Player.StatForge → Has buff "stun_immunity"
    Action: Player.StatForge → Add timed buff
      Buff ID:  "stun"
      Stat:     "can_act"
      Value:    0
      Mode:     override
      Duration: 1.5
      Tags:     "status,stun"

// When stun expires, grant immunity
Event: Player.StatForge → On buff expired
  Condition: LastBuffID = "stun"
    Action: Player.StatForge → Add timed buff
      Buff ID:  "stun_immunity"
      Stat:     "stun_immune"
      Value:    1
      Duration: 2
      Tags:     "immunity"
    Action: ImmunityFlash → Set visible true

Event: Player.StatForge → On buff expired
  Condition: LastBuffID = "stun_immunity"
    Action: ImmunityFlash → Set visible false
```

---

### Use Case 19 - Shared world event that buffs all enemies

**Scenario:** A boss enters Phase 2. Every active enemy on the layout should immediately receive +50 attack and +20% speed. When the boss dies, the buffs are removed from all enemies.

```
// Boss transitions to phase 2
Event: Boss HP drops below 50%
  For each Enemy:
    Action: Enemy.StatForge → Add buff
      Buff ID: "phase2_rage"
      Stat:    "attack"
      Value:   50
      Tags:    "boss_phase2"
      Source:  "boss_phase2"
    Action: Enemy.StatForge → Add buff
      Buff ID: "phase2_haste"
      Stat:    "speed"
      Value:   20
      Mode:    multiply
      Tags:    "boss_phase2"
      Source:  "boss_phase2"

// Boss is defeated
Event: Boss → HP = 0
  For each Enemy:
    Action: Enemy.StatForge → Remove all buffs from source "boss_phase2"
```

---

### Use Case 20 - Per-instance stat variation for enemy types 

**Scenario:** Instead of hardcoding stats into variables, generate enemy stats at spawn time by adding buffs from a JSON definition. Goblins load one config, trolls load another. Every instance is independent.

```
// Enemy types defined as JSON strings (could be from a JSON file or variable)
Global variable: GoblinStats = "[{\"id\":\"base_hp\",\"stat\":\"hp\",\"value\":40},{\"id\":\"base_dmg\",\"stat\":\"damage\",\"value\":8},{\"id\":\"base_spd\",\"stat\":\"speed\",\"value\":180}]"
Global variable: TrollStats  = "[{\"id\":\"base_hp\",\"stat\":\"hp\",\"value\":200},{\"id\":\"base_dmg\",\"stat\":\"damage\",\"value\":25},{\"id\":\"base_spd\",\"stat\":\"speed\",\"value\":80}]"

// On enemy spawn (variable "enemyType" is set by the spawner)
Event: Enemy → On created
  Condition: Enemy.enemyType = "goblin"
    Action: Enemy.StatForge → Add buff from JSON  GoblinStats[0]
    // Repeat for each entry, or loop through the JSON array

// Now every goblin instance is fully independent
// Buff one goblin - only that goblin is affected
Event: Goblin touches AlchemistBarrel
  Action: Enemy.StatForge → Add timed buff "acid_burn" "hp" -5 multiply 8 tags "debuff"
```

---

### Other game use cases

The use cases above show full event sheet setups. The patterns below describe how StatForge fits into common game genres at a higher level - use them as starting points.

**Action RPG (Diablo / Path of Exile style):** Items, gems, and skill nodes each call `Add buff (full options)` with `source` set to the item's ID (e.g. `"sword_of_fire"`). When the item is unequipped, a single `Remove all buffs from source` call strips every modifier that item contributed - no tag pre-planning required. Flasks use `Add timed buff`. A Buff Link ties a flask buff to a secondary cooldown marker: when the flask expires, the cooldown buff activates automatically.

**Auto-battler / Roguelite (Slay the Spire / Balatro style):** Status effects like Poison, Strength, and Vulnerable are buffs. Each hit calls `Increment stack counter` on a `"poison_stacks"` stat. A threshold rule fires `activate` on a `"poison_damage_buff"` the moment stacks reach 3. A second rule at 6 upgrades to a stronger variant. `Remove all buffs with tag` clears all status effects at round end without tracking individual IDs.

**Tower defence with elemental resistances:** Each enemy has StatForge attached. Towers stamp their debuffs with `source` set to their UID. When a tower is sold, `Remove all buffs from source` instantly strips all its contributions from every enemy it debuffed. A Buff Link on each slow debuff ties its expiry to deactivating a paired visual-cue buff - no polling needed.

**Platformer power-up system (Hollow Knight / Celeste style):** Charms use `Add buff` with tag `"charm"` and `source` set to a charm slot ID. `Enable/disable buffs by tag` suppresses all charms in a hotspring. A swing counter increments on every attack. A threshold rule at count 5 activates a pre-registered dormant `"whirlwind_buff"` and auto-resets the counter - every fifth swing becomes a free AoE with no counter variable in the event sheet.

**Strategy / 4X (XCOM / Civilization style):** Units gain buffs from terrain, adjacency bonuses, and equipment - each stamped with a source. When a unit moves, `Remove all buffs from source "terrain"` strips the old tile bonus before the new tile applies its own. A Buff Link ties a flanking unit's adjacency buff to the recipient: when the flanker's buff is removed, the recipient's linked bonus is removed automatically.

**Fighting game (Street Fighter / Guilty Gear style):** Entering Super mode calls `Enable/disable buffs by tag "super_buffs"`. A Buff Link ties super-mode's deactivation to removing the invincibility and damage-boost buffs it implies. A threshold rule fires the Revenge Gauge burst when the `"revenge_meter"` stat reaches 100, then auto-resets to 0 and re-arms for the next round.

**Cosy farming game (Stardew Valley style):** Seasonal bonuses are permanent buffs stamped `source: "season_spring"`. On season change, `Remove all buffs from source` swaps them out cleanly. Meal buffs use `Add timed buff with source` with the meal's ID, so serving a new meal can remove the old meal's buffs before applying the new ones. `On threshold reached` fires a harvest celebration when a crop-growth stat hits 100.

**Rhythm game (Beat Saber style):** Each note hit calls `Increment stack counter` on `"combo"`. Threshold rules activate multiplier buffs at combo milestones (10, 25, 50) with `Set rule can repeat` off, so each fires exactly once per run. Missing a note calls `Reset stack counter`, triggering `drop_below` rules that deactivate all milestone buffs instantly. `LastChangedStatTotal` inside `On stat changed` feeds the HUD multiplier display without polling.

---

## 18. C3 Debugger

StatForge integrates with the Construct 3 debugger panel. When you run the game in debug mode and inspect an object that has StatForge attached, you'll see three sections:

### Opening the debugger

Run your game with **Debug layout**. Click on your object in the layout to select it. In the debugger panel on the right, expand the StatForge behavior section.

### Debugger sections

**StatForge - Buff Stack**

Every buff currently in the stack is listed as its own row:

| Field | What it shows |
|-------|--------------|
| `$buffId` | The buff's name/ID (e.g. `$speed_potion`) |
| Value | `stat_name | mode value | active:true/false | Xs` - a one-line summary of the buff's stat, stacking mode, active state, and time remaining (or `-` for permanent) |

**Stat Totals**

One row per unique stat that has at least one buff or a base value set:

| Field | What it shows |
|-------|--------------|
| `$stat_name` | The computed `StatTotal` for that stat at the current frame |

**Counts**

| Field | What it shows |
|-------|--------------|
| `$Total buffs` | Total buffs in the stack |
| `$Active buffs` | Buffs currently enabled |
| `$Temporary buffs` | Buffs with a countdown timer |
| `$Buff links` | Total registered links |
| `$Threshold rules` | Total registered rules |
| `$Armed rules` | Rules that will fire on the next threshold crossing |

---

## 19. Scripting (C3 Script / JavaScript)

StatForge exposes a full scripting API for use in C3's **Script** event block or in any `.js` file added to the project. This lets you drive the buff system entirely from JavaScript without using event sheet actions.

### Accessing the behavior

From a Script event or a JS file, get the StatForge behavior through the instance's `behaviors` object:

```js
// Inside a Script event on an object that has StatForge:
const sf = this.behaviors.StatForge;

// Or by fetching an instance from the runtime:
const player = runtime.objects.Player.getFirstInstance();
const sf = player.behaviors.StatForge;
```

The name used (`StatForge`) is the **behavior's name in your project**, not the addon ID. If you renamed it in the Properties panel it will be different.

### Calling actions from script

All actions are directly callable because every action ACE has `expose: true`. Method names are **PascalCase** matching the ACE ID (derived from the file name):

```js
// Add a permanent buff
sf.AddBuff("sword_bonus", "attack", 30, "equipment,weapon");

// Add a timed buff
sf.AddTemporaryBuff("speed_potion", "speed", 40, 8, "potion");

// Add a buff with full control (mode is a 0-based index: 0=add, 1=multiply, 2=override)
sf.AddBuffFull("rage", "attack", 50, 0, "status", "encounter");

// Remove a buff
sf.RemoveBuff("sword_bonus");

// Clear all buffs
sf.ClearAllBuffs();

// Set a stat base value
sf.SetStatBase("hp", 200);

// Add a timed buff from source
sf.AddTemporaryBuffWithSource("frost_slow", "speed", -30, 5, "debuff", "ice_mage");

// Remove all buffs from a source
sf.RemoveBuffsBySource("ice_mage");

// Activate/deactivate a buff
sf.SetBuffActive("my_buff", false);

// Toggle a buff
sf.ToggleBuffActive("stealth_penalty");
```

> **Combo parameters are 0-based indices in script.** `AddBuffFull` takes `mode` as `0` (add), `1` (multiply), or `2` (override) — not the string `"add"`. This applies to any action with a dropdown (combo) parameter.

### Reading state from script

Query methods are **camelCase** and return values directly — no event sheet needed:

```js
// Stat values
const speed      = sf.statTotal("speed");              // fully computed total
const base       = sf.statBase("speed");               // base value only
const addBonus   = sf.statAddSum("speed");             // sum of add-mode buffs
const multiplier = sf.statMultiplier("speed");         // e.g. 1.5 for +50%
const multPct    = sf.statMultiplierPercent("speed");  // e.g. 50 for +50%

// Buff existence / state
const exists   = sf.hasBuff("my_buff");          // boolean
const active   = sf.isBuffActive("my_buff");     // boolean
const timed    = sf.isBuffTemporary("my_buff");  // boolean
const paused   = sf.isTimerPaused("my_buff");    // boolean

// Buff info
const value     = sf.buffValue("my_buff");        // number
const stat      = sf.buffStat("my_buff");         // string
const mode      = sf.buffMode("my_buff");         // "add" | "multiply" | "override"
const source    = sf.buffSource("my_buff");       // string
const remaining = sf.buffRemainingTime("my_buff"); // seconds remaining
const elapsed   = sf.buffElapsedTime("my_buff");   // seconds elapsed
const duration  = sf.buffDuration("my_buff");      // total duration
const state     = sf.buffActiveState("my_buff");   // 1=active, 0=inactive, -1=not found

// Tag checks
const hasTag    = sf.buffHasTag("my_buff", "fire");       // boolean
const anyTag    = sf.hasBuffWithTag("fire");               // boolean
const activeTag = sf.hasActiveBuffWithTag("fire");         // boolean

// Source checks
const hasSrc    = sf.hasBuffWithSource("item_id");         // boolean
const srcMatch  = sf.buffSourceMatches("my_buff", "item"); // boolean

// Stat checks
const onStat    = sf.hasBuffOnStat("speed");               // boolean
const activeStat = sf.hasActiveBuffOnStat("speed");        // boolean
const inRange   = sf.statTotalInRange("hp", 0, 100);       // boolean
const above     = sf.stackAbove("combo", 5);               // boolean
const below     = sf.stackBelow("combo", 5);               // boolean

// Link and rule checks
const hasLink   = sf.hasBuffLink("my_link");               // boolean
const hasRule   = sf.hasThresholdRule("my_rule");          // boolean
const armed     = sf.isThresholdRuleArmed("my_rule");      // boolean

// Counts
const total     = sf.countBuffs();
const active    = sf.countActiveBuffs();
const byTag     = sf.countBuffsByTag("debuff");
const activeTag = sf.countActiveBuffsByTag("debuff");
const onStat    = sf.countBuffsOnStat("speed");
const activeStat = sf.countActiveBuffsOnStat("speed");
const bySrc     = sf.countBuffsBySource("item_id");
const links     = sf.countBuffLinks();
const rules     = sf.countThresholdRules();
const armedN    = sf.countArmedRules();

// Indexed access (pair with count methods)
const buffId  = sf.getBuffByIndex(0);
const tagBuff = sf.getBuffByTagIndex("debuff", 0);
const srcBuff = sf.getBuffBySourceIndex("item_id", 0);
const statBuff = sf.getBuffOnStatByIndex("speed", 0);

// Tag lists on a specific buff
const tagCount = sf.countBuffTags("my_buff");
const tag0     = sf.getBuffTagByIndex("my_buff", 0);
```

### Listening to events from script

Use C3 Script's `addEventListener` on the behavior instance to react to the same triggers as the event sheet:

```js
sf.addEventListener("OnBuffAdded", () => {
  console.log("Buff added:", sf.lastBuffID(), "→", sf.lastBuffStat());
});

sf.addEventListener("OnStatChanged", () => {
  if (sf.lastChangedStat() === "hp") {
    updateHPBar(sf.lastChangedStatTotal());
  }
});

sf.addEventListener("OnBuffExpired", () => {
  console.log("Expired:", sf.lastBuffID());
});

sf.addEventListener("OnThresholdReached", () => {
  console.log("Rule fired:", sf.lastRuleID(), "at", sf.lastRuleThreshold());
});
```

Event context accessors are the same camelCase methods used in the query API:

```js
// Inside any event listener:
sf.lastBuffID()             // ID of the most recent buff event
sf.lastBuffStat()           // stat of the most recent buff event
sf.lastBuffValue()          // value of the most recent buff event
sf.lastBuffMode()           // mode of the most recent buff event
sf.lastBuffSource()         // source of the most recent buff event
sf.countLastBuffTags()      // number of tags on the most recent buff
sf.getLastBuffTagByIndex(i) // tag at index i from the most recent buff event
sf.lastChangedStat()        // stat from the most recent OnStatChanged
sf.lastChangedStatTotal()   // new total from the most recent OnStatChanged
sf.lastFiredLinkID()        // link ID from the most recent OnBuffLinkFired
sf.lastFiredLinkSourceBuff() // source buff from the most recent link fire
sf.lastFiredLinkTargetBuff() // target buff from the most recent link fire
sf.lastRuleID()             // rule ID from the most recent OnThresholdReached
sf.lastRuleWatchStat()      // watched stat from the most recent threshold event
sf.lastRuleThreshold()      // threshold value from the most recent threshold event
sf.lastRuleTargetBuff()     // target buff from the most recent threshold event
sf.lastRuleAction()         // action string from the most recent threshold event
```

### Looping over buffs in script

The Count + Index pattern used in the event sheet works identically in JS:

```js
// Loop over all buffs
for (let i = 0; i < sf.countBuffs(); i++) {
  const id     = sf.getBuffByIndex(i);
  const value  = sf.buffValue(id);
  const stat   = sf.buffStat(id);
  console.log(`${id}: ${stat} ${value}`);
}

// Loop over debuffs only
for (let i = 0; i < sf.countBuffsByTag("debuff"); i++) {
  const id = sf.getBuffByTagIndex("debuff", i);
  console.log("Debuff:", id, "remaining:", sf.buffRemainingTime(id).toFixed(1) + "s");
}
```

### Complete example — game script class using StatForge

```js
// In a Scripts file loaded by your project

class PlayerController {
  constructor(playerInst) {
    this.inst = playerInst;
    this.sf   = playerInst.behaviors.StatForge;
    this._setupBaseStats();
    this._listenForEvents();
  }

  _setupBaseStats() {
    this.sf.SetStatBase("hp",      200);
    this.sf.SetStatBase("attack",  50);
    this.sf.SetStatBase("speed",   150);
  }

  _listenForEvents() {
    this.sf.addEventListener("OnStatChanged", () => {
      if (this.sf.lastChangedStat() === "hp") {
        this._onHpChanged(this.sf.lastChangedStatTotal());
      }
    });
    this.sf.addEventListener("OnBuffExpired", () => {
      console.log(`[PlayerCtrl] buff expired: ${this.sf.lastBuffID()}`);
    });
  }

  _onHpChanged(newHp) {
    // Update HP bar, check death, etc.
    if (newHp <= 0) this._die();
  }

  equipWeapon(slotId, attackBonus, tags = "equipment") {
    // Using slot ID means equipping a new weapon replaces the old one
    this.sf.AddBuff(slotId, "attack", attackBonus, tags);
  }

  unequipWeapon(slotId) {
    this.sf.RemoveBuff(slotId);
  }

  applyPoison(stackId, dps, duration) {
    const tags = this.sf.countBuffsByTag("poison") < 5 ? "poison,debuff" : null;
    if (tags) this.sf.AddTemporaryBuff(stackId, "poison_dps", dps, duration, tags);
  }

  clearDebuffs() {
    this.sf.RemoveBuffsByTag("debuff");
  }

  getSpeed() { return this.sf.statTotal("speed"); }
  getAttack() { return this.sf.statTotal("attack"); }
  getHP()     { return this.sf.statTotal("hp");     }

  _die() { /* handle death */ }
}
```

---

## 20. Tips and Common Mistakes

- **Buff IDs are per-instance, not global.** Two different Player instances can both have a buff called `"sword_bonus"` - they don't interfere with each other. But one Player instance can only have one buff called `"sword_bonus"` at a time.

- **Adding a buff with a duplicate ID replaces the old one silently.** This is useful for "slots" (weapon slot, helm slot) but can be a bug if you expect two separate buffs with the same ID to coexist. Use unique IDs (e.g. append a UID) when you want multiple independent stacks.

- **Event context expressions are only valid inside their trigger.** `LastBuffID()`, `LastChangedStat()`, etc. reflect the *most recently* fired event. Reading them outside a trigger block gives you stale data from the last event, not the current one.

- **`On buff removed` fires for both manual removes AND expiry.** If a timed buff expires, you get `On buff expired` first, then `On buff removed`. If you want to handle expiry differently from manual removal, use `On buff expired`; otherwise `On buff removed` catches both.

- **Override mode uses the highest value, not the last added.** If you want "freeze sets speed to 0" you must use override with value `0`. If a second override buff exists with value `50`, it will win. To ensure a zero override always wins, consider deactivating conflicting override buffs instead.

- **Multiply mode values are percentages, not multipliers.** A value of `50` means "+50%", not "×50". A value of `-100` would bring a stat to zero (assuming no override).

- **Stat totals do not persist across sessions without Save/Load.** If you only set base values at layout start without saving, they will reset when the layout is reloaded. Use the Initial Buffs JSON property for values that should always be there, or set them in `On start of layout` and ensure you don't reload unless necessary.

- **Tags are case-sensitive.** `"Fire"` and `"fire"` are different tags. Pick a convention (all lowercase is recommended) and stick to it.

- **Threshold rules are transition-based.** A `"reach"` rule only fires when the stat crosses the threshold *upward* (from below to at-or-above). If the stat starts above the threshold and you register the rule, it won't fire immediately - only on the next upward crossing.

- **`Clear all buffs` does not remove links or threshold rules.** Links and rules are independent of the buff stack. Use `Clear all buff links` and `Clear all threshold rules` separately if you need a full reset.
