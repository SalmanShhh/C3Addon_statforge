export const config = {
  returnType: "string",
  description: "Returns the ID of the buff at the given index (0-based) in the stack. Returns an empty string if the index is out of range. Pair with CountBuffs to loop through all buffs.",
  params: [
    { id: "index", name: "Index", desc: "0-based position in the buff list.", type: "number" },
  ],
};

export const expose = false;

export default function (index) {
  const keys = Array.from(this._buffMap.keys());
  return keys[index] ?? "";
}
