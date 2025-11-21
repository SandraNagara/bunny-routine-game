
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { Text } from '@react-three/drei';
import { RabbitState, Outfit } from '../types';

interface VoxelRabbitProps {
  state: RabbitState;
  outfit: Outfit;
  isDirty: boolean;
}

const Zzz = () => {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      // Gentle floating and swaying
      ref.current.position.y = Math.sin(t * 2) * 0.1; 
      ref.current.rotation.z = Math.sin(t) * 0.05;
    }
  });

  return (
    <Text
      ref={ref}
      fontSize={1}
      color="white"
      outlineWidth={0.05}
      outlineColor="#4B0082" // Indigo outline to match PJ vibe
      anchorX="center"
      anchorY="middle"
    >
      Zzz...
    </Text>
  );
};

const VoxelRabbit: React.FC<VoxelRabbitProps> = ({ state, outfit, isDirty }) => {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Mesh>(null);
  const bodyRef = useRef<Mesh>(null);
  
  // Animation Logic
  useFrame((stateThree) => {
    const t = stateThree.clock.getElapsedTime();
    if (!groupRef.current) return;

    // Reset transforms
    if (headRef.current) {
        headRef.current.rotation.set(0, 0, 0);
        headRef.current.position.y = 3.5;
    }
    
    let BaseY = 0; 
    
    // Default Rotation
    groupRef.current.rotation.set(0, 0, 0);

    // IDLE / WORK
    if (state === RabbitState.IDLE || state === RabbitState.WORKING) {
       BaseY = Math.sin(t * 2) * 0.1;
       if (headRef.current) {
           headRef.current.rotation.z = Math.sin(t * 1) * 0.05;
           // Look at computer if working
           if (state === RabbitState.WORKING) headRef.current.rotation.x = 0.1;
       }
    }

    // HAPPY / LOVING
    if (state === RabbitState.HAPPY || state === RabbitState.LOVING) {
        BaseY = Math.abs(Math.sin(t * 10)) * 0.5;
        groupRef.current.rotation.y = Math.sin(t * 5) * 0.2;
    }

    // EATING
    if (state === RabbitState.EATING) {
        if (headRef.current) headRef.current.rotation.x = Math.sin(t * 15) * 0.2;
    }

    // CLEANING (Shake)
    if (state === RabbitState.CLEANING) {
        groupRef.current.rotation.y = Math.sin(t * 20) * 0.2;
        if (headRef.current) headRef.current.rotation.z = Math.sin(t * 20) * 0.1;
    }

    // SLEEPING - Lie Down on Side
    if (state === RabbitState.SLEEPING) {
        // Rotate entire group to lie on side
        // -PI/2 on X makes it face up/down
        // PI/2 on Z makes it lie sideways
        groupRef.current.rotation.x = -Math.PI / 2; 
        groupRef.current.rotation.z = Math.PI / 2;
        
        BaseY = 0; 
        
        // Breathe effect
        if (bodyRef.current) bodyRef.current.scale.set(1.05 + Math.sin(t)*0.03, 1, 1);
    } else {
        if (bodyRef.current) bodyRef.current.scale.set(1, 1, 1);
    }
    
    // WAKING UP - Stretch
    if (state === RabbitState.WAKING) {
        BaseY = Math.abs(Math.sin(t * 10)) * 0.3;
        if (headRef.current) {
            headRef.current.rotation.x = -0.2; // Look up
            headRef.current.rotation.z = Math.sin(t * 20) * 0.1; // Shake head
        }
        // Stretch Arms (Logic would go here if arms were separate refs, for now just body bounce)
    }

    // EXERCISE
    if (state === RabbitState.EXERCISE) {
        // Run in place
        BaseY = Math.abs(Math.sin(t * 15)) * 0.5;
        if (headRef.current) headRef.current.rotation.x = 0.2;
    }
    
    // DEAD
    if (state === RabbitState.DEAD) {
        groupRef.current.rotation.z = Math.PI / 2;
        BaseY = -1.5;
    }

    groupRef.current.position.y = BaseY;
  });

  // Colors based on outfit
  const getColors = () => {
      switch (outfit) {
          case Outfit.WORK: return { shirt: '#FFFFFF', tie: 'red', acc: 'glasses', pants: '#333' };
          case Outfit.SPORT_SWIM: return { shirt: '#00BFFF', pants: '#000080', acc: 'goggles' };
          case Outfit.SPORT_BIKE: return { shirt: '#FFD700', pants: '#333', acc: 'helmet' };
          case Outfit.SPORT_RUN: return { shirt: '#FF4500', pants: '#333', acc: 'headband' };
          case Outfit.SPORT_GYM: return { shirt: '#808080', pants: '#000', acc: 'sweatband' };
          case Outfit.PAJAMA: return { shirt: '#4B0082', star: true, pants: '#4B0082' };
          default: return { shirt: '#FFB3D9', pants: '#FFFFFF' }; // Casual Cute
      }
  };

  const style = getColors();

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
      
      {/* SLEEPING ZZZ */}
      {state === RabbitState.SLEEPING && (
         // Text needs to be rotated inversely to the body rotation so it stands up straight in world space
         // Body is Rot X: -90, Rot Z: 90.
         // We place text relative to head.
         <group position={[3, 4.5, 0]} rotation={[Math.PI/2, -Math.PI/2, 0]}>
            <Zzz />
         </group>
      )}

      {/* DIRTY PARTICLES / SPOTS */}
      {isDirty && (
          <group>
              <mesh position={[0.8, 2, 1.1]}>
                  <circleGeometry args={[0.3]} />
                  <meshStandardMaterial color="#8B4513" opacity={0.6} transparent />
              </mesh>
              <mesh position={[-0.5, 1, 1.1]}>
                  <circleGeometry args={[0.2]} />
                  <meshStandardMaterial color="#8B4513" opacity={0.6} transparent />
              </mesh>
          </group>
      )}

      {/* BUBBLES IF CLEANING */}
      {state === RabbitState.CLEANING && (
          <mesh position={[1.5, 3, 1]}>
               <sphereGeometry args={[0.5]} />
               <meshStandardMaterial color="#E0FFFF" transparent opacity={0.6} />
          </mesh>
      )}

      {/* HEARTS IF LOVING */}
      {state === RabbitState.LOVING && (
          <mesh position={[0, 5, 0]}>
               <octahedronGeometry args={[0.5]} />
               <meshStandardMaterial color="#FF0000" />
          </mesh>
      )}

      {/* HEAD */}
      <mesh ref={headRef} position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[2.5, 2.2, 2.2]} />
        <meshStandardMaterial color="#FFFFFF" />
        
        {/* FACE */}
        <mesh position={[-0.6, 0, 1.11]}>
             <boxGeometry args={[0.3, 0.3, 0.1]} />
             <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.6, 0, 1.11]}>
             <boxGeometry args={[0.3, 0.3, 0.1]} />
             <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[-0.8, -0.5, 1.11]}>
            <boxGeometry args={[0.4, 0.2, 0.1]} />
            <meshStandardMaterial color="#FFB7C5" />
        </mesh>
        <mesh position={[0.8, -0.5, 1.11]}>
            <boxGeometry args={[0.4, 0.2, 0.1]} />
            <meshStandardMaterial color="#FFB7C5" />
        </mesh>
        
        {/* ACCESSORIES */}
        {style.acc === 'glasses' && (
            <group position={[0, 0, 1.2]}>
                <mesh position={[-0.6, 0, 0]}>
                    <boxGeometry args={[0.6, 0.4, 0.1]} />
                    <meshStandardMaterial color="#333" wireframe />
                </mesh>
                <mesh position={[0.6, 0, 0]}>
                    <boxGeometry args={[0.6, 0.4, 0.1]} />
                    <meshStandardMaterial color="#333" wireframe />
                </mesh>
            </group>
        )}
        {style.acc === 'goggles' && (
            <mesh position={[0, 0, 1.15]}>
                <boxGeometry args={[2, 0.6, 0.2]} />
                <meshStandardMaterial color="cyan" transparent opacity={0.6} />
            </mesh>
        )}
        {style.acc === 'helmet' && (
             <mesh position={[0, 1.2, 0]}>
                 <cylinderGeometry args={[1.4, 1.4, 0.5]} />
                 <meshStandardMaterial color="blue" />
             </mesh>
        )}
        {style.acc === 'headband' && (
             <mesh position={[0, 0.8, 0]}>
                 <torusGeometry args={[1.3, 0.1, 8, 20]} rotation={[Math.PI/2, 0, 0]} />
                 <meshStandardMaterial color="red" />
             </mesh>
        )}
        {style.acc === 'sweatband' && (
             <mesh position={[0, 0.8, 0]}>
                 <torusGeometry args={[1.3, 0.1, 8, 20]} rotation={[Math.PI/2, 0, 0]} />
                 <meshStandardMaterial color="white" />
             </mesh>
        )}
      </mesh>

      {/* EARS */}
      <group>
        <mesh position={[-0.8, 5, 0]} castShadow>
            <boxGeometry args={[0.6, 1.8, 0.6]} />
            <meshStandardMaterial color="#FFFFFF" />
            <mesh position={[0, -0.2, 0.31]}>
                <boxGeometry args={[0.4, 1.2, 0.1]} />
                <meshStandardMaterial color="#FFB7C5" />
            </mesh>
        </mesh>
        <mesh position={[0.8, 5, 0]} castShadow>
            <boxGeometry args={[0.6, 1.8, 0.6]} />
            <meshStandardMaterial color="#FFFFFF" />
            <mesh position={[0, -0.2, 0.31]}>
                <boxGeometry args={[0.4, 1.2, 0.1]} />
                <meshStandardMaterial color="#FFB7C5" />
            </mesh>
        </mesh>
      </group>

      {/* BODY */}
      <mesh ref={bodyRef} position={[0, 1, 0]} castShadow>
        <boxGeometry args={[1.8, 2.5, 1.5]} />
        <meshStandardMaterial color={style.shirt} />
        
        {style.tie && (
             <mesh position={[0, 0.2, 0.76]}>
                 <boxGeometry args={[0.4, 1.2, 0.1]} />
                 <meshStandardMaterial color="red" />
             </mesh>
        )}
        {style.star && (
             <mesh position={[0, 0, 0.76]}>
                 <boxGeometry args={[0.5, 0.5, 0.1]} />
                 <meshStandardMaterial color="yellow" />
             </mesh>
        )}
      </mesh>

      {/* ARMS */}
      <mesh position={[-1.2, 1.5, 0.2]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.6, 1.2, 0.6]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[1.2, 1.5, 0.2]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.6, 1.2, 0.6]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* LEGS */}
      <mesh position={[-0.5, -0.5, 0]} castShadow>
        <boxGeometry args={[0.7, 0.8, 0.7]} />
        <meshStandardMaterial color={style.pants || '#333'} />
      </mesh>
      <mesh position={[-0.5, -0.5, 0]} castShadow>
        <boxGeometry args={[0.7, 0.8, 0.7]} />
        <meshStandardMaterial color={style.pants || '#333'} />
      </mesh>
    </group>
  );
};

export default VoxelRabbit;
