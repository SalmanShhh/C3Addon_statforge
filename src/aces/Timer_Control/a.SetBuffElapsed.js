export const config = {
  listName: "Set buff elapsed time",
  displayText: "Set elapsed time of buff {0} to {1} seconds",
  description: "Directly sets how much time has passed on a timed buff. If the value is equal to or greater than the duration, the buff expires immediately.",
  params: [
    { id: "buffId",  name: "Buff ID",       desc: "The buff to update.", type: "string", initialValue: '"my_buff"' },
    { id: "elapsed", name: "Elapsed (secs)", desc: "Seconds to set as elapsed. Setting this to the duration or higher will expire the buff.", type: "number", initialValue: "0" },
  ],
};

export const expose = true;

export default function (buffId, elapsed) {
  const buff = this._buffMap.get(buffId);
  if (!buff || !buff.temporary) return;
  buff.elapsed = elapsed;
  if (buff.elapsed >= buff.duration) {
    this._expireBuff(buffId);
  }
}
