export const config = {
  returnType: "string",
  description: "Returns the target buff ID from the most recent 'On buff link fired' event (the buff that received the action).",
  params: [],
};

export const expose = false;

export default function () {
  return this._lastFiredLinkTargetBuff;
}
