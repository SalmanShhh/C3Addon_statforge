export const config = {
  returnType: "string",
  description: "Returns the tag at the given index from the most recent 'On buff added' event. Pair with CountLastBuffTags.",
  params: [
    { id: "index", name: "Index", desc: "0-based index.", type: "number" },
  ],
};

export const expose = false;

export default function (index) {
  return this._lastBuffTags[index] ?? "";
}
