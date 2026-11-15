"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  amount: number;
};

export function Dust({ amount }: Props) {
  const ref = useRef<THREE.Points>(null);
  const count = 180;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = Math.random() * 1.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      velocities[i * 3] = 0.8 + Math.random() * 1.4;
      velocities[i * 3 + 1] = 0.05 + Math.random() * 0.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return { positions, velocities };
  }, []);

  useFrame((_, dt) => {
    const pts = ref.current;
    if (!pts || amount < 0.01) return;
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] * dt * amount * 2.2;
      arr[i * 3 + 1] += velocities[i * 3 + 1] * dt * amount;
      arr[i * 3 + 2] += velocities[i * 3 + 2] * dt * amount;
      if (arr[i * 3] > 6) {
        arr[i * 3] = -1 + Math.random();
        arr[i * 3 + 1] = Math.random() * 0.8;
      }
    }
    attr.needsUpdate = true;
    const mat = pts.material as THREE.PointsMaterial;
    mat.opacity = Math.min(0.55, amount * 0.65);
  });

  return (
    <points ref={ref} position={[4, 0.2, 0]} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#d4c4a8"
        size={0.06}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
