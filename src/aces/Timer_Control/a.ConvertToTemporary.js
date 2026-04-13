export const config = {
  listName: "Convert buff to timed",
  displayText: "Convert buff {0} to timed with duration {1} seconds",
  description: "Turns a permanent buff into a timed one. The countdown starts from zero immediately.",
  params: [
    { id: "buffId",   name: "Buff ID",         desc: "The buff to convert.", type: "string", initialValue: '"my_buff"' },
    { id: "duration", name: "Duration (secs)", desc: "How long the buff will last.", type: "number", initialValue: "5" },
  ],
};

export const expose = true;

export default function (buffId, duration) {
  const buff = this._buffMap.get(buffId);
  if (!buff) return;
  buff.temporary   = true;
  buff.duration    = Math.max(0, duration);
  buff.elapsed     = 0;
  buff.timerPaused = false;
}
