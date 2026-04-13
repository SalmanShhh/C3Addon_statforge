export const config = {
  listName: "Decrement stack counter",
  displayText: "Subtract {1} from stack counter {0}",
  description: "Decreases a stat's base value by the given amount. Fires 'On stat changed' and evaluates threshold rules.",
  params: [
    { id: "statId", name: "Stat / Counter", desc: "The stat name to decrease.", type: "string", initialValue: '"combo"' },
    { id: "amount", name: "Amount",         desc: "How much to subtract.", type: "number", initialValue: "1" },
  ],
};

export const expose = true;

export default function (statId, amount) {
  const current = this._statBaseMap.get(statId) ?? 0;
  const prev    = this._computeStatTotal(statId);
  this._statBaseMap.set(statId, current - amount);
  this._notifyStatChangedIfChanged(statId, prev);
}
