import { useMemo, useState } from "react";
import type { CartLine } from "../types";
import PrimaryButton from "./PrimaryButton";
import FoodImage from "./FoodImage";
import { foodImg } from "../lib/img";
import { feedback } from "../lib/feedback";
import { Bag, Check, ChevronDown, ChevronLeft, Clock, CreditCard, Minus, Pin, Plus, Shield, Tag } from "./icons";

const SERVICE_RATE = 0.12;
const TAX_RATE = 0.0875;
const DELIVERY_FEE = 3.49;
const PRIORITY_FEE = 2.99;
const TIP_OPTIONS = [0.12, 0.18, 0.22];

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCard(value: string) {
  return digits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string) {
  const d = digits(value).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

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
  const [tipRate, setTipRate] = useState(TIP_OPTIONS[1]);
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [touchedPayment, setTouchedPayment] = useState(false);

  const empty = cart.length === 0;
  const itemCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const etaMin = priority ? 11 : 18;
  const fees = useMemo(() => {
    const delivery = DELIVERY_FEE;
    const service = subtotal * SERVICE_RATE;
    const tax = subtotal * TAX_RATE;
    const priorityFee = priority ? PRIORITY_FEE : 0;
    const tip = subtotal * tipRate;
    const total = subtotal + delivery + service + tax + priorityFee + tip;
    return { delivery, service, tax, priorityFee, tip, total };
  }, [priority, subtotal, tipRate]);

  const cardDigits = digits(card);
  const paymentValid = cardDigits.length >= 12 && expiry.length === 5 && digits(cvc).length >= 3 && digits(zip).length >= 5;

  function submit() {
    setTouchedPayment(true);
    if (!paymentValid) {
      feedback.tap();
      return;
    }
    feedback.success();
    onPlace();
  }

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg)]">
      <div className="shrink-0 px-5 pt-2 pb-3 flex items-center gap-3 border-b border-[var(--color-line)]">
        <button onClick={onBack} aria-label="Go back" className="w-9 h-9 -ml-1 rounded-full grid place-items-center active:bg-[var(--color-soft)] transition">
          <ChevronLeft size={24} className="text-[var(--color-ink)]" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[18px] font-extrabold tracking-tight">Checkout</h1>
          {!empty && (
            <p className="text-[12px] text-[var(--color-ink-3)] tabular-nums">
              {itemCount} item{itemCount === 1 ? "" : "s"} / simulated authorization
            </p>
          )}
        </div>
        {!empty && <span className="rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-[12px] font-extrabold text-white">{money(fees.total)}</span>}
      </div>

      {empty ? (
        <div className="flex-1 grid place-items-center px-8 text-center">
          <div>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-soft)] grid place-items-center">
              <Bag size={28} className="text-[var(--color-ink-3)]" />
            </div>
            <p className="mt-4 text-[15px] font-semibold">Your cart is empty</p>
            <p className="text-[13.5px] text-[var(--color-ink-2)] mt-1">Add a craving before the fake payment theatre begins.</p>
            <PrimaryButton onClick={onBrowse} full={false} size="md" className="mt-5">
              Browse restaurants
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <DeliveryCard etaMin={etaMin} handoff={handoff} onHandoff={setHandoff} total={fees.total} />

            <div className="mt-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft">
              <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-extrabold tracking-tight">Order items</h2>
                  <p className="text-[12.5px] text-[var(--color-ink-3)]">Review the craving before authorization.</p>
                </div>
                <span className="text-[12px] font-extrabold text-[var(--color-ink-2)] tabular-nums">{money(subtotal)}</span>
              </div>
              <div className="px-4">
                {cart.map((line) => (
                  <CartLineRow key={line.lineId} line={line} onQty={onQty} />
                ))}
              </div>
            </div>

            <PriorityCard priority={priority} onToggle={() => setPriority((value) => !value)} />
            <TipCard tipRate={tipRate} onTip={setTipRate} tip={fees.tip} />
            <PromoCard promo={promo} onPromo={setPromo} />
            <PaymentCard
              card={card}
              expiry={expiry}
              cvc={cvc}
              zip={zip}
              saveCard={saveCard}
              touched={touchedPayment}
              valid={paymentValid}
              onCard={(value) => setCard(formatCard(value))}
              onExpiry={(value) => setExpiry(formatExpiry(value))}
              onCvc={(value) => setCvc(digits(value).slice(0, 4))}
              onZip={(value) => setZip(digits(value).slice(0, 5))}
              onSaveCard={setSaveCard}
            />
            <SummaryCard subtotal={subtotal} fees={fees} priority={priority} promo={promo} />
          </div>

          <div className="shrink-0 px-5 pb-6 pt-3 border-t border-[var(--color-line)] bg-[var(--color-bg)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[12px] text-[var(--color-ink-3)]">Authorization total</p>
                <p className="text-[22px] font-extrabold text-[var(--color-ink)] leading-none tabular-nums">{money(fees.total)}</p>
              </div>
              <p className="text-[12px] font-bold text-right text-[var(--color-ink-2)] max-w-[10.5rem]">
                Test card UI only. No bank, no processor, no real charge.
              </p>
            </div>
            <PrimaryButton onClick={submit}>
              <span className="flex items-center justify-between w-full gap-3">
                <span className="truncate">Authorize phantom payment</span>
                <span className="tabular-nums">{money(fees.total)}</span>
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
  total,
}: {
  etaMin: number;
  handoff: "door" | "meet";
  onHandoff: (value: "door" | "meet") => void;
  total: number;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--color-soft)] grid place-items-center">
          <Pin size={18} className="text-[var(--color-ink)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-extrabold tracking-tight">Deliver to Your couch</p>
          <p className="text-[12.5px] text-[var(--color-ink-2)] mt-0.5">Living room, blanket side, courier experience simulated.</p>
        </div>
        <ChevronDown size={17} className="text-[var(--color-ink-3)]" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <InfoTile icon={<Clock size={16} />} label={`${etaMin}-${etaMin + 6} min`} sub="Estimated arrival" />
        <InfoTile icon={<CreditCard size={16} />} label={money(total)} sub="Authorization" />
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
        <p className="text-[13.5px] font-semibold text-[var(--color-ink-2)] mt-0.5 tabular-nums">{money(line.unitPrice * line.qty)}</p>
      </div>
      <div className="flex items-center gap-1 border border-[var(--color-line-2)] rounded-full p-1 self-start">
        <button onClick={() => onQty(line.lineId, -1)} aria-label={`Decrease ${line.item.name}`} className="w-7 h-7 grid place-items-center rounded-full active:bg-[var(--color-soft)] transition">
          <Minus size={16} className="text-[var(--color-ink)]" />
        </button>
        <span className="w-5 text-center text-[14px] font-bold tabular-nums">{line.qty}</span>
        <button onClick={() => onQty(line.lineId, 1)} aria-label={`Increase ${line.item.name}`} className="w-7 h-7 grid place-items-center rounded-full bg-[var(--color-ink)] active:scale-90 transition">
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
        <p className="text-[14px] font-extrabold tracking-tight">Priority courier routing</p>
        <p className="text-[12.5px] text-[var(--color-ink-2)] mt-0.5">A realistic express fee for a simulated delivery lane.</p>
      </div>
      <span className="text-[13px] font-extrabold text-[var(--color-ink)]">{money(PRIORITY_FEE)}</span>
    </button>
  );
}

function TipCard({ tipRate, onTip, tip }: { tipRate: number; onTip: (value: number) => void; tip: number }) {
  return (
    <div className="mt-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[14px] font-extrabold tracking-tight">Courier tip</p>
          <p className="text-[12px] text-[var(--color-ink-2)] mt-0.5">The gratitude is imaginary, the UI hit is real.</p>
        </div>
        <span className="text-[13px] font-extrabold tabular-nums">{money(tip)}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {TIP_OPTIONS.map((rate) => (
          <button
            key={rate}
            onClick={() => onTip(rate)}
            className={`h-10 rounded-xl border text-[13px] font-extrabold transition ${
              tipRate === rate ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white" : "border-[var(--color-line-2)] bg-[var(--color-surface)] text-[var(--color-ink)]"
            }`}
          >
            {Math.round(rate * 100)}%
          </button>
        ))}
      </div>
    </div>
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
          placeholder="CRAVE20"
          className="min-w-0 flex-1 h-11 rounded-xl border border-[var(--color-line)] px-3.5 text-[13.5px] font-bold outline-none focus:border-[var(--color-ink)]"
        />
        <button className="h-11 px-4 rounded-xl bg-[var(--color-soft)] text-[13px] font-extrabold active:scale-95 transition">Apply</button>
      </div>
      <p className="mt-2 text-[12px] text-[var(--color-ink-3)]">Promo states are simulated; totals remain realistic for the ritual.</p>
    </div>
  );
}

function PaymentCard({
  card,
  expiry,
  cvc,
  zip,
  saveCard,
  touched,
  valid,
  onCard,
  onExpiry,
  onCvc,
  onZip,
  onSaveCard,
}: {
  card: string;
  expiry: string;
  cvc: string;
  zip: string;
  saveCard: boolean;
  touched: boolean;
  valid: boolean;
  onCard: (value: string) => void;
  onExpiry: (value: string) => void;
  onCvc: (value: string) => void;
  onZip: (value: string) => void;
  onSaveCard: (value: boolean) => void;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-extrabold tracking-tight">Payment method</p>
          <p className="text-[12.5px] text-[var(--color-ink-2)] mt-0.5">Enter any test-style card details. Nothing leaves this browser.</p>
        </div>
        <div className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${valid ? "bg-[var(--color-green)]/10 text-[var(--color-green-ink)]" : "bg-[var(--color-soft)] text-[var(--color-ink-2)]"}`}>
          {valid ? "Ready" : "Required"}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[var(--color-ink)] p-4 text-white shadow-lift">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-extrabold tracking-[0.16em] uppercase text-white/55">Phantom Card</span>
          <CreditCard size={22} />
        </div>
        <p className="mt-7 text-[21px] font-extrabold tracking-[0.16em] tabular-nums">{card || "4242 4242 4242 4242"}</p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-white/45">Cardholder</p>
            <p className="text-[12px] font-extrabold">PHANTOM DINER</p>
          </div>
          <p className="text-[12px] font-extrabold tabular-nums">{expiry || "12/30"}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <label className="text-[12px] font-extrabold text-[var(--color-ink-2)]">
          Card number
          <input
            value={card}
            onChange={(event) => onCard(event.target.value)}
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4242 4242 4242 4242"
            className="mt-1.5 h-11 w-full rounded-xl border border-[var(--color-line)] px-3.5 text-[14px] font-bold tabular-nums outline-none focus:border-[var(--color-ink)]"
          />
        </label>
        <div className="grid grid-cols-3 gap-2">
          <label className="text-[12px] font-extrabold text-[var(--color-ink-2)]">
            Expiry
            <input value={expiry} onChange={(event) => onExpiry(event.target.value)} inputMode="numeric" autoComplete="cc-exp" placeholder="12/30" className="mt-1.5 h-11 w-full rounded-xl border border-[var(--color-line)] px-3 text-[14px] font-bold tabular-nums outline-none focus:border-[var(--color-ink)]" />
          </label>
          <label className="text-[12px] font-extrabold text-[var(--color-ink-2)]">
            CVC
            <input value={cvc} onChange={(event) => onCvc(event.target.value)} inputMode="numeric" autoComplete="cc-csc" placeholder="123" className="mt-1.5 h-11 w-full rounded-xl border border-[var(--color-line)] px-3 text-[14px] font-bold tabular-nums outline-none focus:border-[var(--color-ink)]" />
          </label>
          <label className="text-[12px] font-extrabold text-[var(--color-ink-2)]">
            ZIP
            <input value={zip} onChange={(event) => onZip(event.target.value)} inputMode="numeric" autoComplete="postal-code" placeholder="10001" className="mt-1.5 h-11 w-full rounded-xl border border-[var(--color-line)] px-3 text-[14px] font-bold tabular-nums outline-none focus:border-[var(--color-ink)]" />
          </label>
        </div>
      </div>

      <button onClick={() => onSaveCard(!saveCard)} className="mt-3 flex w-full items-center justify-between rounded-xl bg-[var(--color-soft)] px-3.5 py-3 text-left active:scale-[0.99] transition">
        <span className="flex items-center gap-2.5">
          <span className={`grid h-5 w-5 place-items-center rounded-md border-2 ${saveCard ? "border-[var(--color-green)] bg-[var(--color-green)]" : "border-[var(--color-line-2)]"}`}>
            {saveCard && <Check size={13} className="text-white" />}
          </span>
          <span className="text-[13px] font-extrabold">Save this simulated card</span>
        </span>
        <Shield size={17} className="text-[var(--color-ink-2)]" />
      </button>
      {touched && !valid && <p className="mt-2 text-[12px] font-bold text-[var(--color-red)]">Add card number, expiry, CVC, and ZIP to continue.</p>}
    </div>
  );
}

function SummaryCard({
  subtotal,
  fees,
  priority,
  promo,
}: {
  subtotal: number;
  fees: { delivery: number; service: number; tax: number; priorityFee: number; tip: number; total: number };
  priority: boolean;
  promo: string;
}) {
  return (
    <div className="mt-4 card shadow-soft p-4 text-[14px]">
      <Row label="Subtotal" value={money(subtotal)} />
      <Row label="Delivery fee" value={money(fees.delivery)} />
      <Row label="Service fee" value={money(fees.service)} />
      <Row label="Estimated tax" value={money(fees.tax)} />
      <Row label="Courier tip" value={money(fees.tip)} />
      <Row label="Priority routing" value={priority ? money(fees.priorityFee) : "Not selected"} />
      <Row label="Promo" value={promo.trim() ? "Queued for simulation" : "Optional"} />
      <div className="divider my-3" />
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-[15px]">Authorization total</span>
        <span className="font-extrabold text-[18px] text-[var(--color-ink)] tabular-nums">{money(fees.total)}</span>
      </div>
      <p className="text-[12px] text-[var(--color-ink-2)] mt-2.5 leading-snug">
        This looks like a delivery checkout, but it is a local dopamine simulation. No card data is sent anywhere.
      </p>
    </div>
  );
}

function InfoTile({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-soft)] p-3 flex gap-2.5 items-center">
      <span className="text-[var(--color-ink)]">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[13px] font-extrabold tabular-nums truncate">{label}</span>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[var(--color-ink-2)]">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
