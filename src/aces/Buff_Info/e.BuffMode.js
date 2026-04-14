export const config = {
  returnType: "string",
  description: "Returns the stacking mode of a buff: \"add\", \"multiply\", or \"override\". Returns an empty string if the buff does not exist.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff ID to query.", type: "string" },
  ],
};

export const expose = false;

export default function (buffId) {
  return this.buffMode(buffId);
}
