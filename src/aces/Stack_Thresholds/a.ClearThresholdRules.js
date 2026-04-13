export const config = {
  listName: "Clear all threshold rules",
  displayText: "Clear all threshold rules",
  description: "Removes all registered threshold rules at once. The buff stack is not affected.",
  params: [],
};

export const expose = true;

export default function () {
  this._thresholdMap.clear();
}
