export const config = {
  returnType: "string",
  description: "Returns the tag at the given index on the specified buff. Returns an empty string if out of range. Pair with CountBuffTags.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff ID to query.", type: "string" },
    { id: "index",  name: "Index",   desc: "0-based index of the tag.", type: "number" },
  ],
};

export const expose = false;

export default function (buffId, index) {
  return this.getBuffTagByIndex(buffId, index);
}
