export const config = {
  returnType: "number",
  description: "Returns the numeric modifier value of the buff from the most recent buff event. Only valid inside buff trigger conditions.",
  params: [],
};

export const expose = false;

export default function () {
  return this.lastBuffValue();
}
