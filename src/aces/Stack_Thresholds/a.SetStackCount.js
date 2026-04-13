export const config = {
  listName: "Set stack counter value",
  displayText: "Set stack counter {0} to {1}",
  description: "Sets a stat's base value to an exact number. Fires 'On stat changed' and evaluates threshold rules.",
  params: [
    { id: "statId", name: "Stat / Counter", desc: "The stat name to set.", type: "string", initialValue: '"combo"' },
    { id: "value",  name: "Value",          desc: "The value to set the counter to.", type: "number", initialValue: "0" },
  ],
};

export const expose = true;

export default function (statId, value) {
  const prev = this._computeStatTotal(statId);
  this._statBaseMap.set(statId, value);
  this._notifyStatChangedIfChanged(statId, prev);
}
