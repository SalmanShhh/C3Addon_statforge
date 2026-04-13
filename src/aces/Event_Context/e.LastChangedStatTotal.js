export const config = {
  returnType: "number",
  description: "Returns the new computed total of the stat from the most recent 'On stat changed' event. Use this to update a HUD display without polling.",
  params: [],
};

export const expose = false;

export default function () {
  return this._lastChangedStatTotal;
}
