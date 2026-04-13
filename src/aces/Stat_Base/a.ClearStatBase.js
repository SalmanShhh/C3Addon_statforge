export const config = {
  listName: "Clear stat base value",
  displayText: "Clear base value of stat {0}",
  description: "Removes the base value for a stat, reverting it to 0. Fires 'On stat changed' if the total changes.",
  params: [
    { id: "stat", name: "Stat", desc: "The stat name to clear the base for.", type: "string", initialValue: '"attack"' },
  ],
};

export const expose = true;

export default function (stat) {
  const prev = this._computeStatTotal(stat);
  this._statBaseMap.delete(stat);
  this._notifyStatChangedIfChanged(stat, prev);
}
