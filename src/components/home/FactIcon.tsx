type FactIconName = "truck" | "biscuit" | "source" | "store";

export function FactIcon({ name }: { name: FactIconName }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className: "fact-icon__svg",
  };

  switch (name) {
    case "truck":
      return (
        <svg {...common}>
          <path d="M3 7h11v10H3z" />
          <path d="M14 10h4l3 3v4h-7" />
          <circle cx="7" cy="17.5" r="1.5" />
          <circle cx="17" cy="17.5" r="1.5" />
        </svg>
      );
    case "biscuit":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="14" cy="9.5" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="11" cy="14" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="15" cy="13.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "source":
      return (
        <svg {...common}>
          <path d="M4 8h16v11H4z" />
          <path d="M4 8l8-4 8 4" />
          <path d="M12 12v7" />
          <path d="M8 12v7" />
          <path d="M16 12v7" />
        </svg>
      );
    case "store":
      return (
        <svg {...common}>
          <path d="M4 10h16v10H4z" />
          <path d="M4 10l1.5-4h13L20 10" />
          <path d="M9 20v-5h6v5" />
        </svg>
      );
  }
}
