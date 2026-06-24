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
export const X = (p: P) => (
  <S {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
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
export const HomeIcon = (p: P) => (
  <S {...p}>
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h14V10" />
    <path d="M10 20v-6h4v6" />
  </S>
);
export const Compass = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </S>
);
export const Trophy = (p: P) => (
  <S {...p}>
    <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
    <path d="M8 6H5a3 3 0 0 0 3 3M16 6h3a3 3 0 0 1-3 3" />
    <path d="M12 12v4M9 20h6M10 16h4" />
  </S>
);
export const Receipt = (p: P) => (
  <S {...p}>
    <path d="M7 3h10v18l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2V3Z" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </S>
);
export const User = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </S>
);
export const Tag = (p: P) => (
  <S {...p}>
    <path d="M20 13 13 20 4 11V4h7l9 9Z" />
    <circle cx="8.5" cy="8.5" r="1.5" />
  </S>
);
export const CreditCard = (p: P) => (
  <S {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18M7 15h4" />
  </S>
);
export const Shield = (p: P) => (
  <S {...p}>
    <path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
    <path d="m9 12 2 2 4-5" />
  </S>
);
export const Sliders = (p: P) => (
  <S {...p}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </S>
);
export const Phone = (p: P) => (
  <S {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9Z" />
  </S>
);
export const Message = (p: P) => (
  <S {...p}>
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
    <path d="M8 9h8M8 13h5" />
  </S>
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
