"use client";

import Image from "next/image";
import type { FlavorId } from "@/data/catalog";
import { productFlavors } from "@/data/catalog";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { pickLocalized } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/cn";
import "./flavor-backdrop.css";

const FLAVOR_SCENES: Record<FlavorId, { src: string }> = {
  chocolate: { src: "/media/flavors/chocolate.jpg" },
  milk: { src: "/media/flavors/milk.jpg" },
  strawberry: { src: "/media/flavors/strawberry.jpg" },
  banana: { src: "/media/flavors/banana.jpg" },
};

export function FlavorBackdrop({ flavor }: { flavor: FlavorId }) {
  const { locale } = usePrefs();
  const scene = FLAVOR_SCENES[flavor];
  const meta = productFlavors.find((f) => f.id === flavor);
  const label = meta
    ? pickLocalized(locale, meta.nameAr, meta.nameEn)
    : flavor;

  return (
    <div className={cn("flavor-bg", `flavor-bg--${flavor}`)} aria-hidden>
      <div className="flavor-bg__photo">
        <Image
          src={scene.src}
          alt=""
          fill
          className="flavor-bg__img"
          sizes="(max-width: 820px) 100vw, 460px"
          priority
        />
      </div>
      <div className="flavor-bg__photo flavor-bg__photo--drift">
        <Image
          src={scene.src}
          alt=""
          fill
          className="flavor-bg__img"
          sizes="(max-width: 820px) 100vw, 460px"
        />
      </div>
      <div className="flavor-bg__veil" />
      <p className="flavor-bg__caption">{label}</p>
    </div>
  );
}
