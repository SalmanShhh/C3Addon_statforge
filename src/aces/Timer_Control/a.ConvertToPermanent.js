export const config = {
  listName: "Convert buff to permanent",
  displayText: "Convert buff {0} to permanent",
  description: "Turns a timed buff into a permanent one, cancelling its countdown. The buff will stay active until removed manually.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff to convert.", type: "string", initialValue: '"my_buff"' },
  ],
};

export const expose = true;

export default function (buffId) {
  const buff = this._buffMap.get(buffId);
  if (!buff) return;
  buff.temporary   = false;
  buff.duration    = 0;
  buff.elapsed     = 0;
  buff.timerPaused = false;
}
