import { useEffect, useState } from "react";
import type { Order } from "../types";
import { foodImg } from "../lib/img";
import FoodImage from "./FoodImage";
import { Bike } from "./icons";

export default function ActiveOrderBanner({ order, onOpen }: { order: Order; onOpen: () => void }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const durationMs = order.etaMin * 60000;
  const elapsed = now - order.placedAt;
  const progress = Math.min(1, elapsed / durationMs);
  const arrived = progress >= 1;
  const minsLeft = Math.max(0, Math.ceil((durationMs - elapsed) / 60000));

  return (
    <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 z-30 w-full max-w-[430px] px-5 pb-3 pt-2 pointer-events-none">
      <button
        onClick={onOpen}
        className="pointer-events-auto w-full rounded-2xl bg-[var(--color-ink)] text-white shadow-lift active:scale-[0.98] transition fade-up overflow-hidden"
      >
        <div className="flex items-center gap-3 p-2.5">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0">
            <FoodImage src={foodImg(order.restaurantPhoto, order.restaurantId + "-ord", 120, 120)} alt={order.restaurantName} className="absolute inset-0" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[13.5px] font-extrabold tracking-tight truncate">
              {arrived ? "Your phantom order arrived" : `Arriving in ${minsLeft} min`}
            </p>
            <p className="text-[12px] text-white/65 truncate">
              {arrived ? "Tap to collect your nothing" : `Echo is en route from ${order.restaurantName}`}
            </p>
          </div>
          <span className="shrink-0 w-9 h-9 rounded-full bg-white/12 grid place-items-center">
            <Bike size={18} className="text-white" />
          </span>
        </div>
        <div className="h-1 bg-white/12">
          <div
            className="h-full bg-[var(--color-green)] transition-[width] duration-700"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </button>
    </div>
  );
}
