import type { CartLine } from "../types";
import PrimaryButton from "./PrimaryButton";
import { feedback } from "../lib/feedback";

export default function Cart({
  cart,
  subtotal,
  onBack,
  onQty,
  onPlace,
  onBrowse,
}: {
  cart: CartLine[];
  subtotal: number;
  onBack: () => void;
  onQty: (id: string, delta: number) => void;
  onPlace: () => void;
  onBrowse: () => void;
}) {
  const empty = cart.length === 0;

  return (
    <div className="h-[100dvh] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3 border-b border-[var(--color-line)]">
        <button onClick={onBack} className="w-10 h-10 rounded-full grid place-items-center bg-[var(--color-ink-3)] text-[18px] active:scale-90 transition">
          ‹
        </button>
        <h2 className="text-[19px] font-semibold">Your phantom cart</h2>
      </div>

      {empty ? (
        <div className="flex-1 grid place-items-center px-8 text-center">
          <div>
            <div className="text-[64px] floaty">🛒</div>
            <p className="mt-4 text-[15px] text-[var(--color-muted)]">Nothing here yet — which is kind of the point.</p>
            <PrimaryButton onClick={onBrowse} full={false} size="md" className="mt-6">
              Go browse
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex flex-col gap-3">
              {cart.map((l) => (
                <div key={l.item.id} className="flex items-center gap-3 rounded-2xl bg-[var(--color-ink-2)] border border-[var(--color-line)] p-3">
                  <div className="w-12 h-12 shrink-0 rounded-xl grid place-items-center text-[26px] bg-[var(--color-ink-3)]">{l.item.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-semibold truncate">{l.item.name}</h4>
                    <p className="text-[13px] text-[var(--color-amber)] font-semibold mt-0.5">${(l.item.price * l.qty).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-[var(--color-ink-3)] rounded-full p-1">
                    <button onClick={() => onQty(l.item.id, -1)} className="w-7 h-7 grid place-items-center rounded-full text-[18px] active:scale-90 transition">−</button>
                    <span className="w-5 text-center text-[14px] font-semibold">{l.qty}</span>
                    <button onClick={() => onQty(l.item.id, 1)} className="w-7 h-7 grid place-items-center rounded-full text-[16px] text-[#1a0f08] bg-grad">+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 rounded-2xl bg-[var(--color-ink-2)] border border-[var(--color-line)] p-4 text-[13.5px]">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Delivery fee" value="$0.00" hint="always" mint />
              <Row label="Service fee" value="$0.00" mint />
              <Row label="Taxes" value="$0.00" mint />
              <div className="h-px bg-[var(--color-line)] my-3" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[15px]">You will pay</span>
                <span className="font-semibold text-[18px] text-[var(--color-mint)]">$0.00</span>
              </div>
              <p className="text-[11.5px] text-[var(--color-muted)] mt-2">No card needed. No order placed. The cart was the meal.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 pb-7 pt-3 border-t border-[var(--color-line)] glass">
            <PrimaryButton
              onClick={() => {
                feedback.success();
                onPlace();
              }}
            >
              Place phantom order →
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value, hint, mint }: { label: string; value: string; hint?: string; mint?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[var(--color-muted)]">
        {label}
        {hint && <span className="ml-1 text-[11px] opacity-70">({hint})</span>}
      </span>
      <span className={mint ? "text-[var(--color-mint)] font-medium" : ""}>{value}</span>
    </div>
  );
}
