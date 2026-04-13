export const config = {
  returnType: "number",
  description: "Returns how many seconds are left before the timed buff expires (duration minus elapsed). Returns 0 for permanent buffs or buffs that do not exist.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff ID to query.", type: "string" },
  ],
};

export const expose = false;

export default function (buffId) {
  const buff = this._buffMap.get(buffId);
  if (!buff || !buff.temporary) return 0;
  return Math.max(0, buff.duration - buff.elapsed);
}
