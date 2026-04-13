export const config = {
  listName: "Set buff duration",
  displayText: "Set duration of buff {0} to {1} seconds",
  description: "Changes how long a timed buff lasts. Does not reset the time already elapsed — the buff will expire sooner if elapsed is already high.",
  params: [
    { id: "buffId",   name: "Buff ID",         desc: "The buff to update.", type: "string", initialValue: '"my_buff"' },
    { id: "duration", name: "Duration (secs)", desc: "The new total duration in seconds.", type: "number", initialValue: "5" },
  ],
};

export const expose = true;

export default function (buffId, duration) {
  const buff = this._buffMap.get(buffId);
  if (buff) buff.duration = Math.max(0, duration);
}
