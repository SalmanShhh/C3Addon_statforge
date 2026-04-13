export const config = {
  listName: "On buff expired",
  displayText: "On buff expired",
  description: "Fires when a timed buff's countdown reaches zero, just before it is removed. Use LastBuffID and LastBuffStat inside this event.",
  isTrigger: true,
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
