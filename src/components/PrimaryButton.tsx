import type { ReactNode } from "react";

export default function PrimaryButton({
  children,
  onClick,
  full = true,
  size = "lg",
  variant = "dark",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
  size?: "lg" | "md";
  variant?: "dark" | "green";
  className?: string;
}) {
  const pad = size === "lg" ? "py-[15px] text-[16px]" : "py-3 text-[14px]";
  const look =
    variant === "green"
      ? "bg-[var(--color-green)] text-white"
      : "bg-[var(--color-ink)] text-white";
  return (
    <button
      onClick={onClick}
      className={`rounded-[14px] font-bold tracking-tight active:scale-[0.98] transition shadow-soft ${look} ${pad} ${
        full ? "w-full px-5" : "px-6"
      } ${className}`}
    >
      {children}
    </button>
  );
}
