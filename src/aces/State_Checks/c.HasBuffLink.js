export const config = {
  listName: "Has buff link",
  displayText: "Has buff link {0}",
  description: "True if a buff link with this ID currently exists.",
  params: [
    { id: "linkId", name: "Link ID", desc: "The link ID to check.", type: "string", initialValue: '"my_link"' },
  ],
};

export const expose = false;

export default function (linkId) {
  return this.hasBuffLink(linkId);
}
