// Faux iOS status bar for a native-app feel.
export default function StatusBar({ dark = false }: { dark?: boolean }) {
  const color = dark ? "#ffffff" : "#0b0b0c";
  return (
    <div
      className="shrink-0 h-11 px-6 flex items-center justify-between text-[15px] font-semibold select-none"
      style={{ color }}
    >
      <span className="tabular-nums tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill={color}>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* wifi */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill={color}>
          <path d="M8.5 2C5.6 2 2.9 3.1.9 5l1.5 1.5C4 5 6.1 4 8.5 4s4.5 1 6.1 2.5L16.1 5C14.1 3.1 11.4 2 8.5 2Z" />
          <path d="M8.5 6.5c-1.5 0-2.9.6-3.9 1.6l1.5 1.5c.6-.6 1.5-1 2.4-1s1.8.4 2.4 1l1.5-1.5c-1-1-2.4-1.6-3.9-1.6Z" />
          <circle cx="8.5" cy="11" r="1.2" />
        </svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke={color} opacity="0.4" />
          <rect x="2" y="2" width="16" height="8" rx="1.6" fill={color} />
          <rect x="23" y="3.5" width="2" height="5" rx="1" fill={color} opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
