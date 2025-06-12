'use client';
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Text } from "@react-three/drei";
import * as THREE from "three";

export default function RotatingBox() {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta * 0.5;
    }
    if (textRef.current) {
      textRef.current.rotation.y += delta * 0.3;
      textRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const {viewport} = useThree();

  //  const materialProps = useControls({
  //   meshPhysicalMaterial: false,
  //   transmissionSampler: false,
  //   backside: true,
  //   backsideThickness: { value: 2, min: -10, max: 10 },
  //   samples: { value: 10, min: 0, max: 32, step: 1 },
  //   resolution: { value: 2048, min: 256, max: 2048, step: 256 },
  //   backsideResolution: { value: 1024, min: 32, max: 2048, step: 256 },
  //   transmission: { value: 1, min: 0, max: 1 },
  //   roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
  //   ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
  //   thickness: { value: 0.25, min: 0, max: 10, step: 0.01 },
  //   chromaticAberration: { value: 0.4, min: 0, max: 1 },
  //   anisotropy: { value: 0.3, min: 0, max: 1, step: 0.01 },
  //   distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
  //   distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
  //   temporalDistortion: { value: 0.65, min: 0, max: 1, step: 0.01 },
  //   attenuationDistance: { value: 0.5, min: 0, max: 2.5, step: 0.01 },
  //   clearcoat: { value: 0, min: 0, max: 1 },
  //   attenuationColor: '#ffffff',
  //   color: 'white'
  // })

  const materialProps = {
    meshPhysicalMaterial: false,
    transmissionSampler: false,
    backside: true,
    backsideThickness: 2,
    samples: 10,
    resolution: 2048,
    backsideResolution: 1024,
    transmission: 1,
    roughness: 0.0,
    ior: 1.5,
    thickness: 0.25,
    chromaticAberration: 0.4,
    anisotropy: 0.3,
    distortion: 0.0,
    distortionScale: 0.3,
    temporalDistortion: 0.65,
    attenuationDistance: 0.5,
    clearcoat: 0,
    attenuationColor: '#ffffff',
    color: 'white'
  }

  return (
    <group scale={viewport.width / 5}>
      {/* <Text 
        position={[0, 0, 0.8]} 
        fontSize={0.3} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
        letterSpacing={0.02}
        maxWidth={2}
        textAlign="center"
      >
        COMING SOON
      </Text> */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[7, 2]} />
        <meshBasicMaterial map={new THREE.TextureLoader().load('/git.png')} />
      </mesh>
      <mesh ref={meshRef}>
        {/* <boxGeometry args={[1, 1, 1]} /> */}
        <torusGeometry args={[0.6, 0.2, 128, 64]} />
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </group>
  );
}