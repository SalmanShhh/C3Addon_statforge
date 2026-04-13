export const config = {
  listName: "Add buff link",
  displayText: "Link {1} on {2} → {4} buff {3} (link ID: {0})",
  description: "Creates a reactive link between two buffs. When the source buff has a certain event (e.g. it expires), an action is automatically performed on the target buff. Useful for chains like 'when shield expires, remove armour bonus'.",
  params: [
    { id: "linkId",       name: "Link ID",          desc: "A unique name for this link.", type: "string", initialValue: '"my_link"' },
    { id: "sourceBuffId", name: "Source buff",       desc: "The buff that triggers the link.", type: "string", initialValue: '"shield_buff"' },
    {
      id: "sourceEvent", name: "Trigger event",
      desc: "Which event on the source buff fires the link. Removed = buff removed. Expired = timer ran out. Activated = buff enabled. Deactivated = buff disabled.",
      type: "combo",
      initialValue: "removed",
      items: [{ removed: "Removed" }, { expired: "Expired" }, { activated: "Activated" }, { deactivated: "Deactivated" }],
    },
    { id: "targetBuffId", name: "Target buff",       desc: "The buff that receives the action.", type: "string", initialValue: '"armour_buff"' },
    {
      id: "targetAction", name: "Target action",
      desc: "What to do to the target buff when the link fires.",
      type: "combo",
      initialValue: "remove",
      items: [{ remove: "Remove" }, { activate: "Activate" }, { deactivate: "Deactivate" }, { toggle_active: "Toggle on/off" }],
    },
  ],
};

export const expose = true;

export default function (linkId, sourceBuffId, sourceEvent, targetBuffId, targetAction) {
  const eventStr  = this._combo(sourceEvent,  ["removed", "expired", "activated", "deactivated"]);
  const actionStr = this._combo(targetAction, ["remove", "activate", "deactivate", "toggle_active"]);
  this._linkMap.set(linkId, { linkId, sourceBuffId, sourceEvent: eventStr, targetBuffId, targetAction: actionStr });
  this._trigger("OnBuffLinkAdded");
  this._log(`Link added: ${linkId}`);
}
