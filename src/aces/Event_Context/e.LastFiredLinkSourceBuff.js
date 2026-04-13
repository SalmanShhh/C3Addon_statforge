export const config = {
  returnType: "string",
  description: "Returns the source buff ID from the most recent 'On buff link fired' event (the buff whose event triggered the link).",
  params: [],
};

export const expose = false;

export default function () {
  return this._lastFiredLinkSourceBuff;
}
