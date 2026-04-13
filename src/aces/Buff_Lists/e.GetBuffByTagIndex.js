export const config = {
  returnType: "string",
  description: "Returns the ID of the buff at the given index among buffs with the specified tag. Returns an empty string if out of range. Pair with CountBuffsByTag.",
  params: [
    { id: "tag",   name: "Tag",   desc: "The tag to filter by.", type: "string" },
    { id: "index", name: "Index", desc: "0-based position in the filtered list.", type: "number" },
  ],
};

export const expose = false;

export default function (tag, index) {
  let i = 0;
  for (const buff of this._buffMap.values()) {
    if (buff.tags.has(tag)) {
      if (i === index) return buff.id;
      i++;
    }
  }
  return "";
}
