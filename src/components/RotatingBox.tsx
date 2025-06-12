'use client';
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Text, Text3D } from "@react-three/drei";
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
    attenuationColor: "#00ff44",
    color: 'white'
  }

  return (
    <group scale={viewport.width / 5}>
      {/* Space Background */}
      <mesh position={[0, 0, -10]}>
        <sphereGeometry args={[50, 64, 32]} />
        <meshBasicMaterial 
          color="#000011"
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Stars */}
      {Array.from({ length: 800 }, (_, i) => {
        const radius = 45;
        const phi = Math.acos(-1 + (2 * i) / 800);
        const theta = Math.sqrt(800 * Math.PI) * phi;
        
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        
        const starSize = Math.random() * 0.03 + 0.003;
        const brightness = Math.random() * 0.9 + 0.1;
        const hue = Math.random() * 80 + 180; // Blue to white range
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[starSize, 6, 6]} />
            <meshBasicMaterial 
              color={`hsl(${hue}, ${Math.random() * 30 + 20}%, ${brightness * 80 + 20}%)`}
            />
          </mesh>
        );
      })}

      {/* Bright Stars */}
      {Array.from({ length: 50 }, (_, i) => {
        const radius = 40;
        const x = (Math.random() - 0.5) * radius * 2;
        const y = (Math.random() - 0.5) * radius * 2;
        const z = (Math.random() - 0.5) * radius * 2;
        
        // Mix of blue-white and green stars
        const isGreen = Math.random() > 0.7;
        const hue = isGreen ? Math.random() * 60 + 100 : Math.random() * 60 + 180;
        
        return (
          <mesh key={`bright-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial 
              color={`hsl(${hue}, 40%, 90%)`}
            />
          </mesh>
        );
      })}

      {/* Nebula Clouds */}
      {Array.from({ length: 15 }, (_, i) => {
        const radius = 35;
        const x = (Math.random() - 0.5) * radius * 2;
        const y = (Math.random() - 0.5) * radius * 2;
        const z = (Math.random() - 0.5) * radius * 2;
        
        const scale = Math.random() * 8 + 3;
        // Mix of purple/blue and green nebulae
        const isGreen = Math.random() > 0.6;
        const hue = isGreen ? Math.random() * 60 + 100 : Math.random() * 60 + 240;
        
        return (
          <mesh key={`nebula-${i}`} position={[x, y, z]} scale={[scale, scale, scale]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial 
              color={`hsl(${hue}, 60%, 15%)`}
              transparent
              opacity={0.3}
            />
          </mesh>
        );
      })}

      {/* Distant Galaxies */}
      {Array.from({ length: 8 }, (_, i) => {
        const radius = 42;
        const x = (Math.random() - 0.5) * radius * 2;
        const y = (Math.random() - 0.5) * radius * 2;
        const z = (Math.random() - 0.5) * radius * 2;
        
        const scale = Math.random() * 2 + 0.5;
        // Mix of blue and green tinted galaxies
        const isGreen = Math.random() > 0.5;
        const hue = isGreen ? Math.random() * 40 + 120 : Math.random() * 40 + 200;
        
        return (
          <mesh key={`galaxy-${i}`} position={[x, y, z]} scale={[scale, scale * 0.3, scale]}>
            <sphereGeometry args={[1.5, 12, 12]} />
            <meshBasicMaterial 
              color={`hsl(${hue}, 40%, 25%)`}
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}
      
      {/* Lighting for glow effects */}
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 1, 2]} intensity={1.5} color="#00ff44" />
      <pointLight position={[-2, -1, 2]} intensity={1} color="#00aa33" />
      
      <mesh ref={meshRef}>
        {/* <boxGeometry args={[1, 1, 1]} /> */}
        <torusGeometry args={[0.6, 0.1, 128, 64]} />
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>

      {/* 3D Text */}
      <Text3D
        position={[-1.35, -0.06, 0]}
        size={0.2}
        // font="/Lexend Zetta_Bold.json"
        font="Space Grotesk Medium_Regular.json"
        height={0.03}
        curveSegments={32}
        bevelEnabled={true}
        bevelThickness={0.005}
        bevelSize={0.003}
        bevelSegments={5}
      >
        UNDER DEVELOPMENT
        <MeshTransmissionMaterial
          {...materialProps}
          // transmission={0.95}
          roughness={0.1}
          ior={1.5}
          chromaticAberration={0.2}
          distortion={0.3}
          distortionScale={0.2}
          temporalDistortion={0.5}
          attenuationDistance={1.5}
          attenuationColor="#00ff44"
          toneMapped={false}
         />
      </Text3D>

      <Text position={[0, -1.2, 0]} fontSize={0.06} color="rgb(4, 106, 52)">abhinavmishra.in</Text>

    </group>
  );
}