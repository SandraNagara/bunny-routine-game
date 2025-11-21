
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { SoftShadows, Float, OrbitControls } from '@react-three/drei';
import VoxelRabbit from './VoxelRabbit';
import { RabbitState, Outfit, SceneType } from '../types';
import { Mesh } from 'three';

interface SceneProps {
  state: RabbitState;
  outfit: Outfit;
  scene: SceneType;
  isDirty: boolean;
  showCookie: boolean;
}

const Cookie3D = () => {
    const meshRef = useRef<Mesh>(null);
    useFrame((state) => {
        if(meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={meshRef} position={[0, 1.5, 2.5]} scale={[1.5, 1.5, 1.5]}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.8, 0.8, 0.15, 32]} />
                    <meshStandardMaterial color="#D2691E" />
                </mesh>
                {/* Chips */}
                <mesh position={[0.3, 0.08, 0.2]}>
                    <boxGeometry args={[0.15, 0.1, 0.15]} />
                    <meshStandardMaterial color="#3E2723" />
                </mesh>
                <mesh position={[-0.2, 0.08, -0.2]}>
                    <boxGeometry args={[0.15, 0.1, 0.15]} />
                    <meshStandardMaterial color="#3E2723" />
                </mesh>
                <mesh position={[0.1, 0.08, -0.4]}>
                    <boxGeometry args={[0.15, 0.1, 0.15]} />
                    <meshStandardMaterial color="#3E2723" />
                </mesh>
                <mesh position={[-0.4, 0.08, 0.1]}>
                    <boxGeometry args={[0.15, 0.1, 0.15]} />
                    <meshStandardMaterial color="#3E2723" />
                </mesh>
                <mesh position={[0, 0.08, 0]}>
                    <boxGeometry args={[0.15, 0.1, 0.15]} />
                    <meshStandardMaterial color="#3E2723" />
                </mesh>
            </group>
        </Float>
    )
}

const EnvironmentProps = ({ type }: { type: SceneType }) => {
    if (type === SceneType.BEDROOM) {
        return (
            // Bed anchored at [-2, 0, -2]
            <group position={[-2, 0, -2]}>
                {/* Bed Frame/Mattress */}
                <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
                    <boxGeometry args={[3, 1, 5]} />
                    <meshStandardMaterial color="#FFB3D9" />
                </mesh>
                {/* Pillow */}
                <mesh position={[0, 1.1, -2]} castShadow>
                    <boxGeometry args={[2.5, 0.4, 1]} />
                    <meshStandardMaterial color="white" />
                </mesh>
            </group>
        );
    }
    if (type === SceneType.OFFICE) {
        return (
            <group position={[0, 0, -2.5]}>
                {/* Desk */}
                <mesh position={[0, 1.5, -1]} castShadow receiveShadow>
                    <boxGeometry args={[6, 0.2, 2]} />
                    <meshStandardMaterial color="#8B4513" />
                </mesh>
                {/* Monitor */}
                <mesh position={[0, 2.5, -1.5]} castShadow>
                    <boxGeometry args={[2, 1.5, 0.1]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
                 <mesh position={[0, 2.5, -1.45]}>
                    <planeGeometry args={[1.8, 1.3]} />
                    <meshStandardMaterial color="#A8D8FF" emissive="#A8D8FF" emissiveIntensity={0.5} />
                </mesh>
                {/* Keyboard */}
                <mesh position={[0, 1.65, -0.8]}>
                    <boxGeometry args={[1.5, 0.1, 0.6]} />
                    <meshStandardMaterial color="#444" />
                </mesh>
            </group>
        );
    }
    if (type === SceneType.GYM) {
        return (
            <group position={[3, 0, -2]}>
                {/* Dumbbell Rack */}
                <mesh position={[0, 1, 0]} castShadow>
                    <boxGeometry args={[1, 2, 4]} />
                    <meshStandardMaterial color="#555" />
                </mesh>
            </group>
        );
    }
    return (
        // Living Room / Main
        <group position={[2.5, 0, -2]}>
            {/* Plant */}
            <mesh position={[0, 1, 0]} castShadow>
                <cylinderGeometry args={[0.5, 0.4, 2]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
             <mesh position={[0, 2.5, 0]} castShadow>
                <dodecahedronGeometry args={[1]} />
                <meshStandardMaterial color="#228B22" />
            </mesh>
        </group>
    );
}

const Scene: React.FC<SceneProps> = ({ state, outfit, scene, isDirty, showCookie }) => {
  
  // Determine Rabbit Position based on Scene
  // Default: Floor at [0, -1.5, 0]
  // Bed Slot: [-2, -0.2, -2] (Top of bed is at y=1, so -0.2 puts rabbit center approx on top)
  let rabbitPosition: [number, number, number] = [0, -1.5, 0];
  
  if (scene === SceneType.BEDROOM) {
      // Move rabbit to the bed
      rabbitPosition = [-2, -0.2, -2];
  }

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas shadows camera={{ position: [0, 1.5, 8], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1.2} 
            castShadow 
            shadow-mapSize={1024}
          />
          <spotLight position={[-5, 5, 5]} intensity={0.5} angle={0.5} />
          
          {/* Environment Props */}
          <group position={[0, -1.5, 0]}>
             <EnvironmentProps type={scene} />
             
             {/* Floor */}
             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <shadowMaterial transparent opacity={0.15} />
             </mesh>
             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color={scene === SceneType.BEDROOM ? "#FFEFF5" : (scene === SceneType.GYM ? "#e5e5e5" : "#FFF5F7")} />
             </mesh>
          </group>

          {/* Rabbit Group - Moved based on Scene logic */}
          <group position={rabbitPosition}>
             <VoxelRabbit state={state} outfit={outfit} isDirty={isDirty} />
          </group>
          
          {showCookie && <Cookie3D />}
          
          <SoftShadows size={15} samples={12} />
          <OrbitControls enableZoom={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2.2} enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene;
