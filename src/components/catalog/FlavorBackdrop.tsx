import Image from "next/image";
import type { FlavorId } from "@/data/catalog";
import { cn } from "@/lib/cn";
import "./flavor-backdrop.css";

const FLAVOR_SCENES: Record<
  FlavorId,
  { src: string; alt: string; labelAr: string }
> = {
  chocolate: {
    src: "/media/flavors/chocolate.jpg",
    alt: "شوكولا",
    labelAr: "شوكولا",
  },
  milk: {
    src: "/media/flavors/milk.jpg",
    alt: "حليب",
    labelAr: "حليب",
  },
  strawberry: {
    src: "/media/flavors/strawberry.jpg",
    alt: "فريز",
    labelAr: "فريز",
  },
  banana: {
    src: "/media/flavors/banana.jpg",
    alt: "موز",
    labelAr: "موز",
  },
};

export function FlavorBackdrop({ flavor }: { flavor: FlavorId }) {
  const scene = FLAVOR_SCENES[flavor];

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
      <p className="flavor-bg__caption">{scene.labelAr}</p>
    </div>
  );
}
