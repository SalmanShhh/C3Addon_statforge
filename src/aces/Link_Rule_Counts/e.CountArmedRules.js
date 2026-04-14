export const config = {
  returnType: "number",
  description: "Returns the number of threshold rules that are currently armed and ready to fire on the next qualifying threshold crossing.",
  params: [],
};

export const expose = false;

export default function () {
  return this.countArmedRules();
}
