import { useMemo, useReducer } from "react";
import type { CartLine, MenuItem } from "../types";

type Action =
  | { type: "addLine"; line: CartLine }
  | { type: "setQty"; lineId: string; delta: number }
  | { type: "clear" };

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "addLine": {
      const found = state.find((l) => l.lineId === action.line.lineId);
      if (found) {
        return state.map((l) =>
          l.lineId === action.line.lineId ? { ...l, qty: l.qty + action.line.qty } : l
        );
      }
      return [...state, action.line];
    }
    case "setQty":
      return state
        .map((l) => (l.lineId === action.lineId ? { ...l, qty: l.qty + action.delta } : l))
        .filter((l) => l.qty > 0);
    case "clear":
      return [];
    default:
      return state;
  }
}

function baseLine(item: MenuItem): CartLine {
  return { lineId: item.id, item, qty: 1, unitPrice: item.price };
}

export function useCart() {
  const [cart, dispatch] = useReducer(reducer, []);

  const { count, subtotal } = useMemo(
    () => ({
      count: cart.reduce((n, l) => n + l.qty, 0),
      subtotal: cart.reduce((s, l) => s + l.qty * l.unitPrice, 0),
    }),
    [cart]
  );

  return {
    cart,
    count,
    subtotal,
    // Quick add: plain item at base price (no options).
    addItem: (item: MenuItem) => dispatch({ type: "addLine", line: baseLine(item) }),
    // Add a fully-configured line (with chosen options / note).
    addLine: (line: CartLine) => dispatch({ type: "addLine", line }),
    setQty: (lineId: string, delta: number) => dispatch({ type: "setQty", lineId, delta }),
    clear: () => dispatch({ type: "clear" }),
  };
}
