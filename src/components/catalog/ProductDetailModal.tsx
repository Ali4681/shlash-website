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

  useEffect(() => {
    if (flavors[0]) setFlavor(flavors[0].id);
  }, [flavors]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.28, ease: "power2.out" },
      );
      gsap.fromTo(
        panelRef.current,
        { y: 28, scale: 0.96, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
      );
    }, rootRef);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
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
          <div ref={mediaRef} className={cn("product-modal__media", flavors.length && "product-modal__media--flavored")}>
            {flavors.length > 0 && <FlavorBackdrop flavor={flavor} />}
            <Image
              src={product.image}
              alt={product.nameAr}
              fill
              className="product-modal__img"
              sizes="(max-width: 820px) 100vw, 460px"
              priority
            />
          </div>

          <div className="product-modal__content">
            <p className="product-modal__eyebrow" dir="ltr">
              {product.nameEn}
            </p>
            <h2 id={`product-title-${product.id}`} className="product-modal__title">
              {product.nameAr}
            </h2>
            <p className="product-modal__desc">{product.descriptionAr}</p>

            <ul className="product-modal__facts">
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

            <p className="product-modal__units-title">وحدات البيع</p>
            <ul className="product-modal__units">
              {product.units.map((unit) => (
                <li key={unit.id} className="product-modal__unit">
                  <span>{unit.labelAr}</span>
                  <strong>{formatMoney(unit.price)}</strong>
                </li>
              ))}
            </ul>

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
