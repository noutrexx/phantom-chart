import { useCallback, useState } from "react";

// Rough fast-food estimate: ~62 kcal per $1 spent.
const KCAL_PER_DOLLAR = 62;
const KEY = "pc.savings";

export type Savings = {
  totalSaved: number;
  totalKcal: number;
  orders: number;
  streak: number;
  lastOrderDate: string | null; // YYYY-MM-DD
};

const EMPTY: Savings = { totalSaved: 0, totalKcal: 0, orders: 0, streak: 0, lastOrderDate: null };

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayDiff(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

function read(): Savings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

function write(s: Savings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function useSavings() {
  const [savings, setSavings] = useState<Savings>(read);

  const recordOrder = useCallback((amount: number) => {
    setSavings((prev) => {
      const today = todayStr();
      let streak = prev.streak;
      if (prev.lastOrderDate === today) {
        streak = prev.streak || 1;
      } else if (prev.lastOrderDate && dayDiff(prev.lastOrderDate, today) === 1) {
        streak = prev.streak + 1;
      } else {
        streak = 1;
      }
      const next: Savings = {
        totalSaved: prev.totalSaved + amount,
        totalKcal: prev.totalKcal + Math.round(amount * KCAL_PER_DOLLAR),
        orders: prev.orders + 1,
        streak,
        lastOrderDate: today,
      };
      write(next);
      return next;
    });
  }, []);

  // Streak is "alive" only if last order was today or yesterday.
  const liveStreak = (() => {
    if (!savings.lastOrderDate) return 0;
    const d = dayDiff(savings.lastOrderDate, todayStr());
    return d <= 1 ? savings.streak : 0;
  })();

  return { savings, liveStreak, recordOrder, kcalPerDollar: KCAL_PER_DOLLAR };
}
