import { useMemo, useState } from "react";
import type { Order, OrderOutcome, Restaurant, Screen } from "./types";
import { RESTAURANTS } from "./data";
import { useCart } from "./hooks/useCart";
import { useSavings } from "./hooks/useSavings";
import { useOrders } from "./hooks/useOrders";
import { useFavorites } from "./hooks/useFavorites";
import { feedback, isMuted, setMuted } from "./lib/feedback";
import StatusBar from "./components/StatusBar";
import Splash from "./components/Splash";
import Home from "./components/Home";
import RestaurantView from "./components/RestaurantView";
import Cart from "./components/Cart";
import Tracking from "./components/Tracking";
import ActiveOrderBanner from "./components/ActiveOrderBanner";
import BottomNav, { type Tab } from "./components/BottomNav";
import Orders from "./components/Orders";
import Rewards from "./components/Rewards";
import Account from "./components/Account";

function pickOutcome(): OrderOutcome {
  const r = Math.random();
  if (r < 0.4) return "normal";
  if (r < 0.6) return "early";
  if (r < 0.8) return "lost";
  return "gift";
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [tab, setTab] = useState<Tab>("home");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [muted, setMutedState] = useState(isMuted());

  const { cart, count, subtotal, addItem, addLine, setQty, clear } = useCart();
  const { savings, liveStreak, recordOrder } = useSavings();
  const { orders, activeOrder, placeOrder: recordOrderHistory, markDelivered, getOrder } = useOrders();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const active: Restaurant | null = useMemo(() => RESTAURANTS.find((r) => r.id === activeId) ?? null, [activeId]);
  const favoriteRestaurants = useMemo(
    () => favorites.map((id) => RESTAURANTS.find((r) => r.id === id)).filter((r): r is Restaurant => Boolean(r)),
    [favorites]
  );

  const trackingOrder = getOrder(trackingOrderId);
  const trackingRestaurant = trackingOrder ? RESTAURANTS.find((r) => r.id === trackingOrder.restaurantId) ?? null : null;

  function openRestaurant(id: string) {
    setActiveId(id);
    setScreen("restaurant");
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) feedback.tap();
  }

  function placeOrder() {
    if (!active) return;
    const order = recordOrderHistory({
      restaurantId: active.id,
      restaurantName: active.name,
      restaurantPhoto: active.photo,
      items: cart.map((l) => ({ id: l.item.id, name: l.item.name, photo: l.item.photo, qty: l.qty, unitPrice: l.unitPrice, selections: l.selections })),
      subtotal,
      etaMin: active.etaMin,
      outcome: pickOutcome(),
    });
    recordOrder(subtotal);
    clear();
    setTrackingOrderId(order.id);
    setScreen("tracking");
  }

  function openActiveOrder() {
    if (activeOrder) {
      setTrackingOrderId(activeOrder.id);
      setScreen("tracking");
    }
  }

  function reorder(order: Order) {
    const restaurant = RESTAURANTS.find((r) => r.id === order.restaurantId);
    order.items.forEach((oi) => {
      const item = restaurant?.sections.flatMap((s) => s.items).find((i) => i.id === oi.id);
      if (item) {
        addLine({
          lineId: `${oi.id}#reorder#${(oi.selections ?? []).join("+")}`,
          item,
          qty: oi.qty,
          unitPrice: oi.unitPrice,
          selections: oi.selections,
        });
      }
    });
    setActiveId(order.restaurantId);
    setScreen("cart");
  }

  const darkBar = screen === "splash";
  const showShell = screen === "home";

  return (
    <div className="stage">
      <div className="phone no-tap">
        <StatusBar dark={darkBar} />
        <div className="flex-1 min-h-0 relative">
          {screen === "splash" && <Splash onEnter={() => setScreen("home")} />}

          {showShell && (
            <>
              {tab === "home" && (
                <Home
                  savings={savings}
                  liveStreak={liveStreak}
                  onOpen={openRestaurant}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  cartCount={count}
                  subtotal={subtotal}
                  onCart={() => setScreen("cart")}
                />
              )}
              {tab === "orders" && (
                <Orders orders={orders} onReorder={reorder} onOpenActive={(o) => { setTrackingOrderId(o.id); setScreen("tracking"); }} />
              )}
              {tab === "rewards" && <Rewards savings={savings} liveStreak={liveStreak} />}
              {tab === "account" && (
                <Account
                  savings={savings}
                  liveStreak={liveStreak}
                  favorites={favoriteRestaurants}
                  onOpen={openRestaurant}
                  onToggleFavorite={toggleFavorite}
                  muted={muted}
                  onToggleMute={toggleMute}
                />
              )}

              {tab === "home" && activeOrder && <ActiveOrderBanner order={activeOrder} onOpen={openActiveOrder} />}
              <BottomNav tab={tab} onTab={setTab} badge={activeOrder ? 1 : undefined} />
            </>
          )}

          {screen === "restaurant" && active && (
            <RestaurantView
              restaurant={active}
              cart={cart}
              cartCount={count}
              subtotal={subtotal}
              onBack={() => setScreen("home")}
              onAdd={addItem}
              onAddLine={addLine}
              onCart={() => setScreen("cart")}
              favorite={isFavorite(active.id)}
              onToggleFavorite={() => toggleFavorite(active.id)}
            />
          )}

          {screen === "cart" && (
            <Cart
              cart={cart}
              subtotal={subtotal}
              onBack={() => setScreen(active ? "restaurant" : "home")}
              onQty={setQty}
              onPlace={placeOrder}
              onBrowse={() => setScreen("home")}
            />
          )}

          {screen === "tracking" && trackingOrder && trackingRestaurant && (
            <Tracking
              order={trackingOrder}
              restaurant={trackingRestaurant}
              savings={savings}
              liveStreak={liveStreak}
              onMinimize={() => setScreen("home")}
              onDelivered={() => markDelivered(trackingOrder.id)}
              onAgain={() => setScreen("home")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
