"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Decal } from "@react-three/drei";
import * as THREE from "three";
import { ASSETS, NODE_NAMES, SCENE } from "../timeline";

export type TruckHandle = {
  group: THREE.Group | null;
  doors: {
    left: THREE.Object3D | null;
    right: THREE.Object3D | null;
    cab: THREE.Object3D | null;
  };
  wheels: THREE.Object3D[];
  cargoInterior: THREE.Object3D | null;
};

type Props = {
  logoMap: THREE.Texture | null;
};

const blue = "#0443B2";
const navy = "#0C0D42";
const orange = "#FF6600";
const metal = "#2a2f3a";

export const ProceduralTruck = forwardRef<TruckHandle, Props>(
  function ProceduralTruck({ logoMap }, ref) {
    const group = useRef<THREE.Group>(null);
    const doorL = useRef<THREE.Group>(null);
    const doorR = useRef<THREE.Group>(null);
    const cabDoor = useRef<THREE.Group>(null);
    const wheels = useRef<THREE.Object3D[]>([]);
    const cargo = useRef<THREE.Group>(null);

    const materials = useMemo(
      () => ({
        body: new THREE.MeshStandardMaterial({
          color: blue,
          metalness: 0.35,
          roughness: 0.42,
        }),
        cabin: new THREE.MeshStandardMaterial({
          color: navy,
          metalness: 0.4,
          roughness: 0.38,
        }),
        accent: new THREE.MeshStandardMaterial({
          color: orange,
          metalness: 0.2,
          roughness: 0.55,
        }),
        rubber: new THREE.MeshStandardMaterial({
          color: "#111114",
          metalness: 0.1,
          roughness: 0.9,
        }),
        chrome: new THREE.MeshStandardMaterial({
          color: metal,
          metalness: 0.85,
          roughness: 0.25,
        }),
        glass: new THREE.MeshPhysicalMaterial({
          color: "#9ec9ff",
          metalness: 0,
          roughness: 0.05,
          transmission: 0.55,
          transparent: true,
          opacity: 0.85,
        }),
        wood: new THREE.MeshStandardMaterial({
          color: "#6b4a2e",
          roughness: 0.85,
          metalness: 0.05,
        }),
      }),
      [],
    );

    useImperativeHandle(ref, () => ({
      group: group.current,
      doors: {
        left: doorL.current,
        right: doorR.current,
        cab: cabDoor.current,
      },
      wheels: wheels.current,
      cargoInterior: cargo.current,
    }));

    const registerWheel = (el: THREE.Mesh | null) => {
      if (el && !wheels.current.includes(el)) wheels.current.push(el);
    };

    const logoW = 1.05;
    const logoH = logoW / SCENE.logoAspect;

    return (
      <group ref={group} name="truck" position={SCENE.truck}>
        {/* Chassis */}
        <mesh
          castShadow
          receiveShadow
          position={[0.15, 0.42, 0]}
          material={materials.chrome}
        >
          <boxGeometry args={[4.2, 0.22, 1.9]} />
        </mesh>

        {/* Cargo box */}
        <group ref={cargo} name={NODE_NAMES.cargoBody} position={[-0.35, 1.25, 0]}>
          <mesh castShadow receiveShadow material={materials.body}>
            <boxGeometry args={[2.8, 1.7, 2.05]} />
          </mesh>
          {/* Interior floor */}
          <mesh position={[0, -0.78, 0]} receiveShadow material={materials.wood}>
            <boxGeometry args={[2.55, 0.08, 1.85]} />
          </mesh>
          {/* Open rear — no back wall; doors handle that */}

          {/* Side logo plates (invisible meshes for Decal targets) */}
          <mesh
            name={NODE_NAMES.logoLeft}
            position={[0.1, 0.15, 1.03]}
            rotation={[0, 0, 0]}
            material={materials.body}
          >
            <planeGeometry args={[logoW * 1.15, logoH * 1.15]} />
            {logoMap && (
              <Decal
                position={[0, 0, 0.01]}
                rotation={[0, 0, 0]}
                scale={[logoW, logoH, 0.2]}
                map={logoMap}
                polygonOffsetFactor={-1}
              />
            )}
          </mesh>
          <mesh
            name={NODE_NAMES.logoRight}
            position={[0.1, 0.15, -1.03]}
            rotation={[0, Math.PI, 0]}
            material={materials.body}
          >
            <planeGeometry args={[logoW * 1.15, logoH * 1.15]} />
            {logoMap && (
              <Decal
                position={[0, 0, 0.01]}
                rotation={[0, 0, 0]}
                scale={[logoW, logoH, 0.2]}
                map={logoMap}
                polygonOffsetFactor={-1}
              />
            )}
          </mesh>
        </group>

        {/* Rear doors — pivot at outer edges */}
        <group
          ref={doorL}
          name={NODE_NAMES.doorL}
          position={[-1.74, 1.25, 0.98]}
          rotation={[0, -Math.PI * 0.92, 0]}
        >
          <mesh castShadow position={[0, 0, -0.48]} material={materials.body}>
            <boxGeometry args={[0.08, 1.65, 0.98]} />
          </mesh>
          <mesh position={[0.02, 0.2, -0.75]} material={materials.chrome}>
            <boxGeometry args={[0.04, 0.35, 0.08]} />
          </mesh>
        </group>
        <group
          ref={doorR}
          name={NODE_NAMES.doorR}
          position={[-1.74, 1.25, -0.98]}
          rotation={[0, Math.PI * 0.92, 0]}
        >
          <mesh castShadow position={[0, 0, 0.48]} material={materials.body}>
            <boxGeometry args={[0.08, 1.65, 0.98]} />
          </mesh>
          <mesh position={[0.02, 0.2, 0.75]} material={materials.chrome}>
            <boxGeometry args={[0.04, 0.35, 0.08]} />
          </mesh>
        </group>

        {/* Cab */}
        <group position={[1.55, 0.95, 0]}>
          <mesh castShadow receiveShadow material={materials.cabin}>
            <boxGeometry args={[1.35, 1.25, 1.85]} />
          </mesh>
          <mesh position={[0.35, 0.35, 0]} material={materials.glass}>
            <boxGeometry args={[0.08, 0.55, 1.55]} />
          </mesh>
          <mesh position={[0, 0.38, 0.93]} material={materials.glass}>
            <boxGeometry args={[0.9, 0.5, 0.06]} />
          </mesh>
          <mesh position={[0, -0.55, 0]} material={materials.accent}>
            <boxGeometry args={[1.38, 0.12, 1.88]} />
          </mesh>

          {/* Cab door */}
          <group
            ref={cabDoor}
            name={NODE_NAMES.cabDoor}
            position={[0.15, 0, 0.93]}
            rotation={[0, 0, 0]}
          >
            <mesh castShadow position={[-0.35, 0, 0]} material={materials.cabin}>
              <boxGeometry args={[0.85, 1.15, 0.07]} />
            </mesh>
            <mesh position={[-0.55, 0.15, 0.05]} material={materials.glass}>
              <boxGeometry args={[0.4, 0.4, 0.04]} />
            </mesh>
          </group>
        </group>

        {/* Wheels */}
        {(
          [
            [1.2, 0.38, 0.95, NODE_NAMES.wheelFL],
            [1.2, 0.38, -0.95, NODE_NAMES.wheelFR],
            [-1.15, 0.38, 0.95, NODE_NAMES.wheelRL],
            [-1.15, 0.38, -0.95, NODE_NAMES.wheelRR],
          ] as const
        ).map(([x, y, z, name]) => (
          <mesh
            key={name}
            ref={registerWheel}
            name={name}
            castShadow
            position={[x, y, z]}
            rotation={[0, 0, Math.PI / 2]}
            material={materials.rubber}
          >
            <cylinderGeometry args={[0.38, 0.38, 0.28, 24]} />
          </mesh>
        ))}
      </group>
    );
  },
);

ProceduralTruck.displayName = "ProceduralTruck";
