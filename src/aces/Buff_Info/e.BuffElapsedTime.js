export const config = {
  returnType: "number",
  description: "Returns how many seconds have elapsed since the timed buff was added or last reset. Returns 0 for permanent buffs.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff ID to query.", type: "string" },
  ],
};

export const expose = false;

export default function (buffId) {
  return this.buffElapsedTime(buffId);
}
