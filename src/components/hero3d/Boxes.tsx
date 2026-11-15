"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  Suspense,
} from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ASSETS, BOX_COUNT, SCENE } from "./timeline";

export type BoxesHandle = {
  palletBoxes: THREE.Group[];
  cargoSlots: THREE.Group[];
  setLoadedCount: (n: number) => void;
  getCarryProxy: () => THREE.Object3D | null;
};

type Props = {
  useGltf?: boolean;
};

const palletPositions: [number, number, number][] = [
  [-0.28, 0.22, -0.28],
  [0.28, 0.22, -0.28],
  [-0.28, 0.22, 0.28],
  [0.28, 0.22, 0.28],
  [-0.28, 0.55, -0.12],
  [0.28, 0.55, -0.12],
  [-0.28, 0.55, 0.28],
  [0.28, 0.55, 0.28],
];

/** Stack order inside the truck cargo bay (local to truck cargo). */
const cargoPositions: [number, number, number][] = [
  [-0.55, 0.2, 0.45],
  [-0.55, 0.2, 0],
  [-0.55, 0.2, -0.45],
  [-0.05, 0.2, 0.45],
  [-0.05, 0.2, 0],
  [-0.05, 0.2, -0.45],
  [0.4, 0.2, 0.25],
  [0.4, 0.2, -0.25],
];

function CardboardBox({
  position,
  visible = true,
}: {
  position: [number, number, number];
  visible?: boolean;
}) {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c4a574",
        roughness: 0.88,
        metalness: 0.02,
      }),
    [],
  );
  const tape = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e8d9a8",
        roughness: 0.7,
      }),
    [],
  );

  return (
    <group position={position} visible={visible}>
      <mesh castShadow receiveShadow material={mat}>
        <boxGeometry args={[0.48, 0.36, 0.4]} />
      </mesh>
      <mesh position={[0, 0.185, 0]} material={tape}>
        <boxGeometry args={[0.5, 0.03, 0.12]} />
      </mesh>
      <mesh position={[0, 0, 0.205]} material={tape}>
        <boxGeometry args={[0.12, 0.08, 0.01]} />
      </mesh>
    </group>
  );
}

function GltfBox({
  position,
  visible = true,
}: {
  position: [number, number, number];
  visible?: boolean;
}) {
  const { scene } = useGLTF(ASSETS.box);
  const clone = useMemo(() => scene.clone(true), [scene]);
  return (
    <group position={position} visible={visible}>
      <primitive object={clone} scale={0.45} />
    </group>
  );
}

function BoxInstance({
  position,
  visible,
  useGltf,
}: {
  position: [number, number, number];
  visible: boolean;
  useGltf?: boolean;
}) {
  if (useGltf) {
    return (
      <Suspense fallback={<CardboardBox position={position} visible={visible} />}>
        <GltfBox position={position} visible={visible} />
      </Suspense>
    );
  }
  return <CardboardBox position={position} visible={visible} />;
}

export const Boxes = forwardRef<BoxesHandle, Props>(function Boxes(
  { useGltf },
  ref,
) {
  const palletRefs = useRef<(THREE.Group | null)[]>([]);
  const cargoRefs = useRef<(THREE.Group | null)[]>([]);
  const carry = useRef<THREE.Group>(null);
  const loaded = useRef(0);

  useImperativeHandle(ref, () => ({
    palletBoxes: palletRefs.current.filter(Boolean) as THREE.Group[],
    cargoSlots: cargoRefs.current.filter(Boolean) as THREE.Group[],
    setLoadedCount: (n: number) => {
      loaded.current = n;
      for (let i = 0; i < BOX_COUNT; i++) {
        const p = palletRefs.current[i];
        const c = cargoRefs.current[i];
        if (p) p.visible = i >= n;
        if (c) c.visible = i < n;
      }
      if (carry.current) carry.current.visible = false;
    },
    getCarryProxy: () => carry.current,
  }));

  return (
    <group>
      {/* Pallet */}
      <group position={SCENE.pallet}>
        <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
          <boxGeometry args={[1.15, 0.12, 1.05]} />
          <meshStandardMaterial color="#8b6914" roughness={0.9} />
        </mesh>
        {[-0.4, 0, 0.4].map((z) => (
          <mesh key={z} position={[0, 0.02, z]} castShadow>
            <boxGeometry args={[1.1, 0.06, 0.1]} />
            <meshStandardMaterial color="#6e5210" roughness={0.92} />
          </mesh>
        ))}

        {palletPositions.map((pos, i) => (
          <group
            key={`p-${i}`}
            ref={(el) => {
              palletRefs.current[i] = el;
            }}
          >
            <BoxInstance position={pos} visible useGltf={useGltf} />
          </group>
        ))}
      </group>

      {/* Cargo stack (parented near truck cargo origin) */}
      <group position={[SCENE.truck[0] - 0.35, 0.55, SCENE.truck[2]]}>
        {cargoPositions.map((pos, i) => (
          <group
            key={`c-${i}`}
            ref={(el) => {
              cargoRefs.current[i] = el;
            }}
            visible={false}
          >
            <BoxInstance position={pos} visible useGltf={useGltf} />
          </group>
        ))}
      </group>

      {/* Invisible carry proxy (timeline can toggle) */}
      <group ref={carry} visible={false}>
        <CardboardBox position={[0, 0, 0]} />
      </group>
    </group>
  );
});

Boxes.displayName = "Boxes";
