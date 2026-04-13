export const config = {
  listName: "On stat changed",
  displayText: "On stat changed",
  description: "Fires whenever the computed total of any stat changes. Use LastChangedStat to see which stat changed and LastChangedStatTotal for its new value. You can add a sub-condition 'LastChangedStat = \"attack\"' to filter for a specific stat.",
  isTrigger: true,
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
