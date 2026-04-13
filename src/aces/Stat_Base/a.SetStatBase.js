export const config = {
  listName: "Set stat base value",
  displayText: "Set base value of stat {0} to {1}",
  description: "Sets the starting value of a stat before any buffs are applied. For example, set the base attack to 10 so buffs add on top of that. Fires 'On stat changed' if the total changes.",
  params: [
    { id: "stat",  name: "Stat",  desc: "The stat name to set the base for.", type: "string", initialValue: '"attack"' },
    { id: "value", name: "Value", desc: "The new base value.", type: "number", initialValue: "10" },
  ],
};

export const expose = true;

export default function (stat, value) {
  const prev = this._computeStatTotal(stat);
  this._statBaseMap.set(stat, value);
  this._notifyStatChangedIfChanged(stat, prev);
}
