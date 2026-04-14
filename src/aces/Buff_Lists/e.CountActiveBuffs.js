export const config = {
  returnType: "number",
  description: "Returns the number of buffs that are currently enabled (active = true).",
  params: [],
};

export const expose = false;

export default function () {
  return this.countActiveBuffs();
}
