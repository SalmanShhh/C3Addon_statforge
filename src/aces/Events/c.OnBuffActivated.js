export const config = {
  listName: "On buff activated",
  displayText: "On buff activated",
  description: "Fires when a buff changes from disabled to enabled. Use LastBuffID and LastBuffStat inside this event.",
  isTrigger: true,
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
