// components/ui/TempleViewer.tsx
"use client";

import React, { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Stage,
  ContactShadows,
  Html,
} from "@react-three/drei";

/** Modern overlay loader shown while model loads.
 * purely presentational — no hooks that update state during render.
 */
function OverlayLoader({ text = "Loading model…" }: { text?: string }) {
  return (
    <div
      aria-hidden={false}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 80,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 16px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* Animated circular spinner */}
        <svg
          viewBox="0 0 50 50"
          style={{ width: 36, height: 36, display: "block", flex: "0 0 36px" }}
        >
          <defs>
            <linearGradient id="g" x1="1" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
          <circle
            cx="25"
            cy="25"
            r="18"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="25"
            cy="25"
            r="18"
            stroke="url(#g)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="90"
            strokeDashoffset="60"
            fill="none"
            style={{ transformOrigin: "50% 50%", animation: "spin 1s linear infinite" }}
          />
        </svg>

        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{text}</div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        `}</style>
      </div>
    </div>
  );
}

/** Fiery glow texture (client-only). Guarded for SSR safety. */
function useFieryGlowTexture(): THREE.Texture | null {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;

    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, "rgba(255,247,160,1)");
    g.addColorStop(0.2, "rgba(255,200,90,0.98)");
    g.addColorStop(0.45, "rgba(255,140,40,0.95)");
    g.addColorStop(0.75, "rgba(220,40,20,0.4)");
    g.addColorStop(1, "rgba(220,40,20,0)");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    // subtle speckles
    for (let i = 0; i < 800; i++) {
      const a = Math.random() * Math.PI * 2;
      const rad = Math.pow(Math.random(), 1.6) * r;
      const x = cx + Math.cos(a) * rad;
      const y = cy + Math.sin(a) * rad;
      const alpha = Math.random() * 0.05;
      ctx.fillStyle = `rgba(255,${Math.floor(120 - Math.random() * 60)},${Math.floor(
        50 - Math.random() * 30
      )},${alpha})`;
      ctx.fillRect(x, y, 1, 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    // compatibility with three versions
    const SRGB = (THREE as any).SRGBColorSpace ?? (THREE as any).sRGBEncoding ?? undefined;
    if (SRGB !== undefined) {
      if ((tex as any).colorSpace !== undefined) (tex as any).colorSpace = SRGB;
      else (tex as any).encoding = SRGB;
    }
    tex.needsUpdate = true;
    return tex;
  }, []);
}

/** Temple model loader — calls onReady once when scene is attached */
function TempleModel({
  path,
  sceneRef,
  onReady,
}: {
  path: string;
  sceneRef: React.MutableRefObject<THREE.Object3D | null>;
  onReady?: () => void;
}) {
  const gltf = useGLTF(path) as any;
  const signaledRef = useRef(false);

  useEffect(() => {
    if (gltf?.scene) {
      sceneRef.current = gltf.scene;
      if (onReady && !signaledRef.current) {
        // call onReady in microtask to ensure we're not updating during render lifecycle of other components
        Promise.resolve().then(() => {
          signaledRef.current = true;
          onReady();
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf, sceneRef.current]);

  return gltf?.scene ? <primitive object={gltf.scene} /> : null;
}

/** Small FitAndCenter helper (unchanged concept) */
function FitAndCenter({
  sceneRef,
  onComputed,
  targetSize = 2,
}: {
  sceneRef: React.MutableRefObject<THREE.Object3D | null>;
  onComputed: (v: { glowZ: number; modelScale: number; center: THREE.Vector3 }) => void;
  targetSize?: number;
}) {
  const { camera } = useThree();

  useEffect(() => {
    const obj = sceneRef.current;
    if (!obj) return;
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.0001);
    const scale = targetSize / maxDim;
    obj.scale.setScalar(scale);

    const sbox = new THREE.Box3().setFromObject(obj);
    const scenter = sbox.getCenter(new THREE.Vector3());
    obj.position.x += -scenter.x;
    obj.position.y += -scenter.y;
    obj.position.z += -scenter.z;

    const finalBox = new THREE.Box3().setFromObject(obj);
    const finalSize = finalBox.getSize(new THREE.Vector3());
    const finalCenter = finalBox.getCenter(new THREE.Vector3());

    const camToOrigin = new THREE.Vector3(0, 0, 0).sub(camera.position).normalize();
    const padding = Math.max(finalSize.z * 0.8, 0.8);
    const glowDirection = camToOrigin.clone().negate();
    const glowDistance = Math.max(finalSize.length(), targetSize) * 1.6 + padding;
    const glowPos = glowDirection.clone().multiplyScalar(glowDistance);

    const fov = (camera.fov * Math.PI) / 180;
    const cameraDistance =
      Math.abs(Math.max(finalSize.x, finalSize.y, finalSize.z) / (2 * Math.tan(fov / 2))) *
      1.8;
    camera.position.set(cameraDistance * 0.9, cameraDistance * 0.6, cameraDistance * 0.9);
    camera.near = 0.01;
    camera.far = Math.max(1000, cameraDistance * 10);
    camera.updateProjectionMatrix();

    onComputed({
      glowZ: glowPos.z,
      modelScale: scale,
      center: finalCenter,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneRef.current]);

  return null;
}

/** Glow plane (faces camera) */
function GlowPlane({
  texture,
  position,
  scale = 3,
  visible = true,
}: {
  texture: THREE.Texture | null;
  position: THREE.Vector3;
  scale?: number | [number, number, number];
  visible?: boolean;
}) {
  const ref = useRef<THREE.Mesh | null>(null);
  const { camera } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.lookAt(camera.position.x, camera.position.y, camera.position.z);
  });
  if (!texture) return null;
  const posArr = [position.x, position.y, position.z] as [number, number, number];
  return (
    <mesh
      ref={ref}
      position={posArr}
      scale={Array.isArray(scale) ? (scale as [number, number, number]) : [scale, scale, 1]}
      renderOrder={0}
      visible={visible}
    >
      <planeGeometry args={[1.0, 1.0, 1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        depthTest
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        opacity={1.0}
      />
    </mesh>
  );
}

/** Simple starfield points for night */
function Starfield({ count = 700, radius = 24 }: { count?: number; radius?: number }) {
  const geomRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.PointsMaterial | null>(null);

  const [positions] = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = radius * (0.6 + Math.random() * 0.4);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      arr[i * 3 + 0] = x;
      arr[i * 3 + 1] = y + 2.6;
      arr[i * 3 + 2] = z;
    }
    return arr;
  });

  useFrame(() => {
    if (!materialRef.current) return;
    const t = (Date.now() % 60000) / 60000;
    materialRef.current.size = 0.012 + Math.sin(t * Math.PI * 2) * 0.006;
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef as any}
        size={0.01}
        sizeAttenuation
        transparent
        opacity={0.95}
      />
    </points>
  );
}

/** Moon visual */
function Moon({ position = [6, 5, -6], radius = 0.55 }: { position?: [number, number, number]; radius?: number }) {
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.0008;
  });
  return (
    <mesh ref={ref} position={position as any} renderOrder={1}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial emissive={"#f8f4e6"} emissiveIntensity={1.0} roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

/** TempleViewer component */
export default function TempleViewer({ modelPath = "/about/temple.glb" }: { modelPath?: string }) {
  const sceneRef = useRef<THREE.Object3D | null>(null);
  const [glowPos, setGlowPos] = useState(new THREE.Vector3(0, 1.0, -3));
  const [glowScale, setGlowScale] = useState<number>(3.2);
  const glowTex = useFieryGlowTexture();

  // Loading state — will be set to true once TempleModel signals ready
  const [isLoaded, setIsLoaded] = useState(false);

  // Day/Night mode
  const [mode, setMode] = useState<"day" | "night">("day");
  const toggleMode = () => setMode((m) => (m === "day" ? "night" : "day"));

  // lighting presets
  const ambientIntensity = mode === "day" ? 0.55 : 0.18;
  const pointLightIntensity = mode === "day" ? 1.2 : 0.18;
  const moonLightIntensity = mode === "night" ? 0.95 : 0;

  const containerBg = mode === "day"
    ? "linear-gradient(180deg, #fff7ef 0%, #ffe6d6 30%, #ffd0bf 60%, #ffb79a 100%)"
    : "linear-gradient(180deg,#02040a 0%,#071026 30%,#0b2440 60%,#081726 100%)";
  const canvasBg = mode === "day" ? "#fff2ea" : "#04041a";

  return (
    <div
      className="w-full min-w-0 flex justify-center items-center relative"
      style={{
        background: containerBg,
        height: "min(75vh, 820px)",
        minHeight: 480,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Toggle pill (top-right) */}
      <div
        style={{
          position: "absolute",
          right: 18,
          top: 18,
          zIndex: 70,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          role="button"
          aria-label="Toggle day/night"
          onClick={toggleMode}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleMode(); }}
          style={{
            userSelect: "none",
            cursor: "pointer",
            padding: 6,
            borderRadius: 20,
            background: mode === "day" ? "rgba(255,255,255,0.9)" : "rgba(8,12,20,0.7)",
            boxShadow: "0 8px 30px rgba(2,6,23,0.12)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "background 240ms ease",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 999, background: mode === "day" ? "#fde68a" : "transparent", transition: "background 240ms" }}>
            View Day
          </div>
          <div style={{ width: 1, height: 28, background: "rgba(0,0,0,0.06)" }} />
          <div style={{ fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 999, background: mode === "night" ? "#1e293b" : "transparent", color: mode === "night" ? "#fff" : undefined }}>
            View Night
          </div>

          {/* sliding knob to indicate mode */}
          <div style={{ position: "relative", marginLeft: 8 }}>
            <div style={{ width: 36, height: 22, borderRadius: 999, background: mode === "day" ? "#fff7ed" : "#0f172a", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: mode === "day" ? "#f97316" : "#60a5fa",
                  transform: `translateX(${mode === "day" ? "4px" : "14px"})`,
                  transition: "transform 220ms ease, background 220ms",
                  margin: 2,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <Canvas
        shadows
        style={{ width: "100%", height: "100%", display: "block", maxWidth: 1200 }}
        camera={{ position: [3.0, 2.6, 4.2], fov: 40 }}
      >
        {/* background color */}
        <color attach="background" args={[canvasBg]} />

        {/* Suspense: keep fallback null to avoid nested setState-on-render errors */}
        <Suspense fallback={null}>
          <ambientLight intensity={ambientIntensity} />
          <pointLight color={mode === "day" ? "#ffb84d" : "#c9dfff"} intensity={pointLightIntensity} position={[0, 1.6, -2.5]} distance={10} decay={2} />
          <directionalLight color={mode === "day" ? "#fff3e6" : "#cfe6ff"} intensity={mode === "day" ? 0.6 : 0.12} position={[4, 6, 4]} />

          {mode === "night" && (
            <>
              <directionalLight color={"#dbeeff"} intensity={moonLightIntensity} position={[-6, 9, 2]} />
              <Moon position={[6, 5, -6]} radius={0.55} />
              <Starfield count={800} radius={28} />
            </>
          )}

          <Stage environment={mode === "day" ? "city" : "studio"} intensity={mode === "day" ? 0.45 : 0.18} contactShadow shadows adjustCamera={false}>
            <TempleModel
              path={modelPath}
              sceneRef={sceneRef}
              onReady={() => {
                // mark loaded once model attached
                setIsLoaded(true);
              }}
            />
          </Stage>

          <FitAndCenter
            sceneRef={sceneRef}
            targetSize={4.2}
            onComputed={({ glowZ, modelScale }) => {
              setGlowPos(new THREE.Vector3(0, 0.9 * modelScale, glowZ));
              setGlowScale(Math.max(3.2, modelScale * 3.0));
            }}
          />

          <GlowPlane texture={glowTex} position={glowPos} scale={mode === "day" ? glowScale : glowScale * 0.5} visible={!!glowTex} />

          <ContactShadows position={[0, -0.8, 0]} opacity={mode === "day" ? 0.6 : 0.28} width={3.5} blur={2} far={1.2} />

          <OrbitControls
            enablePan={false}
            enableZoom
            autoRotate
            autoRotateSpeed={0.55}
            maxPolarAngle={Math.PI / 1.2}
            minPolarAngle={Math.PI / 12}
            minDistance={0.8}
            maxDistance={18}
            enableDamping
            dampingFactor={0.08}
          />
        </Suspense>
      </Canvas>

      {/* Overlay loader: visible until model signals ready */}
      {!isLoaded && <OverlayLoader text="Loading model..." />}
    </div>
  );
}
