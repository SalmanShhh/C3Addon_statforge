export const config = {
  listName: "Has buff from source",
  displayText: "Has buff from source {0}",
  description: "True if any buff in the stack was created by the given source.",
  params: [
    { id: "source", name: "Source", desc: "The source label to look for.", type: "string", initialValue: '"item_id"' },
  ],
};

export const expose = false;

export default function (source) {
  return this.hasBuffWithSource(source);
}
