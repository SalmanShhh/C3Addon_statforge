export const config = {
  returnType: "number",
  description: "Returns the total number of buffs in the stack, including disabled ones.",
  params: [],
};

export const expose = false;

export default function () {
  return this.countBuffs();
}
