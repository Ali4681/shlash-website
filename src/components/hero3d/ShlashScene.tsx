"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  DepthOfField,
  SMAA,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { Ground } from "./Ground";
import { Truck } from "./Truck";
import { Worker } from "./Worker";
import { Boxes } from "./Boxes";
import { Dust } from "./Dust";
import { Loader } from "./Loader";
import { SafeEnvironment } from "./SafeEnvironment";
import type { BoxesHandle } from "./Boxes";
import type { TruckHandle } from "./procedural/ProceduralTruck";
import type { WorkerHandle } from "./procedural/ProceduralWorker";
import type { TimelineDrivers } from "./useScrollTimeline";

type Props = {
  driversRef: React.MutableRefObject<TimelineDrivers>;
  isMobile: boolean;
  useGltf: boolean;
  onLoaded?: () => void;
};

function CameraRig({
  driversRef,
}: {
  driversRef: React.MutableRefObject<TimelineDrivers>;
}) {
  const { camera } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = 42;
    cam.near = 0.1;
    cam.far = 80;
    cam.position.set(0.2, 3.6, 8.5);
    cam.lookAt(0.4, 1, 0);
    driversRef.current.camera = cam;
    driversRef.current.cameraTarget = new THREE.Vector3(0.4, 1, 0);
  }, [camera, driversRef]);

  return null;
}

function SceneContent({
  driversRef,
  isMobile,
  useGltf,
}: {
  driversRef: React.MutableRefObject<TimelineDrivers>;
  isMobile: boolean;
  useGltf: boolean;
}) {
  const truckRef = useRef<TruckHandle>(null);
  const workerRef = useRef<WorkerHandle>(null);
  const boxesRef = useRef<BoxesHandle>(null);
  const [dust, setDust] = useState(0);
  const [focus, setFocus] = useState(() => new THREE.Vector3(0, 1.1, 0));

  const setDustStable = useCallback((n: number) => setDust(n), []);
  const setFocusStable = useCallback((v: THREE.Vector3) => setFocus(v.clone()), []);

  useEffect(() => {
    driversRef.current.truck = truckRef.current;
    driversRef.current.worker = workerRef.current;
    driversRef.current.boxes = boxesRef.current;
    driversRef.current.setDust = setDustStable;
    driversRef.current.setFocus = setFocusStable;
  });

  // Keep refs fresh each frame for the scroll driver
  useEffect(() => {
    let id = 0;
    const sync = () => {
      driversRef.current.truck = truckRef.current;
      driversRef.current.worker = workerRef.current;
      driversRef.current.boxes = boxesRef.current;
      id = requestAnimationFrame(sync);
    };
    id = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(id);
  }, [driversRef]);

  return (
    <>
      <CameraRig driversRef={driversRef} />

      <color attach="background" args={["#1a140e"]} />
      <fog attach="fog" args={["#1a140e", 14, 38]} />

      <ambientLight intensity={0.22} color="#ffd2a8" />
      <directionalLight
        castShadow
        position={[6.5, 9.5, 4.5]}
        intensity={2.15}
        color="#ffb46a"
        shadow-mapSize={[isMobile ? 1024 : 2048, isMobile ? 1024 : 2048]}
        shadow-camera-near={1}
        shadow-camera-far={28}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.00025}
      />
      <hemisphereLight args={["#9ec9ff", "#3a2a18", 0.35]} />

      <SafeEnvironment />

      <Ground />
      <Truck ref={truckRef} useGltf={useGltf} />
      <Worker ref={workerRef} useGltf={useGltf} />
      <Boxes ref={boxesRef} useGltf={useGltf} />
      <Dust amount={dust} />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.45}
        scale={22}
        blur={2.4}
        far={8}
        resolution={isMobile ? 256 : 512}
        color="#0c0d42"
      />

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={0.28}
          luminanceThreshold={0.82}
          luminanceSmoothing={0.35}
          mipmapBlur
        />
        <Vignette offset={0.28} darkness={0.55} />
        {!isMobile && (
          <DepthOfField
            focusDistance={0}
            focalLength={0.035}
            bokehScale={2.2}
            target={focus}
          />
        )}
        <SMAA />
      </EffectComposer>

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  );
}

export function ShlashScene({
  driversRef,
  isMobile,
  useGltf,
  onLoaded,
}: Props) {
  const dpr = useMemo<[number, number]>(
    () => (isMobile ? [1, 1.25] : [1, 1.75]),
    [isMobile],
  );

  return (
    <div className="hero3d-canvas">
      <Canvas
        shadows
        dpr={dpr}
        gl={{
          antialias: !isMobile,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          alpha: false,
        }}
        camera={{ fov: 42, near: 0.1, far: 80, position: [0.2, 3.6, 8.5] }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Suspense fallback={null}>
          <SceneContent
            driversRef={driversRef}
            isMobile={isMobile}
            useGltf={useGltf}
          />
        </Suspense>
      </Canvas>
      <Loader onReady={onLoaded} />
    </div>
  );
}
