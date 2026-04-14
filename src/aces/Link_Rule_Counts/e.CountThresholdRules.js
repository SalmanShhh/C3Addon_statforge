export const config = {
  returnType: "number",
  description: "Returns the total number of registered threshold rules.",
  params: [],
};

export const expose = false;

export default function () {
  return this.countThresholdRules();
}
