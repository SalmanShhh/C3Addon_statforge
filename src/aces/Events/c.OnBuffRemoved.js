export const config = {
  listName: "On buff removed",
  displayText: "On buff removed",
  description: "Fires when any buff is removed — whether manually, by tag, by source, from a link, or because it expired. Use LastBuffID and LastBuffStat inside this event.",
  isTrigger: true,
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
