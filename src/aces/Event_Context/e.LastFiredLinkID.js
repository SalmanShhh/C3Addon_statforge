export const config = {
  returnType: "string",
  description: "Returns the link ID from the most recent 'On buff link fired' event.",
  params: [],
};

export const expose = false;

export default function () {
  return this.lastFiredLinkID();
}
