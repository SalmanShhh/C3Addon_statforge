export const config = {
  listName: "Stack is below value",
  displayText: "Stack {0} is below {1}",
  description: "True if the stat's computed total is strictly less than the given value.",
  params: [
    { id: "statId", name: "Stat / Counter", desc: "The stat or counter name to check.", type: "string", initialValue: '"combo"' },
    { id: "value",  name: "Value",          desc: "The value to compare against.", type: "number", initialValue: "5" },
  ],
};

export const expose = false;

export default function (statId, value) {
  return this.stackBelow(statId, value);
}
