export const config = {
  listName: "On buff link fired",
  displayText: "On buff link fired",
  description: "Fires whenever a buff link automatically executes its action. Use LastFiredLinkID, LastFiredLinkSourceBuff, and LastFiredLinkTargetBuff inside this event. Useful for debugging reactive chains.",
  isTrigger: true,
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
