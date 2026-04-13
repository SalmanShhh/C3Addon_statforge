export const config = {
  listName: "Remove buff link",
  displayText: "Remove buff link {0}",
  description: "Removes a specific buff link by its ID. The buffs it connected are not affected.",
  params: [
    { id: "linkId", name: "Link ID", desc: "The ID of the link to remove.", type: "string", initialValue: '"my_link"' },
  ],
};

export const expose = true;

export default function (linkId) {
  this._linkMap.delete(linkId);
}
