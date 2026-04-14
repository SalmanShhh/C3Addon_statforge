export const config = {
  returnType: "string",
  description: "Returns the stat name that the buff targets. Returns an empty string if the buff does not exist.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff ID to query.", type: "string" },
  ],
};

export const expose = false;

export default function (buffId) {
  return this.buffStat(buffId);
}
