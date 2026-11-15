"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import {
  BOX_COUNT,
  CAB_STEPS,
  CYCLE,
  FRAMINGS,
  LOAD_CYCLE,
  PHASE,
  loadCycleIndex,
  loadCycleLocal,
  mapRange,
  phaseProgress,
  type Framing,
  type WorkerClip,
} from "./timeline";
import type { BoxesHandle } from "./Boxes";
import type { TruckHandle } from "./procedural/ProceduralTruck";
import type { WorkerHandle } from "./procedural/ProceduralWorker";

gsap.registerPlugin(ScrollTrigger);

export type TimelineDrivers = {
  camera: THREE.PerspectiveCamera | null;
  cameraTarget: THREE.Vector3;
  truck: TruckHandle | null;
  worker: WorkerHandle | null;
  boxes: BoxesHandle | null;
  setDust: (n: number) => void;
  setFocus: (v: THREE.Vector3) => void;
};

type OverlaySetter = (state: {
  progress: number;
  titleVisible: boolean;
  ctaVisible: boolean;
}) => void;

const pallet = new THREE.Vector3(-3.4, 0, 0.6);
const truckRear = new THREE.Vector3(1.2, 0, 0.15);
const truckSide = new THREE.Vector3(3.2, 0, 1.1);
const cabPos = new THREE.Vector3(4.0, 0, 0.9);

function framingLook(
  framing: Framing,
  workerPos: THREE.Vector3,
): { pos: THREE.Vector3; look: THREE.Vector3 } {
  switch (framing) {
    case "medium":
      return {
        pos: new THREE.Vector3(
          workerPos.x + 2.2,
          1.8,
          workerPos.z + 2.8,
        ),
        look: workerPos.clone().add(new THREE.Vector3(0, 1.0, 0)),
      };
    case "hands":
      return {
        pos: new THREE.Vector3(
          workerPos.x + 0.9,
          1.25,
          workerPos.z + 1.35,
        ),
        look: workerPos.clone().add(new THREE.Vector3(0, 1.05, 0.2)),
      };
    case "wide":
    default:
      return {
        pos: new THREE.Vector3(0.2, 3.4, 7.2),
        look: new THREE.Vector3(0.4, 0.9, 0),
      };
  }
}

function applyDoorRot(
  door: THREE.Object3D | null,
  openY: number,
  closedY: number,
  t: number,
) {
  if (!door) return;
  door.rotation.y = THREE.MathUtils.lerp(openY, closedY, t);
}

export function useScrollTimeline(
  sectionRef: RefObject<HTMLElement | null>,
  driversRef: RefObject<TimelineDrivers>,
  setOverlay: OverlaySetter,
) {
  const proxy = useRef({
    progress: 0,
    camX: 0.2,
    camY: 3.6,
    camZ: 8.5,
    lookX: 0.4,
    lookY: 1.0,
    lookZ: 0,
    workerX: -2.2,
    workerZ: 1.4,
    doorT: 0,
    cabDoorT: 0,
    truckX: 0,
    truckPitch: 0,
    wheelSpin: 0,
    dust: 0,
    fov: 42,
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const p = proxy.current;
    let raf = 0;

    const apply = () => {
      const d = driversRef.current;
      if (!d) return;

      const progress = p.progress;

      // Camera
      if (d.camera) {
        d.camera.position.set(p.camX, p.camY, p.camZ);
        d.camera.fov = p.fov;
        d.camera.updateProjectionMatrix();
        d.cameraTarget.set(p.lookX, p.lookY, p.lookZ);
        d.camera.lookAt(d.cameraTarget);
      }

      // Worker root position + clips
      const w = d.worker;
      if (w?.group) {
        w.group.position.x = p.workerX;
        w.group.position.z = p.workerZ;
      }

      // Drive clips from scroll phases
      driveWorkerClips(progress, w);

      // Boxes loaded count
      const loaded =
        progress < PHASE.LOADING.start
          ? 0
          : progress >= PHASE.LOADING.end
            ? BOX_COUNT
            : Math.max(0, loadCycleIndex(progress));
      // During PLACE_BOX of current cycle, count as loaded at end of place
      let shown = loaded;
      if (
        progress >= PHASE.LOADING.start &&
        progress < PHASE.LOADING.end
      ) {
        const local = loadCycleLocal(progress);
        const idx = loadCycleIndex(progress);
        if (local >= CYCLE.PLACE_BOX.end * 0.85) shown = idx + 1;
        else shown = idx;
      }
      d.boxes?.setLoadedCount(Math.min(BOX_COUNT, shown));

      const carrying =
        progress >= PHASE.LOADING.start &&
        progress < PHASE.LOADING.end &&
        (() => {
          const local = loadCycleLocal(progress);
          return (
            local >= CYCLE.PICK_UP.end * 0.7 &&
            local < CYCLE.PLACE_BOX.start + 0.15
          );
        })();
      w?.setCarrying(!!carrying);

      // Doors
      applyDoorRot(d.truck?.doors.left ?? null, -Math.PI * 0.92, 0, p.doorT);
      applyDoorRot(d.truck?.doors.right ?? null, Math.PI * 0.92, 0, p.doorT);
      applyDoorRot(d.truck?.doors.cab ?? null, 0, -Math.PI * 0.75, p.cabDoorT);

      // Truck departure
      if (d.truck?.group) {
        d.truck.group.position.x = 2.8 + p.truckX;
        d.truck.group.rotation.z = p.truckPitch;
      }
      d.truck?.wheels.forEach((wheel) => {
        wheel.rotation.x = p.wheelSpin;
      });

      d.setDust(p.dust);

      // DoF focus follows worker hands / worker
      if (w?.focus) {
        const wp = new THREE.Vector3();
        w.focus.getWorldPosition(wp);
        d.setFocus(wp);
      } else if (w?.group) {
        d.setFocus(
          new THREE.Vector3(p.workerX, 1.1, p.workerZ),
        );
      }

      setOverlay({
        progress,
        titleVisible: progress >= 0.02 && progress < 0.14,
        ctaVisible: progress > 0.9,
      });
    };

    const tick = () => {
      apply();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // --- 0.00–0.10 Intro: wide push-in ---
      tl.fromTo(
        p,
        { camX: 0.4, camY: 4.2, camZ: 9.5, lookY: 1.1, fov: 44 },
        {
          camX: 0.15,
          camY: 3.35,
          camZ: 7.0,
          lookX: 0.5,
          lookY: 0.95,
          lookZ: 0,
          fov: 40,
          duration: 0.1,
        },
        0,
      );
      tl.fromTo(
        p,
        { workerX: -2.4, workerZ: 1.6 },
        { workerX: -2.2, workerZ: 1.4, duration: 0.1 },
        0,
      );

      // --- 0.10–0.55 Loading: 8 cycles + orbit framings ---
      for (let i = 0; i < BOX_COUNT; i++) {
        const start = PHASE.LOADING.start + i * LOAD_CYCLE;
        const framing = FRAMINGS[i % FRAMINGS.length];

        // Walk to pallet
        tl.to(
          p,
          {
            workerX: pallet.x + 0.55,
            workerZ: pallet.z + 0.35,
            duration: LOAD_CYCLE * (CYCLE.WALK_TO_PALLET.end - CYCLE.WALK_TO_PALLET.start),
          },
          start + LOAD_CYCLE * CYCLE.WALK_TO_PALLET.start,
        );

        // Stay near pallet for pickup
        tl.to(
          p,
          {
            workerX: pallet.x + 0.4,
            workerZ: pallet.z + 0.2,
            duration: LOAD_CYCLE * (CYCLE.PICK_UP.end - CYCLE.PICK_UP.start),
          },
          start + LOAD_CYCLE * CYCLE.PICK_UP.start,
        );

        // Carry to truck
        tl.to(
          p,
          {
            workerX: truckRear.x,
            workerZ: truckRear.z,
            duration:
              LOAD_CYCLE *
              (CYCLE.CARRY_TO_TRUCK.end - CYCLE.CARRY_TO_TRUCK.start),
          },
          start + LOAD_CYCLE * CYCLE.CARRY_TO_TRUCK.start,
        );

        // Place
        tl.to(
          p,
          {
            workerX: truckRear.x - 0.15,
            workerZ: truckRear.z,
            duration: LOAD_CYCLE * (CYCLE.PLACE_BOX.end - CYCLE.PLACE_BOX.start),
          },
          start + LOAD_CYCLE * CYCLE.PLACE_BOX.start,
        );

        // Camera framing for this cycle
        const mid = start + LOAD_CYCLE * 0.45;
        const look = framingLook(
          framing,
          new THREE.Vector3(
            (pallet.x + truckRear.x) / 2,
            0,
            (pallet.z + truckRear.z) / 2,
          ),
        );
        tl.to(
          p,
          {
            camX: look.pos.x,
            camY: look.pos.y,
            camZ: look.pos.z,
            lookX: look.look.x,
            lookY: look.look.y,
            lookZ: look.look.z,
            fov: framing === "hands" ? 32 : framing === "medium" ? 36 : 40,
            duration: LOAD_CYCLE * 0.9,
          },
          mid - LOAD_CYCLE * 0.35,
        );
      }

      // --- 0.55–0.65 Close doors + logo close-up ---
      tl.to(
        p,
        {
          doorT: 1,
          duration: PHASE.CLOSE_DOORS.end - PHASE.CLOSE_DOORS.start,
          ease: "power2.inOut",
        },
        PHASE.CLOSE_DOORS.start,
      );
      tl.to(
        p,
        {
          workerX: 1.0,
          workerZ: 1.35,
          camX: 0.2,
          camY: 1.55,
          camZ: 3.4,
          lookX: 2.4,
          lookY: 1.35,
          lookZ: 1.0,
          fov: 30,
          duration: PHASE.CLOSE_DOORS.end - PHASE.CLOSE_DOORS.start,
        },
        PHASE.CLOSE_DOORS.start,
      );

      // --- 0.65–0.78 Walk to cab, open, climb, close ---
      tl.to(
        p,
        {
          workerX: truckSide.x,
          workerZ: truckSide.z,
          camX: 5.2,
          camY: 1.7,
          camZ: 3.6,
          lookX: 3.6,
          lookY: 1.1,
          lookZ: 0.6,
          fov: 34,
          duration: CAB_STEPS.WALK_TO_CAB.end - CAB_STEPS.WALK_TO_CAB.start,
        },
        CAB_STEPS.WALK_TO_CAB.start,
      );
      tl.to(
        p,
        {
          cabDoorT: 1,
          workerX: cabPos.x - 0.3,
          workerZ: cabPos.z,
          duration: CAB_STEPS.OPEN_CAB.end - CAB_STEPS.OPEN_CAB.start,
          ease: "power2.inOut",
        },
        CAB_STEPS.OPEN_CAB.start,
      );
      tl.to(
        p,
        {
          workerX: cabPos.x,
          workerZ: cabPos.z - 0.15,
          duration: CAB_STEPS.CLIMB_IN.end - CAB_STEPS.CLIMB_IN.start,
        },
        CAB_STEPS.CLIMB_IN.start,
      );
      tl.to(
        p,
        {
          cabDoorT: 0,
          duration: CAB_STEPS.CLOSE_CAB.end - CAB_STEPS.CLOSE_CAB.start,
          ease: "power2.inOut",
        },
        CAB_STEPS.CLOSE_CAB.start,
      );

      // --- 0.78–1.00 Departure ---
      tl.to(
        p,
        {
          truckX: 14,
          wheelSpin: Math.PI * 10,
          truckPitch: -0.035,
          dust: 1,
          workerX: 18,
          camX: 6,
          camY: 3.8,
          camZ: 11,
          lookX: 8,
          lookY: 1.2,
          lookZ: 0,
          fov: 42,
          duration: PHASE.DEPARTURE.end - PHASE.DEPARTURE.start,
          ease: "power2.in",
        },
        PHASE.DEPARTURE.start,
      );
      // Settle pitch mid-departure
      tl.to(
        p,
        {
          truckPitch: 0.01,
          duration: 0.08,
          ease: "power1.out",
        },
        0.88,
      );

      // Progress proxy for overlay (driven every frame via p.progress)
      tl.to(
        p,
        {
          progress: 1,
          duration: 1,
          ease: "none",
        },
        0,
      );
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 400);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [sectionRef, driversRef, setOverlay]);
}

function driveWorkerClips(
  progress: number,
  worker: WorkerHandle | null | undefined,
) {
  if (!worker) return;

  if (progress < PHASE.LOADING.start) {
    worker.setClip("Idle", phaseProgress(progress, 0, PHASE.INTRO.end));
    return;
  }

  if (progress < PHASE.LOADING.end) {
    const local = loadCycleLocal(progress);
    let clip: WorkerClip = "Walk";
    let t = 0;
    if (local < CYCLE.WALK_TO_PALLET.end) {
      clip = "Walk";
      t = mapRange(
        local,
        CYCLE.WALK_TO_PALLET.start,
        CYCLE.WALK_TO_PALLET.end,
        0,
        1,
      );
    } else if (local < CYCLE.PICK_UP.end) {
      clip = "PickUp";
      t = mapRange(local, CYCLE.PICK_UP.start, CYCLE.PICK_UP.end, 0, 1);
    } else if (local < CYCLE.CARRY_TO_TRUCK.end) {
      clip = "CarryWalk";
      t = mapRange(
        local,
        CYCLE.CARRY_TO_TRUCK.start,
        CYCLE.CARRY_TO_TRUCK.end,
        0,
        1,
      );
    } else {
      clip = "PlaceBox";
      t = mapRange(local, CYCLE.PLACE_BOX.start, CYCLE.PLACE_BOX.end, 0, 1);
    }
    worker.setClip(clip, t);
    return;
  }

  if (progress < PHASE.CLOSE_DOORS.end) {
    worker.setClip(
      "CloseDoor",
      phaseProgress(progress, PHASE.CLOSE_DOORS.start, PHASE.CLOSE_DOORS.end),
    );
    return;
  }

  if (progress < CAB_STEPS.OPEN_CAB.start) {
    worker.setClip(
      "Walk",
      phaseProgress(
        progress,
        CAB_STEPS.WALK_TO_CAB.start,
        CAB_STEPS.WALK_TO_CAB.end,
      ),
    );
    return;
  }

  if (progress < CAB_STEPS.CLIMB_IN.start) {
    worker.setClip("Idle", 0.2);
    return;
  }

  if (progress < CAB_STEPS.CLOSE_CAB.start) {
    worker.setClip(
      "ClimbIn",
      phaseProgress(
        progress,
        CAB_STEPS.CLIMB_IN.start,
        CAB_STEPS.CLIMB_IN.end,
      ),
    );
    return;
  }

  if (progress < PHASE.DEPARTURE.start) {
    worker.setClip("Idle", 0.5);
    return;
  }

  worker.setClip("Idle", 1);
}
