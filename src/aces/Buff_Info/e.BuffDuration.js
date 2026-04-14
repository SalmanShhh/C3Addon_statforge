export const config = {
  returnType: "number",
  description: "Returns the total countdown duration in seconds of a timed buff. Returns 0 for permanent buffs.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff ID to query.", type: "string" },
  ],
};

export const expose = false;

export default function (buffId) {
  return this.buffDuration(buffId);
}
