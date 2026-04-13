export const config = {
  listName: "Remove buff",
  displayText: "Remove buff {0}",
  description: "Removes the buff with this ID. If no buff with this ID exists nothing happens.",
  params: [
    { id: "buffId", name: "Buff ID", desc: "The ID of the buff to remove.", type: "string", initialValue: '"my_buff"' },
  ],
};

export const expose = true;

export default function (buffId) {
  this._removeBuff(buffId);
}
