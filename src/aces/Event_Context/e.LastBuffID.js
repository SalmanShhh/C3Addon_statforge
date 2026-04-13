export const config = {
  returnType: "string",
  description: "Returns the ID of the buff from the most recent buff event (added, removed, expired, activated, or deactivated). Only valid inside those trigger conditions.",
  params: [],
};

export const expose = false;

export default function () {
  return this._lastBuffID;
}
