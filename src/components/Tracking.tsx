import { useEffect, useRef, useState } from "react";
import type { Restaurant } from "../types";
import type { Savings } from "../hooks/useSavings";
import PrimaryButton from "./PrimaryButton";
import { feedback } from "../lib/feedback";

type Outcome = "normal" | "early" | "lost" | "gift";

const STEPS = [
  { icon: "✅", label: "Order confirmed", sub: "The kitchen has acknowledged your imagination." },
  { icon: "👨‍🍳", label: "Pretending to cook", sub: "Sizzling sounds, conceptually." },
  { icon: "📦", label: "Courier picked up your nothing", sub: "Bag sealed. Bag empty. Bag perfect." },
  { icon: "🛵", label: "Speeding to your couch", sub: "Dodging traffic that also doesn't exist." },
];

// Weighted pick so "normal" stays the baseline but surprises keep it unpredictable.
function pickOutcome(): Outcome {
  const r = Math.random();
  if (r < 0.4) return "normal";
  if (r < 0.6) return "early";
  if (r < 0.8) return "lost";
  return "gift";
}

const EVENTS: Record<Outcome, { at: number; icon: string; text: string } | null> = {
  normal: null,
  early: { at: 0.35, icon: "💨", text: "Echo found a shortcut through streets that don't exist." },
  lost: { at: 0.5, icon: "🗺️", text: "Echo took a wrong turn. Honestly, relatable." },
  gift: { at: 0.5, icon: "🍮", text: "The kitchen slipped a free dessert into your bag. It's also imaginary." },
};

export default function Tracking({
  restaurant,
  saved,
  savings,
  liveStreak,
  onAgain,
}: {
  restaurant: Restaurant;
  saved: number;
  savings: Savings;
  liveStreak: number;
  onAgain: () => void;
}) {
  const [outcome] = useState<Outcome>(pickOutcome);
  const rideMs = outcome === "early" ? 9000 : outcome === "lost" ? 16000 : 13000;

  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const [event, setEvent] = useState<{ icon: string; text: string } | null>(null);
  const lastStep = useRef(-1);
  const eventFired = useRef(false);

  // Timestamp-driven so it keeps progressing even when the tab is backgrounded
  // (requestAnimationFrame pauses when the page isn't painting).
  useEffect(() => {
    const ev = EVENTS[outcome];
    const startT = performance.now();
    const id = window.setInterval(() => {
      const e = performance.now() - startT;
      setElapsed(e);
      const p = Math.min(1, e / rideMs);

      // mid-ride surprise, once
      if (ev && !eventFired.current && p >= ev.at) {
        eventFired.current = true;
        setEvent({ icon: ev.icon, text: ev.text });
        if (outcome === "gift") feedback.surprise();
        else feedback.tap();
        window.setTimeout(() => setEvent(null), 3200);
      }

      // tap on each new step
      const st = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
      if (st !== lastStep.current) {
        lastStep.current = st;
        if (st > 0) feedback.tap();
      }

      if (e >= rideMs) {
        setElapsed(rideMs);
        setDone(true);
        feedback.arrive();
        window.clearInterval(id);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [rideMs, outcome]);

  const progress = Math.min(1, elapsed / rideMs);
  const step = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
  const minsLeft = Math.max(1, Math.ceil(restaurant.etaMin * (1 - progress)));

  if (done) {
    return (
      <Reveal
        restaurant={restaurant}
        saved={saved}
        savings={savings}
        liveStreak={liveStreak}
        outcome={outcome}
        onAgain={onAgain}
      />
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col">
      {/* Map */}
      <div className="relative h-[42%] overflow-hidden" style={{ background: "linear-gradient(160deg,#1b2a2a,#141320)" }}>
        <MapArt progress={progress} />
        <div className="absolute top-12 left-0 right-0 text-center">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-mint)]">Live · ish</span>
        </div>
        {event && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[88%] fade-up">
            <div className="flex items-center gap-3 rounded-2xl glass border border-[var(--color-line)] px-4 py-3">
              <span className="text-[22px]">{event.icon}</span>
              <span className="text-[12.5px] text-[var(--color-cream)]">{event.text}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sheet */}
      <div className="flex-1 -mt-7 rounded-t-[2rem] bg-[var(--color-ink)] border-t border-[var(--color-line)] px-6 pt-6 pb-8 relative z-10 flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] text-[var(--color-muted)]">Arriving in</p>
            <h2 className="text-[30px] font-semibold leading-none mt-1 tabular-nums">
              {minsLeft} <span className="text-[16px] font-normal text-[var(--color-muted)]">min</span>
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-[var(--color-muted)]">From</p>
            <p className="text-[14px] font-semibold">{restaurant.name}</p>
          </div>
        </div>

        <div className="mt-5 h-1.5 rounded-full bg-[var(--color-ink-3)] overflow-hidden">
          <div className="h-full rounded-full bg-grad transition-[width] duration-200" style={{ width: `${progress * 100}%` }} />
        </div>

        <div className="mt-6 flex flex-col gap-4 flex-1">
          {STEPS.map((s, i) => {
            const active = i === step;
            const passed = i < step;
            return (
              <div key={i} className={`flex items-center gap-3 transition ${i <= step ? "opacity-100" : "opacity-35"}`}>
                <div className={`w-10 h-10 rounded-full grid place-items-center text-[18px] shrink-0 ${active ? "animate-pop" : ""} ${i <= step ? "bg-grad" : "bg-[var(--color-ink-3)]"}`}>
                  {passed ? "✓" : s.icon}
                </div>
                <div>
                  <p className="text-[14px] font-semibold">{s.label}</p>
                  <p className="text-[12px] text-[var(--color-muted)]">{s.sub}</p>
                </div>
                {active && <span className="ml-auto w-2 h-2 rounded-full bg-[var(--color-mint)] pulse-dot" />}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-[var(--color-ink-2)] border border-[var(--color-line)] p-3 mt-4">
          <div className="w-10 h-10 rounded-full grid place-items-center text-[20px]" style={{ background: "linear-gradient(135deg,#4fd1a5,#3aa0ff)" }}>🛵</div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold">Your courier, “Echo”</p>
            <p className="text-[12px] text-[var(--color-muted)]">Carrying absolutely nothing, with care</p>
          </div>
          <span className="text-[20px] opacity-50">💬</span>
        </div>
      </div>
    </div>
  );
}

function MapArt({ progress }: { progress: number }) {
  return (
    <svg viewBox="0 0 416 220" className="w-full h-full">
      <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1">
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 32} x2="416" y2={i * 32} />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 34} y1="0" x2={i * 34} y2="220" />
        ))}
      </g>
      <path d="M 24 168 C 90 60, 180 60, 220 120 S 330 200, 392 96"
        fill="none" stroke="#2c2838" strokeWidth="6" strokeLinecap="round" />
      <path d="M 24 168 C 90 60, 180 60, 220 120 S 330 200, 392 96"
        fill="none" stroke="url(#g)" strokeWidth="6" strokeLinecap="round"
        strokeDasharray="1000" strokeDashoffset={1000 - progress * 1000} />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffb547" />
          <stop offset="1" stopColor="#ff5c8a" />
        </linearGradient>
      </defs>
      <g>
        <circle cx="392" cy="96" r="10" fill="#ff5c8a" />
        <text x="392" y="100" fontSize="11" textAnchor="middle">🏠</text>
      </g>
      <circle cx="24" cy="168" r="6" fill="#4fd1a5" />
      <foreignObject className="courier" width="34" height="34" x="-17" y="-17"
        style={{ offsetDistance: `${progress * 100}%` } as any}>
        <div style={{ fontSize: 24, lineHeight: "34px", textAlign: "center" }}>🛵</div>
      </foreignObject>
    </svg>
  );
}

const REVEAL_COPY: Record<Outcome, { emoji: string; title: string; line: string }> = {
  normal: { emoji: "🫧", title: "Nothing arrived.", line: "And somehow, you feel a little lighter." },
  early: { emoji: "⚡", title: "Nothing arrived — early!", line: "Record time for a delivery that was never coming." },
  lost: { emoji: "🌫️", title: "Nothing got lost on the way.", line: "Echo is still out there, carrying the void. Respect." },
  gift: { emoji: "🍮", title: "Nothing arrived — plus a free dessert.", line: "Two things that don't exist. Twice the comfort." },
};

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
    <div className="h-[100dvh] flex flex-col items-center justify-center text-center px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30"
        style={{ background: "radial-gradient(70% 50% at 50% 30%, #ff8a5c33, transparent 70%)" }} />
      {show && (
        <div className="fade-up">
          <div className="text-[80px] floaty">{copy.emoji}</div>
          <h2 className="mt-6 text-[26px] font-semibold leading-tight">{copy.title}</h2>
          <p className="mt-3 text-[15px] text-[var(--color-muted)] max-w-[19rem]">
            {copy.line} The craving from
            <span className="text-[var(--color-cream)]"> {restaurant.name} </span>
            is gone — and you spent <span className="text-[var(--color-mint)] font-semibold">$0.00</span>.
          </p>

          <div className="mt-6 inline-flex flex-col gap-1 rounded-2xl bg-[var(--color-ink-2)] border border-[var(--color-line)] px-6 py-4">
            <span className="text-[12px] text-[var(--color-muted)]">Saved this round</span>
            <span className="text-[24px] font-semibold text-grad tabular-nums">${saved.toFixed(2)}</span>
            <div className="h-px bg-[var(--color-line)] my-2" />
            <span className="text-[11px] text-[var(--color-muted)] tabular-nums">
              All-time ${savings.totalSaved.toFixed(2)} · {liveStreak > 0 ? `🔥 ${liveStreak}` : "🌙 0"} night streak
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 w-[min(20rem,80vw)]">
            <PrimaryButton onClick={onAgain}>Crave something else</PrimaryButton>
            <button onClick={onAgain} className="text-[13px] text-[var(--color-muted)] py-2">
              I’m good — take a breath
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
