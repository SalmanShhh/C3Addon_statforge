export const config = {
  returnType: "string",
  description: "Returns the source label of the buff from the most recent 'On buff added', 'On buff removed', or 'On buff expired' event. Returns an empty string if the buff had no source.",
  params: [],
};

export const expose = false;

export default function () {
  return this.lastBuffSource();
}
