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
  const buff = this._buffMap.get(buffId);
  if (!buff) return;
  const prevTotal = this._computeStatTotal(buff.stat);
  this._buffMap.delete(buffId);
  this._setLastBuffContext(buff);
  this._trigger("OnBuffRemoved");
  this._resolveLinksForBuff(buffId, "removed");
  this._notifyStatChangedIfChanged(buff.stat, prevTotal);
}
