export const config = {
  listName: "Has any buff on stat",
  displayText: "Has any buff on stat {0}",
  description: "True if at least one buff — enabled or disabled — is targeting the given stat.",
  params: [
    { id: "stat", name: "Stat", desc: "The stat name to check.", type: "string", initialValue: '"attack"' },
  ],
};

export const expose = false;

export default function (stat) {
  return this.hasBuffOnStat(stat);
}
