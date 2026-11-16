"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { type Product } from "@/data/catalog";
import { cn } from "@/lib/cn";
import { ProductDetailModal } from "@/components/catalog/ProductDetailModal";
import "./product-card.css";

type Props = {
  product: Product;
  promo?: boolean;
  /** Stagger index for entrance (sets --i) */
  index?: number;
};

/** Relative luminance — pick ink that keeps WCAG-friendly contrast on accent. */
function isLightAccent(hex: string): boolean {
  const raw = hex.replace("#", "");
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.58;
}

/** Western digits + grouping — amount only (currency rendered separately). */
function formatAmount(amount: number): string {
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function ProductCard({ product, promo = false, index = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLButtonElement>(null);
  const unit = product.units[0];

  const accent = promo ? "#ff6600" : product.accent || "#0443b2";
  const tone = isLightAccent(accent) ? "light" : "dark";

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -4% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", String((e.clientX - rect.left) / rect.width));
    el.style.setProperty("--my", String((e.clientY - rect.top) / rect.height));
  }, []);

  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty("--mx", "0.5");
    e.currentTarget.style.setProperty("--my", "0.5");
  }, []);

  const currency = unit?.price.currency === "SYP" ? "ل.س" : "$";

  return (
    <>
      <button
        ref={rootRef}
        type="button"
        className={cn(
          "product-card",
          `product-card--tone-${tone}`,
          promo && "product-card--promo",
          inView && "product-card--in",
          loaded && "product-card--loaded",
        )}
        data-shelf-item
        style={
          {
            "--i": index,
            "--pack-accent": accent,
          } as CSSProperties
        }
        onClick={() => setOpen(true)}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`تفاصيل ${product.nameAr}`}
      >
        <div className="product-card__shell">
          {/* Ambient layers */}
          <span className="product-card__blob" aria-hidden="true" />
          <span className="product-card__sweep" aria-hidden="true" />

          {promo && (
            <span className="product-card__ribbon" aria-hidden="false">
              مميّز
            </span>
          )}

          {/* Pack breaks out of the top edge */}
          <div className="product-card__stage">
            <span className="product-card__pack-shadow" aria-hidden="true" />
            <span className="product-card__skeleton" aria-hidden="true" />
            <div className="product-card__pack">
              <Image
                src={product.image}
                alt=""
                fill
                className="product-card__img"
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 42vw, 280px"
                onLoad={() => setLoaded(true)}
              />
            </div>
          </div>

          {/* Bottom info sheet */}
          <div className="product-card__sheet">
            {product.weight && (
              <span className="product-card__chip">{product.weight}</span>
            )}

            <h3 className="product-card__title">{product.nameAr}</h3>

            {unit && (
              <div className="product-card__row">
                <div className="product-card__price">
                  <strong className="product-card__amount">
                    {formatAmount(unit.price.amount)}
                  </strong>
                  <span className="product-card__meta-price">
                    {currency}
                    <span className="product-card__unit"> / {unit.labelAr}</span>
                  </span>
                </div>

                <span className="product-card__cta" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 3.2v9.6M3.2 8h9.6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
            )}

            <p className="product-card__hint">اضغط لعرض التفاصيل</p>
          </div>
        </div>
      </button>

      {open && <ProductDetailModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
