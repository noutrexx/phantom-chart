import { useState } from "react";
import type { Savings } from "../hooks/useSavings";
import { feedback } from "../lib/feedback";
import { Check, Trophy } from "./icons";

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

  const today = new Date().toISOString().slice(0, 10);
  const missionDone = savings.lastOrderDate === today;
  const nextBadge = BADGES.find((b) => savings.orders < b.need) ?? BADGES[BADGES.length - 1];
  const progress = Math.min(1, savings.orders / nextBadge.need);
  const remaining = Math.max(0, nextBadge.need - savings.orders);

  return (
    <div className="h-full overflow-y-auto pb-24 bg-[var(--color-bg)]">
      <div className="sticky top-0 z-10 border-b border-[var(--color-line)] bg-[var(--color-bg)]/95 px-5 pt-3 pb-3 backdrop-blur">
        <h1 className="text-[24px] font-extrabold tracking-tight">Rewards</h1>
        <p className="text-[13px] text-[var(--color-ink-2)] mt-0.5">Progress from orders you never paid for.</p>
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-[18px] bg-[var(--color-ink)] text-white p-5 shadow-lift">
          <p className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-white/55">Total saved</p>
          <p className="mt-1 text-[42px] font-extrabold tabular-nums leading-none">${savings.totalSaved.toFixed(2)}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat value={savings.totalKcal.toLocaleString("en-US")} label="kcal" />
            <Stat value={String(savings.orders)} label="orders" />
            <Stat value={`${liveStreak}x`} label="streak" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className={`rounded-2xl border p-4 shadow-soft ${missionDone ? "border-[var(--color-green)] bg-[var(--color-green)]/8" : "border-[var(--color-line)] bg-[var(--color-surface)]"}`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl grid place-items-center ${missionDone ? "bg-[var(--color-green)] text-white" : "bg-[var(--color-soft)] text-[var(--color-ink)]"}`}>
              {missionDone ? <Check size={18} /> : <Trophy size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-extrabold tracking-tight">{missionDone ? "Daily mission complete" : "Daily mission"}</p>
              <p className="text-[12.5px] text-[var(--color-ink-2)] mt-0.5">
                {missionDone ? "You completed the order ritual and kept the money." : "Place one phantom order today to extend your streak."}
              </p>
            </div>
            <span className="rounded-full bg-[var(--color-soft)] px-2.5 py-1 text-[11px] font-extrabold tabular-nums">{liveStreak}x</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[16px] font-extrabold tracking-tight">Badge progress</h2>
          <span className="text-[12px] font-bold text-[var(--color-ink-3)] tabular-nums">{savings.orders}/{nextBadge.need}</span>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[14px] font-extrabold tracking-tight">{nextBadge.label}</p>
              <p className="text-[12px] text-[var(--color-ink-2)] mt-0.5">
                {remaining} more phantom order{remaining === 1 ? "" : "s"} to unlock
              </p>
            </div>
            <span className="rounded-full bg-[var(--color-green)]/10 px-3 py-1.5 text-[12px] font-extrabold text-[var(--color-green-ink)]">{Math.round(progress * 100)}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[var(--color-soft)] overflow-hidden">
            <div className="h-full rounded-full bg-[var(--color-green)] transition-[width] duration-300" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {BADGES.map((badge) => (
              <BadgeCard key={badge.label} label={badge.label} earned={savings.orders >= badge.need} need={badge.need} current={savings.orders} />
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <button onClick={spin} className="w-full rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] shadow-soft p-4 flex items-center justify-between active:scale-[0.99] transition">
          <div className="text-left">
            <p className="text-[14px] font-extrabold tracking-tight">{spun ? "Coupon refreshed" : "Fake coupon"}</p>
            <p className="text-[12px] text-[var(--color-ink-2)]">A small hit of checkout theater.</p>
          </div>
          <span className="rounded-xl bg-[var(--color-ink)] text-white px-3.5 py-2 text-[13px] font-extrabold tracking-wider">{coupon}</span>
        </button>
      </div>
    </div>
  );
}

function BadgeCard({ label, earned, need, current }: { label: string; earned: boolean; need: number; current: number }) {
  return (
    <div className={`rounded-xl p-3 border ${earned ? "border-[var(--color-green)] bg-[var(--color-green)]/8" : "border-[var(--color-line)] bg-[var(--color-soft)]"}`}>
      <div className="flex items-center gap-2">
        <Trophy size={16} className={earned ? "text-[var(--color-green-ink)]" : "text-[var(--color-ink-3)]"} />
        <p className="text-[12.5px] font-extrabold leading-tight">{label}</p>
      </div>
      <p className="mt-1 text-[11px] font-bold text-[var(--color-ink-2)] tabular-nums">{earned ? "Earned" : `${Math.max(0, need - current)} left`}</p>
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
