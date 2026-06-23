import PrimaryButton from "./PrimaryButton";
import { feedback } from "../lib/feedback";

export default function Splash({ onEnter }: { onEnter: () => void }) {
  function enter() {
    feedback.tap();
    onEnter();
  }
  return (
    <div className="relative h-[100dvh] flex flex-col items-center justify-between px-7 py-14 text-center overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle,#ff8a5c,transparent 70%)" }} />
      <div className="absolute -bottom-24 -right-20 w-72 h-72 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle,#b15cff,transparent 70%)" }} />

      <div className="fade-in pt-6">
        <span className="text-[11px] tracking-[0.35em] uppercase text-[var(--color-muted)]">
          A dopamine site
        </span>
      </div>

      <div className="relative flex flex-col items-center">
        <div className="text-[88px] floaty drop-shadow-2xl">🛒</div>
        <h1 className="mt-6 text-[42px] leading-[1.05] font-semibold fade-up">
          Phantom <span className="text-[var(--color-peach)]">Cart</span>
        </h1>
        <p className="mt-4 text-[15px] text-[var(--color-muted)] max-w-[18rem] fade-up"
          style={{ animationDelay: "0.1s" }}>
          Browse the menu. Fill the cart. Track the courier.
          <br />
          <span className="text-[var(--color-cream)]">Order the feeling — never the food.</span>
        </p>
      </div>

      <div className="w-full fade-up" style={{ animationDelay: "0.2s" }}>
        <div className="mb-5 mx-auto max-w-[20rem] rounded-2xl border border-[var(--color-line)] bg-[var(--color-ink-2)]/60 px-4 py-3 text-[12.5px] text-[var(--color-muted)] leading-snug">
          🫧 This is a simulation. No real orders, no payments, ever.
          Just the ritual — and your wallet stays full.
        </div>
        <PrimaryButton onClick={enter}>Enter the kitchen</PrimaryButton>
        <p className="mt-4 text-[11px] text-[var(--color-muted)]/70">Phantom Kitchen · est. nowhere</p>
      </div>
    </div>
  );
}
