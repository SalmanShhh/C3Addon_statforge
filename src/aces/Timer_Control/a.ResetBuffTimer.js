export const config = {
  listName: "Reset buff timer",
  displayText: "Reset timer of buff {0}",
  description: "Restarts a timed buff's countdown from zero without changing its total duration.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff whose timer to reset.", type: "string", initialValue: '"my_buff"' },
  ],
};

export const expose = true;

export default function (buffId) {
  const buff = this._buffMap.get(buffId);
  if (buff) buff.elapsed = 0;
}
