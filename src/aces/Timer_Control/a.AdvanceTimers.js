export const config = {
  listName: "Advance all timers manually",
  displayText: "Advance all buff timers by {0} seconds",
  description: "Manually ticks all active timed buffs forward by the given number of seconds. Only useful when Auto-tick timers is turned off in the behavior properties.",
  params: [
    { id: "deltaTime", name: "Delta time (secs)", desc: "Seconds to advance all timers by.", type: "number", initialValue: "0.016" },
  ],
};

export const expose = true;

export default function (deltaTime) {
  const toExpire = [];
  for (const [buffId, buff] of this._buffMap) {
    if (buff.temporary && buff.active && !buff.timerPaused) {
      buff.elapsed += deltaTime;
      if (buff.elapsed >= buff.duration) toExpire.push(buffId);
    }
  }
  for (const buffId of toExpire) this._expireBuff(buffId);
}
