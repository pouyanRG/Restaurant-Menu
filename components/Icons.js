const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

export const PinIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.4" />
  </svg>
);
export const BellIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}>
    <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.6 2H4.4z" />
    <path d="M10 21a2.2 2.2 0 0 0 4 0" />
  </svg>
);
export const SearchIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}>
    <circle cx="11" cy="11" r="6.8" />
    <path d="M20 20l-3.9-3.9" />
  </svg>
);
export const FilterIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}>
    <path d="M4 8h9M17 8h3M4 16h3M11 16h9" />
    <circle cx="15" cy="8" r="2" />
    <circle cx="9" cy="16" r="2" />
  </svg>
);
export const HeartIcon = ({ filled, ...p }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.5s-8-4.9-8-11A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8 2.7c0 6.1-8 11-8 11z" />
  </svg>
);
export const ChevronRight = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} strokeWidth={2} {...p}>
    <path d="M9.5 5.5l6.5 6.5-6.5 6.5" />
  </svg>
);
export const PlusIcon = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} strokeWidth={2.2} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const HomeIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} fill="currentColor" {...p}>
    <path d="M4 11l8-7 8 7v8.5a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19.5z" />
  </svg>
);
export const MessageIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}>
    <path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 4.1-1.1l3.4.8-.9-3.2A8.5 8.5 0 0 0 12 3.5z" />
    <circle cx="8.3" cy="12" r=".6" fill="currentColor" />
    <circle cx="12" cy="12" r=".6" fill="currentColor" />
    <circle cx="15.7" cy="12" r=".6" fill="currentColor" />
  </svg>
);
export const BagIcon = (p) => (
  <svg viewBox="0 0 24 24" width="26" height="26" {...base} stroke="#fff" strokeWidth={1.6} {...p}>
    <path d="M6 8h12l1 12H5z" />
    <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" />
    <path d="M9.5 14.5c.6 1.2 1.4 1.8 2.5 1.8s1.9-.6 2.5-1.8" />
  </svg>
);
export const StatusIcons = () => (
  <svg width="62" height="12" viewBox="0 0 62 12" fill="#000">
    <rect x="0" y="7.5" width="2.6" height="3.5" rx=".7" />
    <rect x="4" y="5.5" width="2.6" height="5.5" rx=".7" />
    <rect x="8" y="3.2" width="2.6" height="7.8" rx=".7" />
    <rect x="12" y="1" width="2.6" height="10" rx=".7" />
    <path d="M26.5 4.2a7 7 0 0 1 9 0M28.2 6.3a4.5 4.5 0 0 1 5.6 0M30 8.4a2 2 0 0 1 2 0" stroke="#000" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <circle cx="31" cy="10" r="1" />
    <rect x="41" y="1.2" width="18" height="9.6" rx="2.8" fill="none" stroke="#000" strokeOpacity=".4" />
    <rect x="42.5" y="2.7" width="15" height="6.6" rx="1.8" />
    <rect x="59.8" y="4.2" width="1.5" height="3.6" rx=".7" fill="#000" fillOpacity=".4" />
  </svg>
);
