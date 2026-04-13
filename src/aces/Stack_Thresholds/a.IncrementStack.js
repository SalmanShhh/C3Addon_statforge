export const config = {
  listName: "Increment stack counter",
  displayText: "Add {1} to stack counter {0}",
  description: "Increases a stat's base value by the given amount. Use this as a hit counter, combo counter, or charge counter. Fires 'On stat changed' and evaluates any threshold rules watching this stat.",
  params: [
    { id: "statId",  name: "Stat / Counter", desc: "The stat name to increment, e.g. \"combo\" or \"hit_count\".", type: "string", initialValue: '"combo"' },
    { id: "amount",  name: "Amount",         desc: "How much to add to the counter.", type: "number", initialValue: "1" },
  ],
};

export const expose = true;

export default function (statId, amount) {
  const current = this._statBaseMap.get(statId) ?? 0;
  const prev    = this._computeStatTotal(statId);
  this._statBaseMap.set(statId, current + amount);
  this._notifyStatChangedIfChanged(statId, prev);
}
