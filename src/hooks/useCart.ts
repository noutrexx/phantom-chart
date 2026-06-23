import { useMemo, useReducer } from "react";
import type { CartLine, MenuItem } from "../types";

type Action =
  | { type: "add"; item: MenuItem }
  | { type: "setQty"; id: string; delta: number }
  | { type: "clear" };

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "add": {
      const found = state.find((l) => l.item.id === action.item.id);
      if (found) {
        return state.map((l) =>
          l.item.id === action.item.id ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [...state, { item: action.item, qty: 1 }];
    }
    case "setQty":
      return state
        .map((l) => (l.item.id === action.id ? { ...l, qty: l.qty + action.delta } : l))
        .filter((l) => l.qty > 0);
    case "clear":
      return [];
    default:
      return state;
  }
}

export function useCart() {
  const [cart, dispatch] = useReducer(reducer, []);

  const { count, subtotal } = useMemo(
    () => ({
      count: cart.reduce((n, l) => n + l.qty, 0),
      subtotal: cart.reduce((s, l) => s + l.qty * l.item.price, 0),
    }),
    [cart]
  );

  return {
    cart,
    count,
    subtotal,
    addItem: (item: MenuItem) => dispatch({ type: "add", item }),
    setQty: (id: string, delta: number) => dispatch({ type: "setQty", id, delta }),
    clear: () => dispatch({ type: "clear" }),
  };
}
