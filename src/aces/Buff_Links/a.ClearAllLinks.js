export const config = {
  listName: "Clear all buff links",
  displayText: "Clear all buff links",
  description: "Removes all registered buff links. The buff stack is not affected.",
  params: [],
};

export const expose = true;

export default function () {
  this._linkMap.clear();
}
