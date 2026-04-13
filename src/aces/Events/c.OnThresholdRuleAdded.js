export const config = {
  listName: "On threshold rule added",
  displayText: "On threshold rule added",
  description: "Fires when a new threshold rule is registered.",
  isTrigger: true,
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
