import { useMemo, useState } from "react";
import type { OrderOutcome, Restaurant, Screen } from "./types";
import { RESTAURANTS } from "./data";
import { useCart } from "./hooks/useCart";
import { useSavings } from "./hooks/useSavings";
import { useOrders } from "./hooks/useOrders";
import StatusBar from "./components/StatusBar";
import Splash from "./components/Splash";
import Home from "./components/Home";
import RestaurantView from "./components/RestaurantView";
import Cart from "./components/Cart";
import Tracking from "./components/Tracking";
import ActiveOrderBanner from "./components/ActiveOrderBanner";

function pickOutcome(): OrderOutcome {
  const r = Math.random();
  if (r < 0.4) return "normal";
  if (r < 0.6) return "early";
  if (r < 0.8) return "lost";
  return "gift";
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const { cart, count, subtotal, addItem, addLine, setQty, clear } = useCart();
  const { savings, liveStreak, recordOrder } = useSavings();
  const { activeOrder, placeOrder: recordOrderHistory, markDelivered, getOrder } = useOrders();

  const active: Restaurant | null = useMemo(
    () => RESTAURANTS.find((r) => r.id === activeId) ?? null,
    [activeId]
  );

  const trackingOrder = getOrder(trackingOrderId);
  const trackingRestaurant = trackingOrder ? RESTAURANTS.find((r) => r.id === trackingOrder.restaurantId) ?? null : null;

  function openRestaurant(id: string) {
    setActiveId(id);
    setScreen("restaurant");
  }

  function placeOrder() {
    if (!active) return;
    const order = recordOrderHistory({
      restaurantId: active.id,
      restaurantName: active.name,
      restaurantPhoto: active.photo,
      items: cart.map((l) => ({
        id: l.item.id,
        name: l.item.name,
        photo: l.item.photo,
        qty: l.qty,
        unitPrice: l.unitPrice,
        selections: l.selections,
      })),
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

  const darkBar = screen === "splash";

  return (
    <div className="stage">
      <div className="phone no-tap">
        <StatusBar dark={darkBar} />
        <div className="flex-1 min-h-0 relative">
          {screen === "splash" && <Splash onEnter={() => setScreen("home")} />}

          {screen === "home" && (
            <Home
              savings={savings}
              liveStreak={liveStreak}
              onOpen={openRestaurant}
              cartCount={count}
              subtotal={subtotal}
              onCart={() => setScreen("cart")}
            />
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

          {screen === "home" && activeOrder && (
            <ActiveOrderBanner order={activeOrder} onOpen={openActiveOrder} />
          )}
        </div>
      </div>
    </div>
  );
}
