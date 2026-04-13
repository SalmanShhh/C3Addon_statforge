export const config = {
  returnType: "string",
  description: "Returns the stacking mode (\"add\", \"multiply\", or \"override\") of the buff from the most recent 'On buff added' event.",
  params: [],
};

export const expose = false;

export default function () {
  return this._lastBuffMode;
}
