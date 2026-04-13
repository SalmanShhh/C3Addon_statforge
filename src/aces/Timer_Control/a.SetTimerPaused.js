export const config = {
  listName: "Pause/resume buff timer",
  displayText: "Set buff {0} timer paused: {1}",
  description: "Pauses or resumes a timed buff's countdown. While paused, the buff stays active and does not count toward expiry.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff to pause or resume.", type: "string", initialValue: '"my_buff"' },
    { id: "paused", name: "Paused",  desc: "True to pause the timer, false to resume it.", type: "boolean", initialValue: "true" },
  ],
};

export const expose = true;

export default function (buffId, paused) {
  const buff = this._buffMap.get(buffId);
  if (buff) buff.timerPaused = paused;
}
