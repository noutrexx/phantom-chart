import { HomeIcon, Receipt, Trophy, User } from "./icons";

export type Tab = "home" | "orders" | "rewards" | "account";

const ITEMS: { key: Tab; label: string; icon: typeof HomeIcon }[] = [
  { key: "home", label: "Home", icon: HomeIcon },
  { key: "orders", label: "Orders", icon: Receipt },
  { key: "rewards", label: "Rewards", icon: Trophy },
  { key: "account", label: "Account", icon: User },
];

export default function BottomNav({
  tab,
  onTab,
  badge,
}: {
  tab: Tab;
  onTab: (t: Tab) => void;
  badge?: number;
}) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-[430px] px-4 pb-3 pt-2 pointer-events-none">
      <div className="grid grid-cols-4 rounded-[18px] border border-[var(--color-line)] bg-[var(--color-bg)]/96 shadow-lift backdrop-blur pointer-events-auto">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTab(item.key)}
              className={`relative h-14 flex flex-col items-center justify-center gap-0.5 active:scale-95 transition ${
                active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-3)]"
              }`}
            >
              {active && <span className="absolute top-1.5 h-1 w-5 rounded-full bg-[var(--color-ink)]" />}
              <Icon size={18} stroke={active ? 2.4 : 2} />
              <span className="text-[10.5px] font-bold">{item.label}</span>
              {item.key === "orders" && badge ? (
                <span className="absolute top-1 right-[22%] bg-[var(--color-green)] text-white text-[9px] font-bold rounded-full w-4 h-4 grid place-items-center tabular-nums">
                  {badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
