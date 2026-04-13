export const config = {
  returnType: "number",
  description: "Returns the number of tags on the buff from the most recent 'On buff added' event. Pair with GetLastBuffTagByIndex to loop through them.",
  params: [],
};

export const expose = false;

export default function () {
  return this._lastBuffTags.length;
}
