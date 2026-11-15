/** Tunable constants for section backgrounds. Opacity stays low near text. */

export const BG = {
  /** IntersectionObserver root margin — keep animating slightly before enter */
  inViewRootMargin: "80px 0px",
  inViewThreshold: 0.08,

  who: {
    blobOpacity: 0.18,
    blobDurations: [22, 26, 30] as const,
    gridOpacity: 0.12,
    gridParallax: 18,
  },

  products: {
    patternOpacity: 0.06,
    patternDriftSec: 48,
    beamDurationSec: 12,
    crumbCountDesktop: 12,
    crumbCountMobile: 6,
    crumbOpacity: 0.22,
  },

  coverage: {
    topoOpacity: 0.14,
    topoBreathScale: 1.03,
    topoBreathSec: 14,
    ringCountDesktop: 4,
    ringCountMobile: 2,
    ringDurationSec: 10,
    ringOpacity: 0.16,
    nodeCountDesktop: 8,
    nodeCountMobile: 4,
    dashDurationSec: 8,
  },

  about: {
    particleCountDesktop: 18,
    particleCountMobile: 9,
    particleDurationMin: 15,
    particleDurationMax: 25,
    particleOpacity: 0.2,
    glowOpacity: 0.22,
    glowParallax: 40,
    grainOpacity: 0.04,
  },

  contact: {
    gradientDurationSec: 18,
    shapeCountDesktop: 6,
    shapeCountMobile: 3,
    shapeOpacity: 0.12,
    mouseParallax: 12,
    bubbleCountDesktop: 5,
    bubbleCountMobile: 2,
    bubbleOpacity: 0.08,
  },

  footer: {
    waveDurationSec: 16,
    speckCountDesktop: 20,
    speckCountMobile: 10,
    speckOpacity: 0.35,
    wordmarkOpacity: 0.06,
  },

  wave: {
    height: 56,
    durationSec: 14,
  },
} as const;
