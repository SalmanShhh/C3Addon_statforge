export const config = {
  returnType: "number",
  description: "Returns 1 if the buff is active, 0 if disabled, or -1 if it does not exist.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff ID to query.", type: "string" },
  ],
};

export const expose = false;

export default function (buffId) {
  return this.buffActiveState(buffId);
}
