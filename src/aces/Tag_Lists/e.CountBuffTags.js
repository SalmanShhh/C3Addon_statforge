export const config = {
  returnType: "number",
  description: "Returns how many tags the given buff has. Returns 0 if the buff does not exist.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff ID to query.", type: "string" },
  ],
};

export const expose = false;

export default function (buffId) {
  return this._buffMap.get(buffId)?.tags.size ?? 0;
}
