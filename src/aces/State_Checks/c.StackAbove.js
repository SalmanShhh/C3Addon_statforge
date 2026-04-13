export const config = {
  listName: "Stack is above value",
  displayText: "Stack {0} is above {1}",
  description: "True if the stat's computed total is strictly greater than the given value. A handy shortcut for checking counter thresholds in the event sheet.",
  params: [
    { id: "statId", name: "Stat / Counter", desc: "The stat or counter name to check.", type: "string", initialValue: '"combo"' },
    { id: "value",  name: "Value",          desc: "The value to compare against.", type: "number", initialValue: "5" },
  ],
};

export const expose = false;

export default function (statId, value) {
  return this._computeStatTotal(statId) > value;
}
