import { useCallback, useState } from "react";
import type { Order } from "../types";

const KEY = "pc.orders";

function read(): Order[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}
function write(orders: Order[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(orders));
  } catch {
    /* ignore */
  }
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(read);

  const activeOrder = orders.find((o) => o.status === "active") ?? null;

  const placeOrder = useCallback((input: Omit<Order, "id" | "placedAt" | "status">) => {
    const order: Order = {
      ...input,
      id: `o${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`,
      placedAt: Date.now(),
      status: "active",
    };
    setOrders((prev) => {
      // only one active order at a time; retire any previous active
      const retired = prev.map((o) => (o.status === "active" ? { ...o, status: "delivered" as const } : o));
      const next = [order, ...retired].slice(0, 40);
      write(next);
      return next;
    });
    return order;
  }, []);

  const markDelivered = useCallback((id: string) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, status: "delivered" as const } : o));
      write(next);
      return next;
    });
  }, []);

  const getOrder = useCallback((id: string | null) => orders.find((o) => o.id === id) ?? null, [orders]);

  return { orders, activeOrder, placeOrder, markDelivered, getOrder };
}
