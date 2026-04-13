export const config = {
  listName: "Set buff source",
  displayText: "Set source of buff {0} to {1}",
  description: "Changes the source label on an existing buff without removing or re-adding it. Pass an empty string to clear the source.",
  params: [
    { id: "buffId",  name: "Buff ID",  desc: "The buff to update.", type: "string", initialValue: '"my_buff"' },
    { id: "source",  name: "Source",   desc: "The new source label. Use \"\" to remove it.", type: "string", initialValue: '""' },
  ],
};

export const expose = true;

export default function (buffId, source) {
  const buff = this._buffMap.get(buffId);
  if (buff) buff.source = source ?? "";
}
