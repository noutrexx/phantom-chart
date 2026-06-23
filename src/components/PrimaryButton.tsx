import type { ReactNode } from "react";

export default function PrimaryButton({
  children,
  onClick,
  full = true,
  size = "lg",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
  size?: "lg" | "md";
  className?: string;
}) {
  const pad = size === "lg" ? "py-4 text-[16px]" : "py-3 text-[14px]";
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl font-semibold text-[#1a0f08] bg-grad shadow-grad active:scale-[0.97] transition ${pad} ${
        full ? "w-full" : "px-6"
      } ${className}`}
    >
      {children}
    </button>
  );
}
