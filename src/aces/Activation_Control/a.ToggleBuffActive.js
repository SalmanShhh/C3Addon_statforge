export const config = {
  listName: "Toggle buff on/off",
  displayText: "Toggle buff {0} on/off",
  description: "Flips a buff between enabled and disabled. If it was on it turns off, and vice versa.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The buff to toggle.", type: "string", initialValue: '"my_buff"' },
  ],
};

export const expose = true;

export default function (buffId) {
  const buff = this._buffMap.get(buffId);
  if (buff) this._setBuffActive(buffId, !buff.active);
}
