export const config = {
  listName: "On stack cleared",
  displayText: "On stack cleared",
  description: "Fires once after all buffs have been removed by the 'Clear all buffs' action.",
  isTrigger: true,
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
