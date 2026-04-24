"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SIGNAL_DOTS = [
  [-1.55, 0.18, 0.04],
  [-0.92, 0.86, -0.12],
  [-0.18, -0.76, 0.18],
  [0.78, 0.62, -0.18],
  [1.48, -0.08, 0.1],
] as const;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);

    return () => {
      media.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

function SignalScene({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const coreMaterial = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!group.current || reducedMotion) return;

    const time = clock.getElapsedTime();
    const intro = Math.min(time / 5.4, 1);
    const easedIntro = 1 - (1 - intro) ** 3;
    const pulse = Math.sin(time * 1.4) * 0.018;

    group.current.rotation.x = 0.58 - easedIntro * 0.26 + Math.sin(time * 0.16) * 0.035;
    group.current.rotation.y = -0.88 + easedIntro * 0.78 + Math.sin(time * 0.12) * 0.05;
    group.current.rotation.z = -0.12 + easedIntro * 0.18;
    group.current.scale.setScalar(0.78 + easedIntro * 0.22 + pulse);

    if (core.current) {
      core.current.rotation.x = time * 0.16;
      core.current.rotation.y = time * 0.24;
    }

    if (ringA.current) ringA.current.rotation.z = time * 0.08;
    if (ringB.current) ringB.current.rotation.x = Math.PI / 2.8 + time * 0.06;
    if (ringC.current) ringC.current.rotation.y = Math.PI / 2.4 - time * 0.05;

    if (coreMaterial.current) {
      coreMaterial.current.opacity = 0.18 + easedIntro * 0.28;
    }
  });

  return (
    <group ref={group} position={[0.5, 0.08, 0]}>
      <mesh ref={ringA}>
        <torusGeometry args={[1.55, 0.008, 8, 160]} />
        <meshBasicMaterial color="#8fa8ff" transparent opacity={0.44} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2.8, 0, 0.26]}>
        <torusGeometry args={[1.15, 0.006, 8, 140]} />
        <meshBasicMaterial color="#74d995" transparent opacity={0.28} />
      </mesh>
      <mesh ref={ringC} rotation={[0.18, Math.PI / 2.4, 0]}>
        <torusGeometry args={[1.86, 0.005, 8, 180]} />
        <meshBasicMaterial color="#f2eee7" transparent opacity={0.22} />
      </mesh>

      <mesh ref={core}>
        <icosahedronGeometry args={[0.66, 1]} />
        <meshStandardMaterial
          ref={coreMaterial}
          color="#c8d6ff"
          emissive="#1a5cff"
          emissiveIntensity={0.16}
          metalness={0.16}
          opacity={reducedMotion ? 0.36 : 0.18}
          roughness={0.5}
          transparent
          wireframe
        />
      </mesh>

      {SIGNAL_DOTS.map(([x, y, z], index) => (
        <mesh key={`${x}-${y}-${z}`} position={[x, y, z]}>
          <sphereGeometry args={[index === 2 ? 0.055 : 0.044, 18, 18]} />
          <meshBasicMaterial color={index % 2 === 0 ? "#9ab8ff" : "#74d995"} transparent opacity={0.78} />
        </mesh>
      ))}
    </group>
  );
}

export function HeroIntroVisual() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="hero-intro-visual" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.4], fov: 42 }}
        dpr={[1, 1.35]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.82} />
        <pointLight intensity={1.45} position={[2.6, 2.4, 3.8]} />
        <SignalScene reducedMotion={reducedMotion} />
      </Canvas>
      <div className="hero-intro-grid" />
    </div>
  );
}
