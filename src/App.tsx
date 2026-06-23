import { useMemo, useState } from "react";
import type { Restaurant, Screen } from "./types";
import { RESTAURANTS } from "./data";
import { useCart } from "./hooks/useCart";
import { useSavings } from "./hooks/useSavings";
import StatusBar from "./components/StatusBar";
import Splash from "./components/Splash";
import Home from "./components/Home";
import RestaurantView from "./components/RestaurantView";
import Cart from "./components/Cart";
import Tracking from "./components/Tracking";

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [activeId, setActiveId] = useState<string | null>(null);
  const { cart, count, subtotal, addItem, setQty, clear } = useCart();
  const { savings, liveStreak, recordOrder } = useSavings();
  const [lastSaved, setLastSaved] = useState(0);

  const active: Restaurant | null = useMemo(
    () => RESTAURANTS.find((r) => r.id === activeId) ?? null,
    [activeId]
  );

  function openRestaurant(id: string) {
    setActiveId(id);
    setScreen("restaurant");
  }

  function placeOrder() {
    setLastSaved(subtotal);
    recordOrder(subtotal);
    setScreen("tracking");
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

          {screen === "tracking" && active && (
            <Tracking
              restaurant={active}
              saved={lastSaved}
              savings={savings}
              liveStreak={liveStreak}
              onAgain={() => {
                clear();
                setScreen("home");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
