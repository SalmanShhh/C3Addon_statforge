export const config = {
  returnType: "number",
  description: "Returns the fully computed total of the named stat: base + add buffs, then multiplied by multiply buffs, then overridden if any override buffs are active. This is the main value to use in your game logic.",
  params: [
    { id: "stat", name: "Stat", desc: "The stat name.", type: "string" },
  ],
};

export const expose = false;

export default function (stat) {
  return this.statTotal(stat);
}
