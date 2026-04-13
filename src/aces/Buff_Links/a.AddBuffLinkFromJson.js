export const config = {
  listName: "Add buff link from JSON",
  displayText: "Add buff link from JSON: {0}",
  description: "Registers a buff link from a JSON string. See the documentation for the buff link definition format.",
  params: [
    { id: "json", name: "JSON string", desc: "A JSON object describing the link.", type: "string", initialValue: '"{}"' },
  ],
};

export const expose = true;

export default function (json) {
  let def;
  try { def = JSON.parse(json); } catch (e) {
    if (this._debugMode) console.warn("[StatForge] AddBuffLinkFromJson: invalid JSON", e);
    return;
  }
  if (!def.linkId || !def.sourceBuffId || !def.sourceEvent || !def.targetBuffId || !def.targetAction) return;
  this._linkMap.set(def.linkId, {
    linkId:       def.linkId,
    sourceBuffId: def.sourceBuffId,
    sourceEvent:  def.sourceEvent,
    targetBuffId: def.targetBuffId,
    targetAction: def.targetAction,
  });
  this._trigger("OnBuffLinkAdded");
}
