"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import {
  formatMoney,
  getBrand,
  getCategory,
  productFlavors,
  type FlavorId,
  type Product,
} from "@/data/catalog";
import { FlavorBackdrop } from "@/components/catalog/FlavorBackdrop";
import { cn } from "@/lib/cn";
import { lockPageScroll, unlockPageScroll } from "@/lib/lenis-control";
import "./product-detail-modal.css";

export function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const category = getCategory(product.categoryId);
  const brand = getBrand(product.brandId);

  const flavors = useMemo(
    () => productFlavors.filter((f) => product.flavors?.includes(f.id)),
    [product.flavors],
  );

  const [flavor, setFlavor] = useState<FlavorId>(flavors[0]?.id ?? "chocolate");
  const primaryUnit = product.units[0];

  useEffect(() => {
    if (flavors[0]) setFlavor(flavors[0].id);
  }, [flavors]);

  useEffect(() => {
    const scrollY = window.scrollY;
    lockPageScroll();
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const onTouchStart = (e: TouchEvent) => {
      const panel = panelRef.current;
      if (!panel || !e.touches[0]) return;
      panel.dataset.touchY = String(e.touches[0].clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      const target = e.target as Element | null;
      const panel = panelRef.current;
      const inPanel = target?.closest?.(".product-modal__panel");
      if (!inPanel || !panel) {
        e.preventDefault();
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = panel;
      const touch = e.touches[0];
      if (!touch) return;
      const lastY = Number(panel.dataset.touchY ?? touch.clientY);
      const delta = touch.clientY - lastY;
      panel.dataset.touchY = String(touch.clientY);
      const atTop = scrollTop <= 0 && delta > 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && delta < 0;
      if (atTop || atBottom) e.preventDefault();
    };

    const onWheel = (e: WheelEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest?.(".product-modal__panel")) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("wheel", onWheel, { passive: false });

    const isMobile = window.matchMedia("(max-width: 819px)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.28, ease: "power2.out" },
      );
      gsap.fromTo(
        panelRef.current,
        isMobile
          ? { y: "108%", autoAlpha: 1 }
          : { y: 28, scale: 0.96, autoAlpha: 0 },
        isMobile
          ? { y: 0, autoAlpha: 1, duration: 0.48, ease: "power3.out" }
          : { y: 0, scale: 1, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
      );

      if (isMobile) {
        gsap.fromTo(
          ".product-modal__media, .product-modal__dock > *",
          { y: 18, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.4,
            stagger: 0.045,
            delay: 0.12,
            ease: "power2.out",
          },
        );
      }
    }, rootRef);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
      unlockPageScroll();
      ctx.revert();
    };
  }, [onClose]);

  useEffect(() => {
    if (!mediaRef.current || !flavors.length) return;
    gsap.fromTo(
      mediaRef.current,
      { autoAlpha: 0.65, scale: 0.985 },
      { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" },
    );
  }, [flavor, flavors.length]);

  if (typeof document === "undefined") return null;

  const activeFlavor = flavors.find((f) => f.id === flavor);
  const metaBits = [
    product.weight,
    category?.nameAr,
    brand?.nameAr,
    product.available ? "متوفر" : "غير متوفر",
  ].filter(Boolean);

  return createPortal(
    <div ref={rootRef} className="product-modal" role="presentation">
      <button
        type="button"
        className="product-modal__backdrop"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="product-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`product-title-${product.id}`}
      >
        <div className="product-modal__grab" aria-hidden>
          <span />
        </div>

        <button type="button" className="product-modal__close" onClick={onClose} aria-label="إغلاق">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3.5 3.5l9 9M12.5 3.5l-9 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="product-modal__grid">
          <div
            ref={mediaRef}
            className={cn("product-modal__media", flavors.length && "product-modal__media--flavored")}
          >
            {flavors.length > 0 && <FlavorBackdrop flavor={flavor} />}
            <Image
              src={product.image}
              alt={product.nameAr}
              fill
              className="product-modal__img"
              sizes="(max-width: 820px) 100vw, 460px"
              priority
            />

            {flavors.length > 0 && (
              <div className="product-modal__swatches" role="tablist" aria-label="اختيار النكهة">
                {flavors.map((item) => (
                  <button
                    key={`swatch-${item.id}`}
                    type="button"
                    role="tab"
                    aria-selected={flavor === item.id}
                    aria-label={item.nameAr}
                    title={item.nameAr}
                    className={cn(
                      "product-modal__swatch",
                      `product-modal__swatch--${item.id}`,
                      flavor === item.id && "is-active",
                    )}
                    onClick={() => setFlavor(item.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-modal__content product-modal__dock">
            <div className="product-modal__identity">
              <p className="product-modal__eyebrow" dir="ltr">
                {product.nameEn}
              </p>
              <h2 id={`product-title-${product.id}`} className="product-modal__title">
                {product.nameAr}
              </h2>
              <p className="product-modal__meta-line">{metaBits.join(" · ")}</p>
            </div>

            <p className="product-modal__desc">{product.descriptionAr}</p>

            <ul className="product-modal__facts" aria-hidden="true">
              {product.weight && <li>{product.weight}</li>}
              {category && <li>{category.nameAr}</li>}
              {brand && <li>{brand.nameAr}</li>}
              <li>{product.available ? "متوفر للتوزيع" : "غير متوفر حالياً"}</li>
            </ul>

            {flavors.length > 0 && (
              <div className="product-modal__flavors">
                <p className="product-modal__units-title">النكهات</p>
                <div className="product-modal__flavor-list" role="tablist" aria-label="اختيار النكهة">
                  {flavors.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={flavor === item.id}
                      className={cn(
                        "product-modal__flavor",
                        `product-modal__flavor--${item.id}`,
                        flavor === item.id && "is-active",
                      )}
                      onClick={() => setFlavor(item.id)}
                    >
                      <span className="product-modal__flavor-dot" aria-hidden />
                      {item.nameAr}
                    </button>
                  ))}
                </div>
                {activeFlavor && (
                  <p className="product-modal__flavor-note">
                    خلفية حقيقية لنكهة {activeFlavor.nameAr}
                  </p>
                )}
              </div>
            )}

            {primaryUnit && (
              <div className="product-modal__price-hero">
                <span className="product-modal__price-label">{primaryUnit.labelAr}</span>
                <strong className="product-modal__price-value">{formatMoney(primaryUnit.price)}</strong>
              </div>
            )}

            <div
              className={cn(
                "product-modal__units-block",
                product.units.length < 2 && "product-modal__units-block--solo",
              )}
            >
              <p className="product-modal__units-title">وحدات البيع</p>
              <ul className="product-modal__units">
                {product.units.map((unit, index) => (
                  <li
                    key={unit.id}
                    className={cn(
                      "product-modal__unit",
                      index === 0 && "product-modal__unit--primary",
                    )}
                  >
                    <span>{unit.labelAr}</span>
                    <strong>{formatMoney(unit.price)}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <a href="#contact" className="product-modal__cta" onClick={onClose}>
              استفسر عن هذا الصنف
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
