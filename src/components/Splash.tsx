import FoodImage from "./FoodImage";
import { foodImg } from "../lib/img";
import { feedback } from "../lib/feedback";

export default function Splash({ onEnter }: { onEnter: () => void }) {
  function enter() {
    feedback.tap();
    onEnter();
  }

  return (
    <div className="h-full relative bg-black overflow-hidden">
      <FoodImage
        src={foodImg("gourmet+food+spread", "splash-hero", 860, 1100)}
        alt="Food"
        className="absolute inset-0"
        gradient="linear-gradient(160deg,#2a2a2e,#0b0b0c)"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0.05) 30%,rgba(0,0,0,0.55) 70%,rgba(0,0,0,0.92) 100%)" }}
      />

      <div className="relative h-full flex flex-col justify-between px-6 pt-3 pb-8 text-white">
        <div className="fade-in">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-white text-black grid place-items-center font-extrabold text-[15px]">P</span>
            <span className="text-[17px] font-extrabold tracking-tight">Phantom Eats</span>
          </div>
        </div>

        <div className="fade-up">
          <span className="inline-block text-[11px] font-bold tracking-[0.18em] uppercase text-white/70 mb-3">
            The order that never comes
          </span>
          <h1 className="text-[34px] leading-[1.08] font-extrabold tracking-tight">
            Crave it. Cart it.
            <br />
            Skip the bill.
          </h1>
          <p className="mt-3 text-[14.5px] text-white/75 max-w-[20rem] leading-relaxed">
            Browse menus, fill your cart and track a courier - for the dopamine,
            not the delivery. You pay nothing, every time.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/12 backdrop-blur px-3.5 py-2 text-[12px] text-white/85 border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)]" />
            Simulation only - no real orders, no payments
          </div>

          <button
            onClick={enter}
            className="mt-6 w-full rounded-[14px] bg-white text-black py-[15px] text-[16px] font-bold tracking-tight active:scale-[0.98] transition shadow-lift"
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}
