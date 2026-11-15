"use client";

import {
  forwardRef,
  Suspense,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ASSETS, type WorkerClip } from "./timeline";
import {
  ProceduralWorker,
  type WorkerHandle,
} from "./procedural/ProceduralWorker";

type Props = {
  useGltf?: boolean;
};

function findClip(
  actions: Record<string, THREE.AnimationAction | null>,
  name: WorkerClip,
): THREE.AnimationAction | null {
  if (actions[name]) return actions[name];
  const lower = name.toLowerCase();
  const key = Object.keys(actions).find((k) => k.toLowerCase().includes(lower));
  return key ? actions[key] : null;
}

function GltfWorker({ onReady }: { onReady: (h: WorkerHandle) => void }) {
  const group = useRef<THREE.Group>(null);
  const focus = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(ASSETS.worker);
  const { actions, mixer } = useAnimations(animations, group);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  const active = useRef<{
    action: THREE.AnimationAction | null;
    clip: WorkerClip | null;
  }>({ action: null, clip: null });

  useEffect(() => {
    Object.values(actions).forEach((a) => {
      if (!a) return;
      a.enabled = true;
      a.setEffectiveWeight(1);
      a.paused = true;
      a.play();
    });

    onReady({
      group: group.current,
      focus: focus.current,
      setClip: (name, timeNorm) => {
        const next = name ? findClip(actions, name) : null;
        if (active.current.action && active.current.action !== next) {
          active.current.action.setEffectiveWeight(0);
        }
        if (next) {
          const dur = next.getClip().duration || 1;
          next.setEffectiveWeight(1);
          next.paused = true;
          next.time = THREE.MathUtils.clamp(timeNorm, 0, 1) * dur;
          next.play();
        }
        active.current = { action: next, clip: name };
        mixer.update(0);
      },
      setCarrying: () => {
        /* mesh visibility handled by clip / Boxes */
      },
    });
  }, [actions, mixer, onReady]);

  useFrame(() => {
    mixer.update(0);
  });

  return (
    <group ref={group}>
      <primitive object={clone} />
      <group ref={focus} position={[0, 1.1, 0.35]} />
    </group>
  );
}

export const Worker = forwardRef<WorkerHandle, Props>(function Worker(
  { useGltf },
  ref,
) {
  const procedural = useRef<WorkerHandle>(null);
  const [gltfHandle, setGltfHandle] = useState<WorkerHandle | null>(null);

  useImperativeHandle(ref, () => {
    if (useGltf && gltfHandle) return gltfHandle;
    return {
      group: procedural.current?.group ?? null,
      focus: procedural.current?.focus ?? null,
      setClip: (name, t) => procedural.current?.setClip(name, t),
      setCarrying: (c) => procedural.current?.setCarrying(c),
    };
  }, [useGltf, gltfHandle]);

  if (useGltf) {
    return (
      <Suspense fallback={<ProceduralWorker ref={procedural} />}>
        <GltfWorker onReady={setGltfHandle} />
      </Suspense>
    );
  }

  return <ProceduralWorker ref={procedural} />;
});

Worker.displayName = "Worker";
