export const config = {
  listName: "Reset stack counter",
  displayText: "Reset stack counter {0} to zero",
  description: "Sets a stat's base value back to 0. Fires 'On stat changed' and evaluates threshold rules. Use this to reset a combo or hit count after the threshold fires.",
  params: [
    { id: "statId", name: "Stat / Counter", desc: "The stat name to reset.", type: "string", initialValue: '"combo"' },
  ],
};

export const expose = true;

export default function (statId) {
  const prev = this._computeStatTotal(statId);
  this._statBaseMap.set(statId, 0);
  this._notifyStatChangedIfChanged(statId, prev);
}
