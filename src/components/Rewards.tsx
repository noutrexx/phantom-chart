import { useState } from "react";
import type { Savings } from "../hooks/useSavings";
import { feedback } from "../lib/feedback";
import { Trophy } from "./icons";

const COUPONS = ["ZEROHERO", "NOBILL", "CARTZEN", "SKIP100", "GHOSTEATS"];
const BADGES = [
  { label: "Zero Dollar Hero", need: 1 },
  { label: "Cart Master", need: 3 },
  { label: "Late Night Saver", need: 5 },
  { label: "Phantom Regular", need: 10 },
];

export default function Rewards({ savings, liveStreak }: { savings: Savings; liveStreak: number }) {
  const [coupon, setCoupon] = useState(COUPONS[0]);
  const [spun, setSpun] = useState(false);

  function spin() {
    feedback.surprise();
    setSpun(true);
    setCoupon(COUPONS[Math.floor(Math.random() * COUPONS.length)]);
  }

  const nextBadge = BADGES.find((b) => savings.orders < b.need) ?? BADGES[BADGES.length - 1];
  const progress = Math.min(1, savings.orders / nextBadge.need);

  return (
    <div className="h-full overflow-y-auto pb-24 bg-[var(--color-bg)]">
      <div className="px-5 pt-3 pb-2">
        <h1 className="text-[24px] font-extrabold tracking-tight">Rewards</h1>
        <p className="text-[13px] text-[var(--color-ink-2)] mt-0.5">Earned by spending nothing at all.</p>
      </div>

      <div className="px-5">
        <div className="rounded-2xl bg-[var(--color-ink)] text-white p-5 shadow-lift">
          <p className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-white/55">Total saved</p>
          <p className="mt-1 text-[40px] font-extrabold tabular-nums leading-none">${savings.totalSaved.toFixed(2)}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat value={savings.totalKcal.toLocaleString("en-US")} label="kcal avoided" />
            <Stat value={String(savings.orders)} label="orders" />
            <Stat value={`${liveStreak}x`} label="streak" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[16px] font-extrabold tracking-tight">Badges</h2>
          <span className="text-[12px] font-bold text-[var(--color-ink-3)] tabular-nums">{savings.orders}/{nextBadge.need} to next</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--color-soft)] overflow-hidden mb-3">
          <div className="h-full rounded-full bg-[var(--color-green)] transition-[width] duration-300" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {BADGES.map((b) => {
            const earned = savings.orders >= b.need;
            return (
              <div key={b.label} className={`rounded-xl p-3 border ${earned ? "border-[var(--color-green)] bg-[var(--color-green)]/8" : "border-[var(--color-line)] bg-[var(--color-surface)]"}`}>
                <div className="flex items-center gap-2">
                  <Trophy size={16} className={earned ? "text-[var(--color-green-ink)]" : "text-[var(--color-ink-3)]"} />
                  <p className="text-[12.5px] font-extrabold leading-tight">{b.label}</p>
                </div>
                <p className="mt-1 text-[11px] font-bold text-[var(--color-ink-2)] tabular-nums">{earned ? "Earned" : `${b.need - savings.orders} more`}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 mt-4">
        <button onClick={spin} className="w-full rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] shadow-soft p-4 flex items-center justify-between active:scale-[0.99] transition">
          <div className="text-left">
            <p className="text-[14px] font-extrabold tracking-tight">{spun ? "Your fake coupon" : "Spin a fake coupon"}</p>
            <p className="text-[12px] text-[var(--color-ink-2)]">Redeemable for $0.00, like everything else.</p>
          </div>
          <span className="rounded-xl bg-[var(--color-ink)] text-white px-3.5 py-2 text-[13px] font-extrabold tracking-wider">{coupon}</span>
        </button>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/10 py-2">
      <p className="text-[15px] font-extrabold tabular-nums leading-none">{value}</p>
      <p className="text-[10px] text-white/60 mt-1">{label}</p>
    </div>
  );
}
