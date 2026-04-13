export const config = {
  listName: "Has active buff on stat",
  displayText: "Has active buff on stat {0}",
  description: "True if at least one enabled buff is currently targeting the given stat.",
  params: [
    { id: "stat", name: "Stat", desc: "The stat name to check.", type: "string", initialValue: '"attack"' },
  ],
};

export const expose = false;

export default function (stat) {
  for (const buff of this._buffMap.values()) {
    if (buff.stat === stat && buff.active) return true;
  }
  return false;
}
