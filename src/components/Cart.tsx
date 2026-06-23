import { useState } from "react";
import type { CartLine } from "../types";
import PrimaryButton from "./PrimaryButton";
import FoodImage from "./FoodImage";
import { foodImg } from "../lib/img";
import { feedback } from "../lib/feedback";
import { Bag, Check, ChevronDown, ChevronLeft, Clock, Minus, Pin, Plus, Tag } from "./icons";

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
  const [priority, setPriority] = useState(false);
  const [handoff, setHandoff] = useState<"door" | "meet">("door");
  const [promo, setPromo] = useState("");
  const empty = cart.length === 0;
  const itemCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const etaMin = priority ? 11 : 18;
  const almostSpent = subtotal + (priority ? 2.99 : 0);

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg)]">
      <div className="shrink-0 px-5 pt-2 pb-3 flex items-center gap-3 border-b border-[var(--color-line)]">
        <button onClick={onBack} className="w-9 h-9 -ml-1 rounded-full grid place-items-center active:bg-[var(--color-soft)] transition">
          <ChevronLeft size={24} className="text-[var(--color-ink)]" />
        </button>
        <div>
          <h1 className="text-[18px] font-extrabold tracking-tight">Your order</h1>
          {!empty && <p className="text-[12px] text-[var(--color-ink-3)] tabular-nums">{itemCount} item{itemCount === 1 ? "" : "s"} ready to not ship</p>}
        </div>
      </div>

      {empty ? (
        <div className="flex-1 grid place-items-center px-8 text-center">
          <div>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-soft)] grid place-items-center">
              <Bag size={28} className="text-[var(--color-ink-3)]" />
            </div>
            <p className="mt-4 text-[15px] font-semibold">Your cart is empty</p>
            <p className="text-[13.5px] text-[var(--color-ink-2)] mt-1">Which is kind of the whole point.</p>
            <PrimaryButton onClick={onBrowse} full={false} size="md" className="mt-5">
              Browse restaurants
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <DeliveryCard etaMin={etaMin} handoff={handoff} onHandoff={setHandoff} />

            <div className="mt-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft">
              <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-extrabold tracking-tight">Order items</h2>
                  <p className="text-[12.5px] text-[var(--color-ink-3)]">Edit the craving before it disappears.</p>
                </div>
                <span className="text-[12px] font-extrabold text-[var(--color-green-ink)]">No checkout risk</span>
              </div>
              <div className="px-4">
                {cart.map((line) => (
                  <CartLineRow key={line.lineId} line={line} onQty={onQty} />
                ))}
              </div>
            </div>

            <PriorityCard priority={priority} onToggle={() => setPriority((value) => !value)} />
            <PromoCard promo={promo} onPromo={setPromo} />
            <PaymentCard />
            <SavingsCard subtotal={subtotal} priority={priority} />
            <SummaryCard subtotal={subtotal} almostSpent={almostSpent} priority={priority} promo={promo} />
          </div>

          <div className="shrink-0 px-5 pb-6 pt-3 border-t border-[var(--color-line)] bg-[var(--color-bg)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[12px] text-[var(--color-ink-3)]">You will pay</p>
                <p className="text-[22px] font-extrabold text-[var(--color-green-ink)] leading-none">$0.00</p>
              </div>
              <p className="text-[12px] font-bold text-right text-[var(--color-ink-2)] max-w-[10rem]">
                Almost spent ${almostSpent.toFixed(2)}. Keep the win.
              </p>
            </div>
            <PrimaryButton
              onClick={() => {
                feedback.success();
                onPlace();
              }}
            >
              <span className="flex items-center justify-between w-full">
                <span>Place phantom order</span>
                <span className="tabular-nums">$0.00</span>
              </span>
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}

function DeliveryCard({
  etaMin,
  handoff,
  onHandoff,
}: {
  etaMin: number;
  handoff: "door" | "meet";
  onHandoff: (value: "door" | "meet") => void;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--color-soft)] grid place-items-center">
          <Pin size={18} className="text-[var(--color-ink)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-extrabold tracking-tight">Deliver to Your couch</p>
          <p className="text-[12.5px] text-[var(--color-ink-2)] mt-0.5">Living room, blanket side, no real courier required</p>
        </div>
        <ChevronDown size={17} className="text-[var(--color-ink-3)]" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <InfoTile icon={<Clock size={16} />} label={`${etaMin}-${etaMin + 6} min`} sub="Estimated arrival" />
        <InfoTile icon={<Check size={16} />} label="$0.00" sub="Due today" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <ChoiceButton active={handoff === "door"} label="Leave at door" onClick={() => onHandoff("door")} />
        <ChoiceButton active={handoff === "meet"} label="Meet outside" onClick={() => onHandoff("meet")} />
      </div>
    </div>
  );
}

function CartLineRow({ line, onQty }: { line: CartLine; onQty: (id: string, delta: number) => void }) {
  return (
    <div className="flex items-center gap-3 py-3 border-t border-[var(--color-line)] first:border-t-0">
      <FoodImage src={foodImg(line.item.photo, line.item.id, 140, 140)} alt={line.item.name} className="w-14 h-14 rounded-xl shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="text-[14.5px] font-bold tracking-tight truncate">{line.item.name}</h4>
        {line.selections && line.selections.length > 0 && (
          <p className="text-[12px] text-[var(--color-ink-3)] mt-0.5 truncate">{line.selections.join(", ")}</p>
        )}
        {line.note && <p className="text-[12px] text-[var(--color-ink-3)] italic truncate">"{line.note}"</p>}
        <p className="text-[13.5px] font-semibold text-[var(--color-ink-2)] mt-0.5 tabular-nums">${(line.unitPrice * line.qty).toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-1 border border-[var(--color-line-2)] rounded-full p-1 self-start">
        <button onClick={() => onQty(line.lineId, -1)} className="w-7 h-7 grid place-items-center rounded-full active:bg-[var(--color-soft)] transition">
          <Minus size={16} className="text-[var(--color-ink)]" />
        </button>
        <span className="w-5 text-center text-[14px] font-bold tabular-nums">{line.qty}</span>
        <button onClick={() => onQty(line.lineId, 1)} className="w-7 h-7 grid place-items-center rounded-full bg-[var(--color-ink)] active:scale-90 transition">
          <Plus size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}

function PriorityCard({ priority, onToggle }: { priority: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="mt-4 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft p-4 text-left flex items-center gap-3 active:scale-[0.99] transition">
      <div className={`w-12 h-7 rounded-full p-1 transition ${priority ? "bg-[var(--color-green)]" : "bg-[var(--color-line-2)]"}`}>
        <span className={`block w-5 h-5 rounded-full bg-white transition ${priority ? "translate-x-5" : "translate-x-0"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-extrabold tracking-tight">Priority phantom delivery</p>
        <p className="text-[12.5px] text-[var(--color-ink-2)] mt-0.5">Looks faster, costs nothing, still sends nothing.</p>
      </div>
      <span className="text-[13px] font-extrabold text-[var(--color-green-ink)]">$0.00</span>
    </button>
  );
}

function PromoCard({ promo, onPromo }: { promo: string; onPromo: (value: string) => void }) {
  return (
    <div className="mt-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft p-4">
      <div className="flex items-center gap-2">
        <Tag size={18} className="text-[var(--color-ink)]" />
        <p className="text-[14px] font-extrabold tracking-tight">Promo code</p>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={promo}
          onChange={(event) => onPromo(event.target.value)}
          placeholder="TRY ZERO"
          className="min-w-0 flex-1 h-11 rounded-xl border border-[var(--color-line)] px-3.5 text-[13.5px] font-bold outline-none focus:border-[var(--color-ink)]"
        />
        <button className="h-11 px-4 rounded-xl bg-[var(--color-soft)] text-[13px] font-extrabold active:scale-95 transition">Apply</button>
      </div>
      <p className="mt-2 text-[12px] text-[var(--color-ink-3)]">Every code works emotionally. The total stays $0.</p>
    </div>
  );
}

function PaymentCard() {
  return (
    <div className="mt-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[var(--color-ink)] text-white grid place-items-center text-[14px] font-extrabold">$0</div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-extrabold tracking-tight">No card needed</p>
        <p className="text-[12.5px] text-[var(--color-ink-2)] mt-0.5">Phantom Pay declines the purchase before your bank can.</p>
      </div>
      <Check size={18} className="text-[var(--color-green-ink)]" />
    </div>
  );
}

function SavingsCard({ subtotal, priority }: { subtotal: number; priority: boolean }) {
  const saved = subtotal + (priority ? 2.99 : 0);
  return (
    <div className="mt-4 rounded-xl bg-[var(--color-green)] text-white p-4 shadow-lift">
      <p className="text-[12.5px] font-bold text-white/76">You are about to save</p>
      <p className="mt-1 text-[34px] font-extrabold leading-none tabular-nums">${saved.toFixed(2)}</p>
      <p className="mt-2 text-[13px] text-white/82 leading-snug">This is the dopamine receipt: full cart ritual, zero actual spend.</p>
    </div>
  );
}

function SummaryCard({
  subtotal,
  almostSpent,
  priority,
  promo,
}: {
  subtotal: number;
  almostSpent: number;
  priority: boolean;
  promo: string;
}) {
  return (
    <div className="mt-4 card shadow-soft p-4 text-[14px]">
      <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
      <Row label="Priority delivery" value={priority ? "$0.00" : "Not selected"} green={priority} />
      <Row label="Delivery fee" value="$0.00" green />
      <Row label="Service fee" value="$0.00" green />
      <Row label="Taxes" value="$0.00" green />
      <Row label="Promo" value={promo.trim() ? "Emotionally applied" : "Optional"} green={Boolean(promo.trim())} />
      <div className="divider my-3" />
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-[15px]">Total</span>
        <span className="font-extrabold text-[18px] text-[var(--color-green-ink)] tabular-nums">$0.00</span>
      </div>
      <p className="text-[12px] text-[var(--color-ink-2)] mt-2.5 leading-snug">
        No card required. No order is placed. You almost spent ${almostSpent.toFixed(2)}, then did not.
      </p>
    </div>
  );
}

function InfoTile({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-soft)] p-3 flex gap-2.5 items-center">
      <span className="text-[var(--color-ink)]">{icon}</span>
      <span>
        <span className="block text-[13px] font-extrabold tabular-nums">{label}</span>
        <span className="block text-[11.5px] text-[var(--color-ink-3)]">{sub}</span>
      </span>
    </div>
  );
}

function ChoiceButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`h-10 rounded-xl border text-[13px] font-extrabold transition ${
        active ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white" : "border-[var(--color-line-2)] bg-[var(--color-surface)] text-[var(--color-ink)]"
      }`}
    >
      {label}
    </button>
  );
}

function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[var(--color-ink-2)]">{label}</span>
      <span className={green ? "text-[var(--color-green-ink)] font-semibold tabular-nums" : "tabular-nums"}>{value}</span>
    </div>
  );
}
