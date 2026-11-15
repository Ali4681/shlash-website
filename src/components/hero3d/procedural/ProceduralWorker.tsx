"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { WorkerClip } from "../timeline";

export type WorkerHandle = {
  group: THREE.Group | null;
  focus: THREE.Object3D | null;
  setClip: (name: WorkerClip | null, timeNorm: number) => void;
  setCarrying: (carrying: boolean) => void;
};

type Pose = {
  root: [number, number, number];
  rotY: number;
  torsoLean: number;
  armL: number;
  armR: number;
  legL: number;
  legR: number;
};

const IDLE: Pose = {
  root: [0, 0, 0],
  rotY: 0,
  torsoLean: 0,
  armL: 0.15,
  armR: -0.15,
  legL: 0,
  legR: 0,
};

function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const k = THREE.MathUtils.smoothstep(0, 1, t);
  return {
    root: [
      THREE.MathUtils.lerp(a.root[0], b.root[0], k),
      THREE.MathUtils.lerp(a.root[1], b.root[1], k),
      THREE.MathUtils.lerp(a.root[2], b.root[2], k),
    ],
    rotY: THREE.MathUtils.lerp(a.rotY, b.rotY, k),
    torsoLean: THREE.MathUtils.lerp(a.torsoLean, b.torsoLean, k),
    armL: THREE.MathUtils.lerp(a.armL, b.armL, k),
    armR: THREE.MathUtils.lerp(a.armR, b.armR, k),
    legL: THREE.MathUtils.lerp(a.legL, b.legL, k),
    legR: THREE.MathUtils.lerp(a.legR, b.legR, k),
  };
}

function walkPose(phase: number, facing: number): Pose {
  const swing = Math.sin(phase * Math.PI * 2) * 0.55;
  return {
    root: [0, Math.abs(Math.sin(phase * Math.PI * 2)) * 0.03, 0],
    rotY: facing,
    torsoLean: 0.04,
    armL: swing,
    armR: -swing,
    legL: -swing * 0.9,
    legR: swing * 0.9,
  };
}

function clipToPose(
  clip: WorkerClip | null,
  t: number,
  carrying: boolean,
): Pose {
  const n = THREE.MathUtils.clamp(t, 0, 1);
  switch (clip) {
    case "Walk":
    case "CarryWalk":
      return walkPose(n * 2, clip === "CarryWalk" || carrying ? Math.PI * 0.15 : 0);
    case "PickUp": {
      const bend = Math.sin(n * Math.PI);
      return {
        root: [0, -bend * 0.18, 0],
        rotY: -0.2,
        torsoLean: bend * 0.55,
        armL: -0.4 - bend * 0.6,
        armR: 0.4 + bend * 0.6,
        legL: bend * 0.25,
        legR: -bend * 0.1,
      };
    }
    case "PlaceBox": {
      const reach = Math.sin(n * Math.PI);
      return {
        root: [0, -reach * 0.08, 0],
        rotY: 0.35,
        torsoLean: reach * 0.35,
        armL: -0.9 - reach * 0.3,
        armR: 0.9 + reach * 0.3,
        legL: 0.1,
        legR: -0.05,
      };
    }
    case "CloseDoor": {
      const push = Math.sin(n * Math.PI);
      return {
        root: [0, 0, 0],
        rotY: -0.6,
        torsoLean: 0.1,
        armL: -0.2,
        armR: -1.2 - push * 0.4,
        legL: 0.15,
        legR: -0.1,
      };
    }
    case "ClimbIn": {
      return {
        root: [0, n * 0.55, n * 0.2],
        rotY: 0.9,
        torsoLean: 0.2,
        armL: -0.8,
        armR: 0.6,
        legL: n * 0.9,
        legR: -n * 0.4,
      };
    }
    case "Idle":
    default:
      return carrying
        ? {
            ...IDLE,
            armL: -1.1,
            armR: 1.1,
            torsoLean: 0.08,
          }
        : IDLE;
  }
}

export const ProceduralWorker = forwardRef<WorkerHandle>(
  function ProceduralWorker(_, ref) {
    const group = useRef<THREE.Group>(null);
    const torso = useRef<THREE.Group>(null);
    const armL = useRef<THREE.Group>(null);
    const armR = useRef<THREE.Group>(null);
    const legL = useRef<THREE.Group>(null);
    const legR = useRef<THREE.Group>(null);
    const hands = useRef<THREE.Group>(null);
    const carried = useRef<THREE.Mesh>(null);

    const state = useRef<{
      clip: WorkerClip | null;
      t: number;
      carrying: boolean;
      pose: Pose;
    }>({
      clip: "Idle",
      t: 0,
      carrying: false,
      pose: IDLE,
    });

    const mats = useMemo(
      () => ({
        hoodie: new THREE.MeshStandardMaterial({
          color: "#1a3a9e",
          roughness: 0.72,
          metalness: 0.05,
        }),
        hood: new THREE.MeshStandardMaterial({
          color: "#FF6600",
          roughness: 0.65,
          metalness: 0.05,
        }),
        pants: new THREE.MeshStandardMaterial({
          color: "#1c1f2e",
          roughness: 0.8,
        }),
        skin: new THREE.MeshStandardMaterial({
          color: "#c6865a",
          roughness: 0.7,
        }),
        shoes: new THREE.MeshStandardMaterial({
          color: "#151515",
          roughness: 0.9,
        }),
        cord: new THREE.MeshStandardMaterial({
          color: "#FF6600",
          roughness: 0.55,
        }),
        box: new THREE.MeshStandardMaterial({
          color: "#c4a574",
          roughness: 0.9,
        }),
      }),
      [],
    );

    useImperativeHandle(ref, () => ({
      group: group.current,
      focus: hands.current,
      setClip: (name, timeNorm) => {
        state.current.clip = name;
        state.current.t = timeNorm;
      },
      setCarrying: (carrying) => {
        state.current.carrying = carrying;
        if (carried.current) carried.current.visible = carrying;
      },
    }));

    useFrame(() => {
      const g = group.current;
      if (!g) return;
      const next = clipToPose(
        state.current.clip,
        state.current.t,
        state.current.carrying,
      );
      state.current.pose = lerpPose(state.current.pose, next, 0.35);
      const p = state.current.pose;

      g.position.y = p.root[1];
      // x/z driven externally by timeline
      g.rotation.y = p.rotY;
      if (torso.current) torso.current.rotation.x = p.torsoLean;
      if (armL.current) armL.current.rotation.x = p.armL;
      if (armR.current) armR.current.rotation.x = p.armR;
      if (legL.current) legL.current.rotation.x = p.legL;
      if (legR.current) legR.current.rotation.x = p.legR;
    });

    return (
      <group ref={group} name="worker">
        {/* Legs */}
        <group ref={legL} position={[0.12, 0.55, 0]}>
          <mesh castShadow position={[0, -0.28, 0]} material={mats.pants}>
            <capsuleGeometry args={[0.09, 0.35, 4, 8]} />
          </mesh>
          <mesh castShadow position={[0, -0.55, 0.05]} material={mats.shoes}>
            <boxGeometry args={[0.16, 0.1, 0.28]} />
          </mesh>
        </group>
        <group ref={legR} position={[-0.12, 0.55, 0]}>
          <mesh castShadow position={[0, -0.28, 0]} material={mats.pants}>
            <capsuleGeometry args={[0.09, 0.35, 4, 8]} />
          </mesh>
          <mesh castShadow position={[0, -0.55, 0.05]} material={mats.shoes}>
            <boxGeometry args={[0.16, 0.1, 0.28]} />
          </mesh>
        </group>

        {/* Torso / hoodie */}
        <group ref={torso} position={[0, 1.05, 0]}>
          <mesh castShadow material={mats.hoodie}>
            <capsuleGeometry args={[0.22, 0.45, 6, 12]} />
          </mesh>
          {/* Hood lining visible at collar */}
          <mesh position={[0, 0.32, -0.08]} material={mats.hood}>
            <sphereGeometry args={[0.18, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          </mesh>
          {/* Drawstrings */}
          <mesh position={[0.06, 0.18, 0.2]} material={mats.cord}>
            <cylinderGeometry args={[0.012, 0.012, 0.22, 6]} />
          </mesh>
          <mesh position={[-0.06, 0.18, 0.2]} material={mats.cord}>
            <cylinderGeometry args={[0.012, 0.012, 0.22, 6]} />
          </mesh>
          {/* Head */}
          <mesh castShadow position={[0, 0.52, 0]} material={mats.skin}>
            <sphereGeometry args={[0.14, 16, 16]} />
          </mesh>

          {/* Arms */}
          <group ref={armL} position={[0.28, 0.2, 0]}>
            <mesh castShadow position={[0, -0.22, 0]} material={mats.hoodie}>
              <capsuleGeometry args={[0.07, 0.32, 4, 8]} />
            </mesh>
            <mesh position={[0, -0.45, 0]} material={mats.skin}>
              <sphereGeometry args={[0.055, 10, 10]} />
            </mesh>
          </group>
          <group ref={armR} position={[-0.28, 0.2, 0]}>
            <mesh castShadow position={[0, -0.22, 0]} material={mats.hoodie}>
              <capsuleGeometry args={[0.07, 0.32, 4, 8]} />
            </mesh>
            <mesh position={[0, -0.45, 0]} material={mats.skin}>
              <sphereGeometry args={[0.055, 10, 10]} />
            </mesh>
          </group>

          {/* Focus point (hands) for DoF */}
          <group ref={hands} position={[0, -0.15, 0.35]} />

          {/* Carried box (toggled) */}
          <mesh
            ref={carried}
            visible={false}
            castShadow
            position={[0, -0.05, 0.38]}
            material={mats.box}
          >
            <boxGeometry args={[0.42, 0.32, 0.32]} />
          </mesh>
        </group>
      </group>
    );
  },
);

ProceduralWorker.displayName = "ProceduralWorker";
