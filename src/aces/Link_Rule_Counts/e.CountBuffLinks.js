export const config = {
  returnType: "number",
  description: "Returns the total number of registered buff links.",
  params: [],
};

export const expose = false;

export default function () {
  return this.countBuffLinks();
}
