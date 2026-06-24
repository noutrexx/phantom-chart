import FoodImage from "./FoodImage";
import { foodImg } from "../lib/img";
import { feedback } from "../lib/feedback";
import { RESTAURANTS } from "../data";

export default function Splash({ onEnter }: { onEnter: () => void }) {
  function enter() {
    feedback.tap();
    onEnter();
  }

  return (
    <div className="h-full relative bg-black overflow-hidden">
      <FoodImage src={foodImg(RESTAURANTS[2].photo, "splash-hero", 860, 1100)} alt="Food" className="absolute inset-0 pointer-events-none" gradient="linear-gradient(160deg,#2a2a2e,#0b0b0c)" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0.05) 30%,rgba(0,0,0,0.55) 70%,rgba(0,0,0,0.92) 100%)" }}
      />

      <div className="absolute left-6 right-6 top-20 grid grid-cols-3 gap-2 opacity-90 pointer-events-none">
        {RESTAURANTS.slice(0, 3).map((restaurant) => (
          <div key={restaurant.id} className="h-20 overflow-hidden rounded-2xl border border-white/15 shadow-card">
            <FoodImage src={foodImg(restaurant.photo, `${restaurant.id}-splash`, 180, 160)} alt={restaurant.name} className="h-full w-full" gradient={restaurant.gradient} />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-between px-6 pt-3 pb-8 text-white">
        <div className="fade-in">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-white text-black grid place-items-center font-extrabold text-[15px]">P</span>
            <span className="text-[17px] font-extrabold tracking-tight">Phantom Eats</span>
          </div>
        </div>

        <div className="fade-up relative z-20">
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
            className="relative z-30 mt-6 w-full rounded-[14px] bg-white text-black py-[15px] text-[16px] font-bold tracking-tight active:scale-[0.98] transition shadow-lift"
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}
