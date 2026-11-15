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
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  ASSETS,
  NODE_ALIASES,
  NODE_NAMES,
  SCENE,
} from "./timeline";
import {
  ProceduralTruck,
  type TruckHandle,
} from "./procedural/ProceduralTruck";

type Props = {
  useGltf?: boolean;
};

function resolveNode(
  nodes: Record<string, THREE.Object3D>,
  canonical: string,
): THREE.Object3D | null {
  if (nodes[canonical]) return nodes[canonical];
  for (const [alias, target] of Object.entries(NODE_ALIASES)) {
    if (target === canonical && nodes[alias]) return nodes[alias];
  }
  // Fuzzy: case-insensitive contains
  const lower = canonical.toLowerCase();
  const hit = Object.keys(nodes).find((k) => k.toLowerCase().includes(lower));
  return hit ? nodes[hit] : null;
}

function collectWheels(root: THREE.Object3D): THREE.Object3D[] {
  const wheels: THREE.Object3D[] = [];
  const names = [
    NODE_NAMES.wheelFL,
    NODE_NAMES.wheelFR,
    NODE_NAMES.wheelRL,
    NODE_NAMES.wheelRR,
  ];
  root.traverse((obj) => {
    const n = obj.name.toLowerCase();
    if (
      names.some((w) => n.includes(w.toLowerCase())) ||
      (n.includes("wheel") && !n.includes("well"))
    ) {
      wheels.push(obj);
    }
  });
  return wheels;
}

function GltfTruck({
  logoMap,
  onReady,
}: {
  logoMap: THREE.Texture | null;
  onReady: (handle: TruckHandle) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const gltf = useGLTF(ASSETS.truck) as unknown as {
    scene: THREE.Group;
    nodes: Record<string, THREE.Object3D>;
  };

  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return clone;
  }, [gltf.scene]);

  const nodes = useMemo(() => {
    const map: Record<string, THREE.Object3D> = { ...gltf.nodes };
    scene.traverse((obj) => {
      if (obj.name) map[obj.name] = obj;
    });
    return map;
  }, [gltf.nodes, scene]);

  const doorL = resolveNode(nodes, NODE_NAMES.doorL);
  const doorR = resolveNode(nodes, NODE_NAMES.doorR);
  const cab = resolveNode(nodes, NODE_NAMES.cabDoor);
  const cargo =
    resolveNode(nodes, NODE_NAMES.cargoBody) ??
    resolveNode(nodes, "Cargo") ??
    scene;

  const wheels = useMemo(() => collectWheels(scene), [scene]);

  useEffect(() => {
    // Start with rear doors open
    if (doorL) doorL.rotation.y = -Math.PI * 0.92;
    if (doorR) doorR.rotation.y = Math.PI * 0.92;
    if (cab) cab.rotation.y = 0;

    onReady({
      group: group.current,
      doors: { left: doorL, right: doorR, cab },
      wheels,
      cargoInterior: cargo,
    });
  }, [doorL, doorR, cab, cargo, wheels, onReady]);

  const logoW = 1.05;
  const logoH = logoW / SCENE.logoAspect;

  return (
    <group ref={group} position={SCENE.truck}>
      <primitive object={scene} />
      {logoMap && cargo && (
        <>
          <mesh position={[0.1, 1.35, 1.05]} rotation={[0, 0, 0]}>
            <planeGeometry args={[0.01, 0.01]} />
            <meshBasicMaterial transparent opacity={0} />
            <Decal
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={[logoW, logoH, 0.25]}
              map={logoMap}
              polygonOffsetFactor={-1}
            />
          </mesh>
          <mesh position={[0.1, 1.35, -1.05]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.01, 0.01]} />
            <meshBasicMaterial transparent opacity={0} />
            <Decal
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={[logoW, logoH, 0.25]}
              map={logoMap}
              polygonOffsetFactor={-1}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

export const Truck = forwardRef<TruckHandle, Props>(function Truck(
  { useGltf },
  ref,
) {
  const procedural = useRef<TruckHandle>(null);
  const [gltfHandle, setGltfHandle] = useState<TruckHandle | null>(null);

  const logoMap = useTexture(ASSETS.logo, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.flipY = false;
  });

  // Preserve aspect — never stretch
  useEffect(() => {
    if (!logoMap) return;
    logoMap.colorSpace = THREE.SRGBColorSpace;
  }, [logoMap]);

  useImperativeHandle(ref, () => {
    if (useGltf && gltfHandle) return gltfHandle;
    return {
      group: procedural.current?.group ?? null,
      doors: procedural.current?.doors ?? {
        left: null,
        right: null,
        cab: null,
      },
      wheels: procedural.current?.wheels ?? [],
      cargoInterior: procedural.current?.cargoInterior ?? null,
    };
  }, [useGltf, gltfHandle]);

  if (useGltf) {
    return (
      <Suspense fallback={<ProceduralTruck ref={procedural} logoMap={logoMap} />}>
        <GltfTruck logoMap={logoMap} onReady={setGltfHandle} />
      </Suspense>
    );
  }

  return <ProceduralTruck ref={procedural} logoMap={logoMap} />;
});

Truck.displayName = "Truck";
