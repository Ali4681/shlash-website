/** Named scroll-timeline constants (progress 0 → 1 across the 600vh pin). */

export const PIN_VH = 600;

export const PHASE = {
  INTRO: { start: 0.0, end: 0.1 },
  LOADING: { start: 0.1, end: 0.55 },
  CLOSE_DOORS: { start: 0.55, end: 0.65 },
  CAB: { start: 0.65, end: 0.78 },
  DEPARTURE: { start: 0.78, end: 1.0 },
} as const;

export const BOX_COUNT = 8;

/** Duration of one load cycle inside LOADING (fraction of total scroll). */
export const LOAD_CYCLE =
  (PHASE.LOADING.end - PHASE.LOADING.start) / BOX_COUNT;

/** Sub-steps within a single load cycle (normalized 0–1). */
export const CYCLE = {
  WALK_TO_PALLET: { start: 0.0, end: 0.22 },
  PICK_UP: { start: 0.22, end: 0.38 },
  CARRY_TO_TRUCK: { start: 0.38, end: 0.72 },
  PLACE_BOX: { start: 0.72, end: 1.0 },
} as const;

/** Camera framing keys used during the loading orbit. */
export const FRAMINGS = ["wide", "medium", "hands"] as const;
export type Framing = (typeof FRAMINGS)[number];

export const CAB_STEPS = {
  WALK_TO_CAB: { start: 0.65, end: 0.7 },
  OPEN_CAB: { start: 0.7, end: 0.72 },
  CLIMB_IN: { start: 0.72, end: 0.76 },
  CLOSE_CAB: { start: 0.76, end: 0.78 },
} as const;

export const SCENE = {
  pallet: [-3.4, 0, 0.6] as [number, number, number],
  truck: [2.8, 0, 0] as [number, number, number],
  cargoMouth: [1.15, 0.55, 0] as [number, number, number],
  cabDoor: [3.55, 0.85, 0.95] as [number, number, number],
  logoAspect: 1889 / 2076,
} as const;

/** Expected GLB node names — override in NODE_ALIASES if your export differs. */
export const NODE_NAMES = {
  doorL: "door_L",
  doorR: "door_R",
  cabDoor: "cab_door",
  wheelFL: "wheel_FL",
  wheelFR: "wheel_FR",
  wheelRL: "wheel_RL",
  wheelRR: "wheel_RR",
  cargoBody: "cargo_box",
  logoLeft: "logo_decal_L",
  logoRight: "logo_decal_R",
} as const;

/**
 * Map alternate exporter names → canonical keys.
 * Add entries after inspecting your GLB in a viewer.
 */
export const NODE_ALIASES: Record<string, string> = {
  Door_L: NODE_NAMES.doorL,
  Door_R: NODE_NAMES.doorR,
  rear_door_L: NODE_NAMES.doorL,
  rear_door_R: NODE_NAMES.doorR,
  CabDoor: NODE_NAMES.cabDoor,
  cabDoor: NODE_NAMES.cabDoor,
};

export const WORKER_CLIPS = [
  "Idle",
  "Walk",
  "PickUp",
  "CarryWalk",
  "PlaceBox",
  "CloseDoor",
  "ClimbIn",
] as const;

export type WorkerClip = (typeof WORKER_CLIPS)[number];

export const ASSETS = {
  truck: "/models/truck.opt.glb",
  worker: "/models/worker.glb",
  box: "/models/box.glb",
  env: "/textures/env.hdr",
  logo: "/shlash_primary_logo_transparent.png",
  poster: "/media/poster.jpg",
  fallbackVideo: "/media/hero.mp4",
} as const;

export const HERO_STAGES = [
  {
    at: PHASE.INTRO.start,
    index: "01",
    labelEn: "Arrive",
    title: "ساحة التحميل",
    line: "شروق ذهبي فوق ساحة المستودع.",
  },
  {
    at: PHASE.LOADING.start,
    index: "02",
    labelEn: "Load",
    title: "تحميل الصناديق",
    line: "ثمانية صناديق… مسار واحد إلى الشاحنة.",
  },
  {
    at: PHASE.CLOSE_DOORS.start,
    index: "03",
    labelEn: "Secure",
    title: "إغلاق الأبواب",
    line: "الشعار يظهر… والشحنة مؤمّنة.",
  },
  {
    at: PHASE.CAB.start,
    index: "04",
    labelEn: "Board",
    title: "صعود الكابينة",
    line: "من الرصيف إلى مقعد القيادة.",
  },
  {
    at: PHASE.DEPARTURE.start,
    index: "05",
    labelEn: "Depart",
    title: "انطلاق التوزيع",
    line: "من الثبات… إلى الطريق.",
  },
] as const;

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + Math.min(1, Math.max(0, t)) * (outMax - outMin);
}

export function phaseProgress(
  progress: number,
  start: number,
  end: number,
): number {
  return mapRange(progress, start, end, 0, 1);
}

export function stageFromProgress(progress: number) {
  let idx = 0;
  for (let i = 0; i < HERO_STAGES.length; i++) {
    if (progress >= HERO_STAGES[i].at) idx = i;
  }
  return idx;
}

export function loadCycleIndex(progress: number): number {
  if (progress < PHASE.LOADING.start) return -1;
  if (progress >= PHASE.LOADING.end) return BOX_COUNT;
  return Math.min(
    BOX_COUNT - 1,
    Math.floor((progress - PHASE.LOADING.start) / LOAD_CYCLE),
  );
}

export function loadCycleLocal(progress: number): number {
  if (progress < PHASE.LOADING.start) return 0;
  if (progress >= PHASE.LOADING.end) return 1;
  const i = loadCycleIndex(progress);
  return phaseProgress(
    progress,
    PHASE.LOADING.start + i * LOAD_CYCLE,
    PHASE.LOADING.start + (i + 1) * LOAD_CYCLE,
  );
}
