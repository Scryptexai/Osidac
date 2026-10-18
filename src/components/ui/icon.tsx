import type { ReactNode } from "react";

type IconName =
  | "store"
  | "missions"
  | "wallet"
  | "network"
  | "bank"
  | "logout"
  | "gift"
  | "check"
  | "share"
  | "users"
  | "coins"
  | "flag"
  | "settings"
  | "refresh"
  | "arrowUp"
  | "flame"
  | "bolt"
  | "link"
  | "lock"
  | "clock"
  | "receipt"
  | "shield"
  | "mail"
  | "award"
  | "chevronLeft"
  | "chevronRight"
  | "arrowRight"
  | "info"
  | "circleCheck"
  | "close"
  | "package"
  | "phone"
  | "cursor"
  | "atSign";

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

const drawings: Record<IconName, ReactNode> = {
  package: (
    <>
      <path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z" />
      <path d="m4.5 7.2 7.5 4 7.5-4M12 11.2V21M8 5l8 4" />
    </>
  ),
  phone: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.2" />
      <path d="M10 5.5h4m-3 12.5h2" />
    </>
  ),
  cursor: <path d="m5 3 14 10-6.3 1.2-3.2 6L5 3Z" />,
  atSign: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.3" />
      <path d="M15.3 12v2.1a2.1 2.1 0 0 0 4.2 0V12a7.5 7.5 0 1 0-2.2 5.3" />
    </>
  ),
  store: (
    <>
      <path d="M3.5 10.5 5.3 4h13.4l1.8 6.5" />
      <path d="M4.5 10.5v9h15v-9" />
      <path d="M8 19.5v-5h4v5M3.5 10.5c0 1.4 1 2.4 2.3 2.4s2.2-1 2.2-2.4c0 1.4 1 2.4 2.3 2.4s2.2-1 2.2-2.4c0 1.4 1 2.4 2.3 2.4s2.2-1 2.2-2.4c0 1.4 1 2.4 2.3 2.4s2.2-1 2.2-2.4" />
    </>
  ),
  missions: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.2" />
      <path d="m12 12 7-7M16 5h3v3" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 6.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h12" />
      <path d="M3.5 8h13.8a2 2 0 0 0 0-4H6a2 2 0 0 0-2 2v.5" />
      <path d="M20 11h-4a2 2 0 0 0 0 4h4M16 13h.01" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2.3" />
      <circle cx="5" cy="18" r="2.3" />
      <circle cx="19" cy="18" r="2.3" />
      <path d="m10.9 7-4.8 8.8m7-8.8 4.8 8.8M7.4 18h9.2" />
    </>
  ),
  bank: (
    <>
      <path d="m3 9 9-5 9 5H3Z" />
      <path d="M5 10v7m4-7v7m6-7v7m4-7v7M3 20h18M2.5 17h19" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H5.8A1.8 1.8 0 0 0 4 5.8v12.4A1.8 1.8 0 0 0 5.8 20H10" />
      <path d="M13 16l4-4-4-4m4 4H9" />
    </>
  ),
  gift: (
    <>
      <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13" />
      <path d="M12 7H8.7a2.2 2.2 0 1 1 2.2-2.2L12 7Zm0 0h3.3a2.2 2.2 0 1 0-2.2-2.2L12 7Z" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  share: (
    <>
      <circle cx="18" cy="5" r="2.3" />
      <circle cx="6" cy="12" r="2.3" />
      <circle cx="18" cy="19" r="2.3" />
      <path d="m8 10.8 7.8-4.5M8 13.2l7.8 4.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19v-1.5A4.5 4.5 0 0 1 8 13h2a4.5 4.5 0 0 1 4.5 4.5V19" />
      <path d="M15 5.3a3 3 0 0 1 0 5.7m2 2.2a4.2 4.2 0 0 1 3.5 4.1V19" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="7" rx="5.5" ry="2.5" />
      <path d="M3.5 7v4.2c0 1.4 2.5 2.5 5.5 2.5 1.1 0 2.1-.2 3-.5M3.5 11.2v4.1c0 1.4 2.5 2.5 5.5 2.5 1.1 0 2.1-.2 3-.5" />
      <ellipse cx="16" cy="15.5" rx="4.5" ry="2.2" />
      <path d="M11.5 15.5v3c0 1.2 2 2.2 4.5 2.2s4.5-1 4.5-2.2v-3" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21V4m0 1c4-3 7 2 12-1v10c-5 3-8-2-12 1" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="m19.4 15 .1.1 1.2 1-.1 1.8-1.6.9-1.4-.6-1.3.8-.3 1.5-1.7.8-1.4-1-1.4.1-1.2 1.1-1.8-.4-.7-1.7.7-1.3-.7-1.4-1.5-.4-.6-1.7 1.1-1.3-.1-1.4-1-1.2.4-1.8 1.7-.7 1.3.7 1.4-.7.4-1.5 1.7-.6 1.3 1.1 1.4-.1 1.2-1 1.8.4.7 1.7-.7 1.3.7 1.4 1.5.4.6 1.7-1.1 1.3.1 1.4 1 1.2-.4 1.8-1.7.7-1.3-.7-1.4.7-.4 1.5-1.7.6-1.3-1.1-1.4.1-1.2 1" transform="translate(-1 -1) scale(1.08)" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 7v5h-5M4 17v-5h5" />
      <path d="M5.8 9A7 7 0 0 1 18 6.5L20 8m-16 8 2 1.5A7 7 0 0 0 18.2 15" />
    </>
  ),
  arrowUp: <path d="M12 19V5m-6 6 6-6 6 6" />,
  flame: (
    <>
      <path d="M12 22a7 7 0 0 0 7-7c0-3.2-1.8-5.1-4.5-7.5.2 2.2-.8 3.5-2.1 4.4C12.2 8.1 10.2 5 7 3 7.5 6.8 5 9.2 5 14a7 7 0 0 0 7 8Z" />
      <path d="M12 22a3.5 3.5 0 0 0 3.5-3.5c0-1.6-.8-2.5-2.1-3.8-.1 1.2-.7 1.8-1.4 2.3-.1-1.8-1-3.2-2.5-4.4.2 2-1 3-1 5.9A3.5 3.5 0 0 0 12 22Z" />
    </>
  ),
  bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
  link: <>
    <path d="M10 13.5a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.7 1.7" />
    <path d="M14 10.5a4.5 4.5 0 0 0-6.4 0l-3 3A4.5 4.5 0 1 0 11 19.9l1.7-1.7" />
  </>,
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3m-4 4v3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3.5h12v17l-3-1.8-3 1.8-3-1.8-3 1.8v-17Z" />
      <path d="M9 8h6m-6 4h6m-6 4h3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-3.8 8-10V5l-8-3-8 3v7c0 6.2 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="5" />
      <path d="m8.5 12-1 9 4.5-2.5 4.5 2.5-1-9" />
      <path d="m10 8 1.4 1.4L14 7" />
    </>
  ),
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5m0-8h.01" />
    </>
  ),
  circleCheck: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
};

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  className,
}: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {drawings[name]}
    </svg>
  );
}

export type { IconName };
