export const config = {
  returnType: "string",
  description: "Returns the source label of a buff (who created it). Returns an empty string if the buff has no source or does not exist.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff ID to query.", type: "string" },
  ],
};

export const expose = false;

export default function (buffId) {
  return this.buffSource(buffId);
}
