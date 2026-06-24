import type { Restaurant } from "../types";
import type { Savings } from "../hooks/useSavings";
import { foodImg } from "../lib/img";
import FoodImage from "./FoodImage";
import { Heart, Star, VolumeOff, VolumeOn } from "./icons";
import { RESTAURANTS } from "../data";

export default function Account({
  savings,
  liveStreak,
  favorites,
  onOpen,
  onToggleFavorite,
  muted,
  onToggleMute,
}: {
  savings: Savings;
  liveStreak: number;
  favorites: Restaurant[];
  onOpen: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  muted: boolean;
  onToggleMute: () => void;
}) {
  return (
    <div className="h-full overflow-y-auto pb-24 bg-[var(--color-bg)]">
      <div className="px-5 pt-3 pb-2">
        <h1 className="text-[24px] font-extrabold tracking-tight">Account</h1>
      </div>

      <div className="px-5">
        <div className="relative overflow-hidden rounded-[18px] bg-[var(--color-ink)] p-4 text-white shadow-lift">
          <div className="absolute right-0 top-0 h-full w-32 opacity-35">
            <FoodImage src={foodImg(RESTAURANTS[0].photo, "account-cover", 260, 220)} alt="Saved food" className="h-full w-full" gradient={RESTAURANTS[0].gradient} />
          </div>
          <div className="relative flex items-center gap-3">
            <div className="w-14 h-14 rounded-full grid place-items-center text-[20px] font-extrabold text-[var(--color-ink)] bg-white">
              PC
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-extrabold tracking-tight">Phantom Diner</p>
              <p className="text-[12.5px] text-white/68">Member since the first craving</p>
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-3 gap-2">
            <MiniStat value={`$${savings.totalSaved.toFixed(0)}`} label="saved" />
            <MiniStat value={String(savings.orders)} label="orders" />
            <MiniStat value={`${liveStreak}x`} label="streak" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-3 grid grid-cols-2 gap-2">
        <StatCard value={`$${savings.totalSaved.toFixed(2)}`} label="Total saved" />
        <StatCard value={savings.totalKcal.toLocaleString("en-US")} label="kcal avoided" />
        <StatCard value={String(savings.orders)} label="Phantom orders" />
        <StatCard value={`${liveStreak}x`} label="Night streak" />
      </div>

      <div className="px-5 mt-5">
        <h2 className="text-[16px] font-extrabold tracking-tight mb-2">Saved places</h2>
        {favorites.length === 0 ? (
          <div className="card overflow-hidden text-center shadow-soft">
            <div className="grid grid-cols-3 gap-1 p-1">
              {RESTAURANTS.slice(0, 3).map((restaurant) => (
                <FoodImage key={restaurant.id} src={foodImg(restaurant.photo, `${restaurant.id}-empty-fav`, 160, 120)} alt={restaurant.name} className="h-20 rounded-xl" gradient={restaurant.gradient} />
              ))}
            </div>
            <div className="p-5 pt-3">
              <Heart size={26} className="mx-auto text-[var(--color-ink-3)]" />
              <p className="mt-2 text-[13.5px] font-semibold">No saved places yet</p>
              <p className="text-[12.5px] text-[var(--color-ink-2)] mt-0.5">Tap the heart on any restaurant to save it.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {favorites.map((r) => (
              <div key={r.id} className="flex items-center gap-3 card shadow-soft p-2.5">
                <button onClick={() => onOpen(r.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left active:opacity-90 transition">
                  <FoodImage src={foodImg(r.photo, r.id + "-fav", 140, 140)} alt={r.name} className="w-14 h-14 rounded-xl shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-extrabold tracking-tight truncate">{r.name}</p>
                    <p className="text-[12.5px] text-[var(--color-ink-2)] truncate">{r.category} / {r.priceLevel}</p>
                    <p className="text-[12px] text-[var(--color-ink-3)] flex items-center gap-1">
                      <Star size={11} className="text-[var(--color-amber)]" /> {r.rating} / {r.etaMin} min
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => onToggleFavorite(r.id)}
                  aria-label="Remove favorite"
                  className="w-9 h-9 rounded-full grid place-items-center bg-[var(--color-soft)] active:scale-90 transition shrink-0"
                >
                  <Heart size={18} className="text-[var(--color-red)] fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 mt-5">
        <h2 className="text-[16px] font-extrabold tracking-tight mb-2">Settings</h2>
        <button onClick={onToggleMute} className="w-full card shadow-soft p-4 flex items-center justify-between active:scale-[0.99] transition">
          <span className="text-[14px] font-bold">Sound & haptics</span>
          <span className="flex items-center gap-2 text-[13px] font-extrabold text-[var(--color-ink-2)]">
            {muted ? "Off" : "On"} {muted ? <VolumeOff size={18} /> : <VolumeOn size={18} />}
          </span>
        </button>
        <p className="text-[12px] text-[var(--color-ink-3)] mt-3 text-center leading-snug">
          Phantom Eats is a simulation. Card fields are local UI only; no real orders, payment processing, or accounts.
        </p>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="card shadow-soft p-3.5">
      <p className="text-[20px] font-extrabold tabular-nums leading-none">{value}</p>
      <p className="text-[11.5px] text-[var(--color-ink-3)] mt-1">{label}</p>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-2.5 py-2">
      <p className="text-[15px] font-extrabold tabular-nums leading-none">{value}</p>
      <p className="text-[10px] text-white/58 font-bold mt-1">{label}</p>
    </div>
  );
}
