import Link from "next/link";
import { cn } from "@/lib/cn";
import "./button.css";

const variants = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  ghost: "btn--ghost",
  onDark: "btn--on-dark",
} as const;

type Props = {
  href?: string;
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  external?: boolean;
};

export function Button({
  href,
  variant = "primary",
  className,
  children,
  onClick,
  type = "button",
  external,
}: Props) {
  const cls = cn("btn", variants[variant], className);

  if (href) {
    if (external) {
      return (
        <a href={href} className={cls} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }
    // Hash anchors use native <a> so Lenis can animate the scroll
    if (href.startsWith("#")) {
      return (
        <a href={href} className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
