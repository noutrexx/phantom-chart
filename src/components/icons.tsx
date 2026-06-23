import type { ReactNode } from "react";

type P = { className?: string; size?: number; stroke?: number };

function S({ children, size = 20, stroke = 2, className }: P & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export const Search = (p: P) => (
  <S {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3-3" />
  </S>
);
export const Pin = (p: P) => (
  <S {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="2.6" />
  </S>
);
export const Star = ({ className, size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.5l2.95 6.02 6.64.97-4.8 4.68 1.13 6.61L12 17.67l-5.94 3.11 1.13-6.61-4.8-4.68 6.64-.97z" />
  </svg>
);
export const Clock = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </S>
);
export const ChevronLeft = (p: P) => (
  <S {...p}>
    <path d="m15 18-6-6 6-6" />
  </S>
);
export const ChevronDown = (p: P) => (
  <S {...p}>
    <path d="m6 9 6 6 6-6" />
  </S>
);
export const Plus = (p: P) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);
export const Minus = (p: P) => (
  <S {...p}>
    <path d="M5 12h14" />
  </S>
);
export const Bag = (p: P) => (
  <S {...p}>
    <path d="M6 8h12l-1 12H7L6 8Z" />
    <path d="M9 8a3 3 0 0 1 6 0" />
  </S>
);
export const VolumeOn = (p: P) => (
  <S {...p}>
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    <path d="M16 9a4 4 0 0 1 0 6" />
  </S>
);
export const VolumeOff = (p: P) => (
  <S {...p}>
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    <path d="m17 9 4 6m0-6-4 6" />
  </S>
);
export const Heart = ({ className, size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 20s-7-4.35-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.65 12 20 12 20Z" />
  </svg>
);
export const Check = (p: P) => (
  <S {...p}>
    <path d="m5 12 5 5L20 7" />
  </S>
);
export const Bike = (p: P) => (
  <S {...p}>
    <circle cx="6" cy="17" r="3" />
    <circle cx="18" cy="17" r="3" />
    <path d="M6 17 10 7h3l3 6m-9 4h9" />
  </S>
);
