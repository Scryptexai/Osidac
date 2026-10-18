export default function BrandLogo({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className={compact ? "h-8 w-8 shrink-0" : "h-9 w-9 shrink-0"}
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6.5 17.2 20 6.5l13.5 10.7M9.5 15.5v17h21v-17M16 32.5V21h8v11.5"
          stroke="#059669"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M15.5 13h9" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {!compact && (
        <span className="text-[1.05rem] font-black leading-none tracking-[-0.045em] text-zinc-950 dark:text-white">
          OSIDAC
        </span>
      )}
    </span>
  );
}
