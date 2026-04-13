export const config = {
  returnType: "string",
  description: "Returns the action string (\"activate\", \"deactivate\", \"remove\", or \"add_from_template\") from the most recent 'On threshold reached' event.",
  params: [],
};

export const expose = false;

export default function () {
  return this._lastRuleAction;
}
