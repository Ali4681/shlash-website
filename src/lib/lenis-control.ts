import type Lenis from "lenis";

let lenis: Lenis | null = null;
let lockCount = 0;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  if (instance && lockCount > 0) instance.stop();
}

export function getLenis() {
  return lenis;
}

/** Scroll the page — prefers Lenis when active. */
export function scrollPageTo(y: number, immediate = false) {
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
  const top = Math.min(Math.max(y, 0), max);
  if (lenis) {
    lenis.scrollTo(top, { immediate, force: true });
    return;
  }
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
}

/** Pause page scroll (Lenis + native). Nestable. */
export function lockPageScroll() {
  lockCount += 1;
  if (lockCount === 1) {
    lenis?.stop();
    document.documentElement.classList.add("scroll-locked");
  }
}

export function unlockPageScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    lenis?.start();
    document.documentElement.classList.remove("scroll-locked");
  }
}
