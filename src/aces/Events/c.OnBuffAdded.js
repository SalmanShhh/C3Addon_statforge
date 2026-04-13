export const config = {
  listName: "On buff added",
  displayText: "On buff added",
  description: "Fires when any buff is added to this object. Use LastBuffID, LastBuffStat, and LastBuffValue expressions inside this event to read details about the buff that was added.",
  isTrigger: true,
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
