export const config = {
  listName: "On buff deactivated",
  displayText: "On buff deactivated",
  description: "Fires when a buff changes from enabled to disabled. Use LastBuffID and LastBuffStat inside this event.",
  isTrigger: true,
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
