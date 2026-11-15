import type { MutableRefObject } from "react";
import type { Group, Object3D, PerspectiveCamera } from "three";
import type { Framing, WorkerClip } from "./timeline";

export type SceneApi = {
  camera: PerspectiveCamera | null;
  truck: Group | null;
  worker: Group | null;
  doors: {
    left: Object3D | null;
    right: Object3D | null;
    cab: Object3D | null;
  };
  wheels: Object3D[];
  boxes: Group[];
  focusTarget: Object3D | null;
  setClip: (name: WorkerClip | null, timeNorm: number) => void;
  setFraming: (f: Framing) => void;
  setLoadedCount: (n: number) => void;
  setDust: (amount: number) => void;
};

export type SceneApiRef = MutableRefObject<SceneApi>;

export type OverlayState = {
  progress: number;
  stageIndex: number;
  titleVisible: boolean;
  ctaVisible: boolean;
};
