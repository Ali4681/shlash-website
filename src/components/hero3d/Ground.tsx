"use client";

import { MeshReflectorMaterial } from "@react-three/drei";

export function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          blur={[300, 80]}
          resolution={512}
          mixBlur={0.85}
          mixStrength={0.35}
          roughness={0.92}
          depthScale={0.6}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color="#3a342c"
          metalness={0.15}
          mirror={0.12}
        />
      </mesh>

      {/* Warehouse wall suggestion */}
      <mesh position={[0, 3.2, -8]} receiveShadow castShadow>
        <boxGeometry args={[28, 6.5, 0.4]} />
        <meshStandardMaterial color="#6a6358" roughness={0.95} />
      </mesh>
      <mesh position={[-10, 2.5, -2]} receiveShadow castShadow>
        <boxGeometry args={[0.35, 5, 12]} />
        <meshStandardMaterial color="#5c564c" roughness={0.95} />
      </mesh>

      {/* Warm asphalt strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.5, 0.01, 2]} receiveShadow>
        <planeGeometry args={[8, 14]} />
        <meshStandardMaterial color="#2c2924" roughness={0.98} metalness={0.05} />
      </mesh>
    </group>
  );
}
