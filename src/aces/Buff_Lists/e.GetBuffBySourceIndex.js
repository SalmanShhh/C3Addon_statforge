export const config = {
  returnType: "string",
  description: "Returns the buff ID at the given index among buffs matching the given source. Returns an empty string if out of range. Pair with CountBuffsBySource.",
  params: [
    { id: "source", name: "Source", desc: "The source label to filter by.", type: "string" },
    { id: "index",  name: "Index",  desc: "0-based position in the filtered list.", type: "number" },
  ],
};

export const expose = false;

export default function (source, index) {
  return this.getBuffBySourceIndex(source, index);
}
