import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Order, Restaurant } from "../types";
import type { Savings } from "../hooks/useSavings";
import PrimaryButton from "./PrimaryButton";
import { feedback } from "../lib/feedback";
import { Bike, Check, ChevronDown, Clock, Message, Phone, Pin, Star } from "./icons";

type Outcome = "normal" | "early" | "lost" | "gift";

const STEPS = [
  { label: "Order confirmed", sub: "The kitchen acknowledged your imagination." },
  { label: "Preparing your order", sub: "Sizzling sounds, conceptually." },
  { label: "Courier picked up", sub: "Bag sealed. Bag empty. Bag perfect." },
  { label: "On the way to you", sub: "Echo is dodging traffic that does not exist." },
];

const EVENTS: Record<Outcome, { at: number; icon: string; text: string } | null> = {
  normal: null,
  early: { at: 0.35, icon: "Fast", text: "Echo found a shortcut through streets that do not exist." },
  lost: { at: 0.5, icon: "Map", text: "Echo took a wrong turn. Honestly, relatable." },
  gift: { at: 0.5, icon: "Gift", text: "The kitchen slipped a free dessert into your bag. Also imaginary." },
};

const REVEAL_COPY: Record<Outcome, { emoji: string; title: string; line: string }> = {
  normal: { emoji: "$0", title: "Nothing arrived.", line: "And somehow, you feel a little lighter." },
  early: { emoji: "Fast", title: "Nothing arrived - early.", line: "Record time for a delivery that was never coming." },
  lost: { emoji: "Void", title: "Nothing got lost on the way.", line: "Echo is still out there, carrying the void. Respect." },
  gift: { emoji: "Gift", title: "Nothing arrived - plus a free dessert.", line: "Two things that do not exist. Twice the comfort." },
};

export default function Tracking({
  order,
  restaurant,
  savings,
  liveStreak,
  onMinimize,
  onDelivered,
  onAgain,
}: {
  order: Order;
  restaurant: Restaurant;
  savings: Savings;
  liveStreak: number;
  onMinimize: () => void;
  onDelivered: () => void;
  onAgain: () => void;
}) {
  const outcome: Outcome = order.outcome;
  const durationMs = order.etaMin * 60000;
  const [now, setNow] = useState(Date.now());
  const [event, setEvent] = useState<{ icon: string; text: string } | null>(null);
  const lastStep = useRef(-1);
  const eventFired = useRef(false);
  const deliveredRef = useRef(false);

  const elapsed = now - order.placedAt;
  const progress = Math.min(1, elapsed / durationMs);
  const done = progress >= 1;

  // Timestamp-driven so the real ETA keeps counting even if you leave and
  // come back (the interval only ticks the clock; progress derives from time).
  useEffect(() => {
    if (done) return;
    const ev = EVENTS[outcome];
    const id = window.setInterval(() => {
      const e = Date.now() - order.placedAt;
      const p = Math.min(1, e / durationMs);
      setNow(Date.now());

      if (ev && !eventFired.current && p >= ev.at && p < 1) {
        eventFired.current = true;
        setEvent({ icon: ev.icon, text: ev.text });
        if (outcome === "gift") feedback.surprise();
        else feedback.tap();
        window.setTimeout(() => setEvent(null), 3200);
      }

      const st = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
      if (st !== lastStep.current) {
        lastStep.current = st;
        if (st > 0) feedback.tap();
      }

      if (e >= durationMs) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [order.placedAt, durationMs, outcome, done]);

  useEffect(() => {
    if (done && !deliveredRef.current) {
      deliveredRef.current = true;
      feedback.arrive();
      onDelivered();
    }
  }, [done, onDelivered]);

  const step = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
  const minsLeft = Math.max(1, Math.ceil((durationMs - elapsed) / 60000));
  const activeStep = STEPS[step];

  if (done) {
    return <Reveal restaurant={restaurant} saved={order.subtotal} savings={savings} liveStreak={liveStreak} outcome={outcome} onAgain={onAgain} />;
  }

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg)]">
      <div className="relative h-[44%] overflow-hidden" style={{ background: "#e9efea" }}>
        <MapArt progress={progress} />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={onMinimize} aria-label="Minimize" className="w-9 h-9 rounded-full bg-white grid place-items-center shadow-soft active:scale-90 transition">
              <ChevronDown size={20} className="text-[var(--color-ink)]" />
            </button>
            <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] pulse-dot" />
              <span className="text-[11.5px] font-bold tracking-tight">Live tracking</span>
            </div>
          </div>
          <div className="bg-white rounded-full px-3 py-1.5 shadow-soft text-[11.5px] font-extrabold tabular-nums">
            {Math.round(progress * 100)}%
          </div>
        </div>

        {event && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] fade-up">
            <div className="flex items-center gap-3 rounded-2xl bg-white shadow-card px-4 py-3">
              <span className="rounded-full bg-[var(--color-soft)] px-2 py-1 text-[11px] font-extrabold">{event.icon}</span>
              <span className="text-[12.5px] text-[var(--color-ink)] leading-snug">{event.text}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 -mt-5 rounded-t-3xl bg-[var(--color-bg)] shadow-lift px-6 pt-6 pb-7 relative z-10 flex flex-col overflow-y-auto">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[12.5px] text-[var(--color-ink-2)] font-medium">Arriving in</p>
            <h2 className="text-[32px] font-extrabold tracking-tight leading-none mt-1 tabular-nums">
              {minsLeft} <span className="text-[16px] font-bold text-[var(--color-ink-3)]">min</span>
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-[var(--color-ink-3)]">From</p>
            <p className="text-[14px] font-bold">{restaurant.name}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <TrackingMetric icon={<Clock size={15} />} label={`${minsLeft} min`} sub="ETA" />
          <TrackingMetric icon={<Pin size={15} />} label="0.0 mi" sub="Real distance" />
          <TrackingMetric icon={<Star size={14} />} label="$0.00" sub="Total" />
        </div>

        <div className="mt-4 h-1.5 rounded-full bg-[var(--color-line)] overflow-hidden">
          <div className="h-full rounded-full bg-[var(--color-green)] transition-[width] duration-200" style={{ width: `${progress * 100}%` }} />
        </div>

        <div className="mt-3 rounded-xl bg-[var(--color-soft)] px-3.5 py-3">
          <p className="text-[12px] text-[var(--color-ink-3)] font-bold">Current status</p>
          <p className="text-[14px] font-extrabold tracking-tight mt-0.5">{activeStep.label}</p>
          <p className="text-[12.5px] text-[var(--color-ink-2)] mt-0.5">{activeStep.sub}</p>
        </div>

        <div className="mt-5 flex flex-col gap-4 flex-1">
          {STEPS.map((s, i) => {
            const active = i === step;
            const reached = i <= step;
            return (
              <div key={i} className={`flex items-center gap-3 transition ${reached ? "opacity-100" : "opacity-40"}`}>
                <div className={`w-8 h-8 rounded-full grid place-items-center shrink-0 ${active ? "animate-pop" : ""} ${reached ? "bg-[var(--color-green)] text-white" : "bg-[var(--color-soft)] text-[var(--color-ink-3)]"}`}>
                  {i < step ? <Check size={16} /> : <span className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <div>
                  <p className="text-[14px] font-bold tracking-tight">{s.label}</p>
                  <p className="text-[12.5px] text-[var(--color-ink-2)]">{s.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card shadow-soft p-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[var(--color-ink)] grid place-items-center">
              <Bike size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[13.5px] font-bold">Echo - your courier</p>
              <p className="text-[12.5px] text-[var(--color-ink-2)]">Carrying absolutely nothing, with care</p>
            </div>
            <span className="rounded-full bg-[var(--color-soft)] px-2.5 py-1 text-[11.5px] font-extrabold">4.98</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button className="h-10 rounded-xl bg-[var(--color-soft)] flex items-center justify-center gap-2 text-[13px] font-extrabold active:scale-[0.98] transition">
              <Phone size={15} /> Call
            </button>
            <button className="h-10 rounded-xl bg-[var(--color-soft)] flex items-center justify-center gap-2 text-[13px] font-extrabold active:scale-[0.98] transition">
              <Message size={15} /> Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackingMetric({ icon, label, sub }: { icon: ReactNode; label: string; sub: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-line)] px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[var(--color-ink)]">
        {icon}
        <span className="text-[13px] font-extrabold tabular-nums">{label}</span>
      </div>
      <p className="text-[11px] text-[var(--color-ink-3)] mt-0.5">{sub}</p>
    </div>
  );
}

function MapArt({ progress }: { progress: number }) {
  return (
    <svg viewBox="0 0 430 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <g stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.9">
        {[40, 90, 150, 200].map((y) => (
          <line key={`h${y}`} x1="-10" y1={y} x2="440" y2={y} />
        ))}
        {[60, 130, 210, 290, 360].map((x) => (
          <line key={`v${x}`} x1={x} y1="-10" x2={x} y2="250" />
        ))}
      </g>
      <g stroke="#dfe6e1" strokeWidth="2">
        {[40, 90, 150, 200].map((y) => (
          <line key={`hl${y}`} x1="-10" y1={y} x2="440" y2={y} />
        ))}
      </g>
      <path d="M 26 196 C 110 70, 210 70, 250 140 S 360 230, 404 110" fill="none" stroke="#cfd8d2" strokeWidth="6" strokeLinecap="round" />
      <path d="M 26 196 C 110 70, 210 70, 250 140 S 360 230, 404 110" fill="none" stroke="#0b0b0c" strokeWidth="6" strokeLinecap="round" strokeDasharray="1100" strokeDashoffset={1100 - progress * 1100} />
      <circle cx="404" cy="110" r="11" fill="#06c167" />
      <circle cx="404" cy="110" r="4" fill="#fff" />
      <g>
        <rect x="278" y="82" width="78" height="24" rx="12" fill="#fff" />
        <text x="317" y="98" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0b0b0c">Your couch</text>
      </g>
      <circle cx="26" cy="196" r="7" fill="#0b0b0c" />
      <g>
        <rect x="74" y="176" width="76" height="24" rx="12" fill="#fff" />
        <text x="112" y="192" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0b0b0c">Restaurant</text>
      </g>
      <foreignObject className="courier" width="40" height="40" x="-20" y="-20" style={{ offsetDistance: `${progress * 100}%` } as CSSProperties}>
        <div className="w-10 h-10 rounded-full bg-white shadow-card grid place-items-center">
          <Bike size={20} className="text-[var(--color-ink)]" />
        </div>
      </foreignObject>
    </svg>
  );
}

function Reveal({
  restaurant,
  saved,
  savings,
  liveStreak,
  outcome,
  onAgain,
}: {
  restaurant: Restaurant;
  saved: number;
  savings: Savings;
  liveStreak: number;
  outcome: Outcome;
  onAgain: () => void;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 60);
    return () => window.clearTimeout(t);
  }, []);
  const copy = REVEAL_COPY[outcome];

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-7 bg-[var(--color-bg)] relative overflow-hidden">
      {show && <ConfettiBurst />}
      {show && (
        <div className="fade-up w-full max-w-[20rem]">
          <div className="text-[72px] leading-none">{copy.emoji}</div>
          <h2 className="mt-5 text-[25px] font-extrabold tracking-tight leading-tight">{copy.title}</h2>
          <p className="mt-2.5 text-[14.5px] text-[var(--color-ink-2)] leading-relaxed">
            {copy.line} The craving from {restaurant.name} is gone - and you spent{" "}
            <span className="text-[var(--color-green-ink)] font-bold">$0.00</span>.
          </p>

          <div className="mt-6 card shadow-soft p-5 text-left">
            <p className="text-[12px] text-[var(--color-ink-2)] font-medium">Saved this round</p>
            <p className="text-[28px] font-extrabold text-[var(--color-green-ink)] tabular-nums leading-none mt-1">${saved.toFixed(2)}</p>
            <div className="divider my-3.5" />
            <div className="flex items-center justify-between text-[12.5px]">
              <span className="text-[var(--color-ink-2)]">All-time saved</span>
              <span className="font-bold tabular-nums">${savings.totalSaved.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-[12.5px] mt-1.5">
              <span className="text-[var(--color-ink-2)]">Night streak</span>
              <span className="font-bold tabular-nums">
                {liveStreak > 0 ? `${liveStreak} night${liveStreak === 1 ? "" : "s"}` : "0 nights"}
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-[var(--color-ink)] text-white p-4 text-left shadow-lift">
            <p className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-white/55">Achievement unlocked</p>
            <p className="mt-1 text-[15px] font-extrabold">Zero Dollar Hero</p>
            <p className="mt-1 text-[12.5px] text-white/70">You completed the full order ritual and kept every dollar.</p>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <PrimaryButton onClick={onAgain}>Order something else</PrimaryButton>
            <button onClick={onAgain} className="text-[13.5px] font-semibold text-[var(--color-ink-2)] py-2">
              I'm good - take a breath
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfettiBurst() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={
            {
              left: `${8 + ((i * 7) % 84)}%`,
              animationDelay: `${i * 0.045}s`,
              background: i % 3 === 0 ? "var(--color-green)" : i % 3 === 1 ? "var(--color-amber)" : "var(--color-red)",
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
