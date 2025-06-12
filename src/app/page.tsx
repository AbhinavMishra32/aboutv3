'use client';
import RotatingBox from "@/components/RotatingBox";
import { Environment, OrbitControls, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

export default function Home() {


  return (
    <>
      <div className='h-screen w-screen bg-black'>
        <Canvas
          gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
          camera={{ position: [0, 0, 5], fov: 75 }} className='h-full w-full'
        >
          <ambientLight intensity={0.1} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <Environment preset="night" />
            <RotatingBox />

          {/* <OrbitControls /> */}

        </Canvas>
      </div>
    </>
  );
}