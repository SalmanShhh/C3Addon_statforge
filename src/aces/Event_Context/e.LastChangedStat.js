export const config = {
  returnType: "string",
  description: "Returns the stat name from the most recent 'On stat changed' event. Use this to identify which stat just changed.",
  params: [],
};

export const expose = false;

export default function () {
  return this.lastChangedStat();
}
