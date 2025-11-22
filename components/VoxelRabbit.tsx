
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { Text } from '@react-three/drei';
import { RabbitState, Outfit, Weather, SceneType, DailyHygiene } from '../types';

// Global JSX augmentation moved to types.ts or declaration file, 
// but for this component we ensure we use standard React.

interface VoxelRabbitProps {
  state: RabbitState;
  outfit: Outfit;
  isDirty: boolean;
  hunger: number;
  weather?: Weather;
  scene?: SceneType;
  weight: number;
  role?: 'MAIN' | 'WAITER' | 'EXTRA';
  dailyHygiene?: DailyHygiene;
}

const Zzz = () => {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
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
      outlineColor="#4B0082" 
      anchorX="center"
      anchorY="middle"
    >
      Zzz...
    </Text>
  );
};

const Flies = () => {
    const groupRef = useRef<Group>(null);
    const flies = useMemo(() => Array(3).fill(0).map(() => ({
        offset: Math.random() * Math.PI * 2,
        speed: 2 + Math.random() * 2,
        height: Math.random() * 0.5
    })), []);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            const t = clock.getElapsedTime();
            groupRef.current.children.forEach((child, i) => {
                const fly = flies[i];
                child.position.x = Math.cos(t * fly.speed + fly.offset) * 1.5;
                child.position.z = Math.sin(t * fly.speed + fly.offset) * 1.5;
                child.position.y = 3.5 + Math.sin(t * 5) * 0.2 + fly.height;
                child.rotation.y = Math.atan2(-child.position.z, -child.position.x);
            });
        }
    });

    return (
        <group ref={groupRef}>
            {flies.map((_, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[0.08]} />
                    <meshStandardMaterial color="black" />
                    <mesh position={[0.05, 0, 0]}><boxGeometry args={[0.05, 0.02, 0.05]} /><meshStandardMaterial color="white" transparent opacity={0.5} /></mesh>
                    <mesh position={[-0.05, 0, 0]}><boxGeometry args={[0.05, 0.02, 0.05]} /><meshStandardMaterial color="white" transparent opacity={0.5} /></mesh>
                </mesh>
            ))}
        </group>
    );
};

const Bubbles = () => {
    const groupRef = useRef<Group>(null);
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if(groupRef.current) {
             groupRef.current.children.forEach((child, i) => {
                 const offset = i;
                 child.position.y = Math.sin(t * 2 + offset) * 0.5 + 0.5;
                 child.scale.setScalar(0.8 + Math.sin(t * 3 + offset) * 0.2);
             });
        }
    });
    
    return (
        <group ref={groupRef} position={[0, 2.5, 1]}>
             <mesh position={[-0.3, 0, 0]}><sphereGeometry args={[0.15]} /><meshStandardMaterial color="white" transparent opacity={0.6} /></mesh>
             <mesh position={[0.3, 0.2, 0]}><sphereGeometry args={[0.2]} /><meshStandardMaterial color="white" transparent opacity={0.6} /></mesh>
             <mesh position={[0, -0.2, 0.2]}><sphereGeometry args={[0.1]} /><meshStandardMaterial color="white" transparent opacity={0.6} /></mesh>
        </group>
    );
}

const Umbrella = () => {
    return (
        <group position={[1.2, 2.5, 0.5]} rotation={[0, 0, 0.2]}>
            <mesh position={[0, 1, 0]}>
                 <coneGeometry args={[1.2, 0.5, 6]} />
                 <meshStandardMaterial color="#FF6347" />
            </mesh>
            <mesh position={[0, 0, 0]}>
                 <cylinderGeometry args={[0.05, 0.05, 2]} />
                 <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[0, -1, 0.1]} rotation={[Math.PI/4, 0, 0]}>
                 <cylinderGeometry args={[0.05, 0.05, 0.3]} />
                 <meshStandardMaterial color="black" />
            </mesh>
        </group>
    )
}

const CarrotAccessory = () => (
  <group position={[0, -0.8, 0.3]} rotation={[1.6, 0, 0]}>
      <mesh position={[0, 0, 0]}>
         <coneGeometry args={[0.15, 0.6, 8]} />
         <meshStandardMaterial color="#FF7F00" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
         <cylinderGeometry args={[0.05, 0.02, 0.2]} />
         <meshStandardMaterial color="#228B22" />
      </mesh>
  </group>
);

const ToothbrushAccessory = () => (
    <group position={[0, -1.0, 0]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.1, 1.2, 0.1]} />
            <meshStandardMaterial color="cyan" />
        </mesh>
        <mesh position={[0, 1.1, 0.05]}>
            <boxGeometry args={[0.15, 0.3, 0.1]} />
            <meshStandardMaterial color="white" />
        </mesh>
    </group>
);

const WaterBottleAccessory = () => (
    <group position={[0, -0.6, 0.2]} rotation={[1.5, 0, 0]}>
        <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.6]} />
            <meshStandardMaterial color="#00BFFF" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.1]} />
            <meshStandardMaterial color="white" />
        </mesh>
    </group>
);

const DumbbellAccessory = () => (
    <group position={[0, -1.2, 0]} rotation={[0, 0, 1.57]}>
        <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.8]} />
            <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.25, 0.1, 0.25]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[0.25, 0.1, 0.25]} />
            <meshStandardMaterial color="#333" />
        </mesh>
    </group>
);

const GlowStickAccessory = () => (
    <group position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
        <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.8]} />
            <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={1} />
        </mesh>
    </group>
);

const PopcornBucket = () => (
    <group position={[0.8, 1.5, 1.2]} rotation={[-0.5, 0, -0.5]} scale={[0.6, 0.6, 0.6]}>
         <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.4, 0.8, 8]} />
            <meshStandardMaterial color="red" />
         </mesh>
         <mesh position={[0, 0, 0.02]}><planeGeometry args={[0.2, 0.4]} /><meshStandardMaterial color="white" /></mesh>
         <mesh position={[0, 0.5, 0]}>
             <dodecahedronGeometry args={[0.5]} />
             <meshStandardMaterial color="#FFD700" />
         </mesh>
    </group>
);

const VoxelRabbit: React.FC<VoxelRabbitProps> = ({ state, outfit, isDirty, hunger, weather, scene, weight, role = 'MAIN', dailyHygiene }) => {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Mesh>(null);
  const bodyRef = useRef<Mesh>(null);
  const leftArmRef = useRef<Mesh>(null);
  const rightArmRef = useRef<Mesh>(null);
  const leftLegRef = useRef<Mesh>(null);
  const rightLegRef = useRef<Mesh>(null);
  
  const isSick = hunger < 20 && role === 'MAIN';
  const isPale = hunger < 50 && !isSick && role === 'MAIN';
  
  const widthScale = role === 'MAIN' ? 1 + (Math.max(0, weight - 50) / 100) : 1; 
  
  const getBodyColor = () => {
      if (role === 'EXTRA') {
          // Randomize extra colors based on "randomness" if possible, or just static variations
          return Math.random() > 0.5 ? '#AAA' : '#DDD'; 
      }
      if (isSick) return '#E0EEE0'; 
      if (isPale) return '#FFE4E1'; 
      return '#FFFFFF'; 
  };
  
  const speedMult = isSick ? 0.5 : (isPale ? 0.8 : 1);
  
  const holdingUmbrella = (weather === Weather.RAIN || weather === Weather.SNOW) && 
                          scene === SceneType.LIVING_ROOM && 
                          (state === RabbitState.IDLE || state === RabbitState.HAPPY) &&
                          role === 'MAIN';

  const isSitting = scene === SceneType.OFFICE ||
                    state === RabbitState.WORKING || 
                    (state === RabbitState.SOCIAL && (scene === SceneType.RESTAURANT || scene === SceneType.CINEMA || scene === SceneType.TV_ROOM || scene === SceneType.PICNIC));
  
  const hasPopcorn = (scene === SceneType.CINEMA || scene === SceneType.TV_ROOM) && isSitting && role === 'MAIN';
  
  // Determine visual dirtiness based on stats OR missing daily tasks
  const visualDirty = isDirty || (role === 'MAIN' && dailyHygiene && (!dailyHygiene.brushed || !dailyHygiene.washedFace || !dailyHygiene.showered) && new Date().getHours() > 10);

  useFrame((stateThree) => {
    const t = stateThree.clock.getElapsedTime() * speedMult;
    if (!groupRef.current) return;

    if (headRef.current) {
        headRef.current.rotation.set(0, 0, 0);
        headRef.current.position.y = 3.5;
    }
    if (leftLegRef.current) leftLegRef.current.rotation.set(0,0,0);
    if (rightLegRef.current) rightLegRef.current.rotation.set(0,0,0);
    if (leftArmRef.current) leftArmRef.current.rotation.set(0,0,0);
    if (rightArmRef.current) rightArmRef.current.rotation.set(0,0,0);
    
    // Reset scale default every frame
    if (bodyRef.current) bodyRef.current.scale.set(1 * widthScale, 1, 1);
    
    let BaseY = 0; 
    groupRef.current.rotation.set(0, 0, 0);

    // --- HYGIENE ANIMATIONS ---
    if (state === RabbitState.BRUSHING) {
        if (headRef.current) headRef.current.rotation.y = Math.sin(t * 10) * 0.05;
        if (rightArmRef.current) {
            rightArmRef.current.position.z = 0.8;
            rightArmRef.current.position.y = 2.8;
            rightArmRef.current.rotation.x = -1.8;
            rightArmRef.current.rotation.z = -0.5;
            // Brushing motion
            rightArmRef.current.position.x = 1 + Math.sin(t * 15) * 0.1;
        }
        if (leftArmRef.current) {
            leftArmRef.current.rotation.z = 0.2;
        }
    }
    
    else if (state === RabbitState.WASHING_FACE) {
        if (headRef.current) headRef.current.rotation.x = 0.2;
        const rub = Math.sin(t * 10) * 0.2;
        if (rightArmRef.current) {
            rightArmRef.current.position.z = 0.8;
            rightArmRef.current.position.y = 2.8 + rub;
            rightArmRef.current.rotation.x = -2.2;
            rightArmRef.current.rotation.z = -0.5;
            rightArmRef.current.position.x = 0.5;
        }
        if (leftArmRef.current) {
            leftArmRef.current.position.z = 0.8;
            leftArmRef.current.position.y = 2.8 - rub;
            leftArmRef.current.rotation.x = -2.2;
            leftArmRef.current.rotation.z = 0.5;
            leftArmRef.current.position.x = -0.5;
        }
    }

    else if (state === RabbitState.SHOWERING) {
        BaseY = 0.1;
        if (headRef.current) headRef.current.rotation.x = -0.3; // Look up at water
        if (leftArmRef.current) {
            leftArmRef.current.rotation.z = 2.8; // Arms up
            leftArmRef.current.rotation.x = Math.sin(t * 5) * 0.2;
        }
        if (rightArmRef.current) {
            rightArmRef.current.rotation.z = -2.8; // Arms up
            rightArmRef.current.rotation.x = Math.cos(t * 5) * 0.2;
        }
        groupRef.current.rotation.y = Math.sin(t) * 0.5; // Spin slowly
    }

    // --- WAITER ANIMATION ---
    else if (role === 'WAITER') {
         BaseY = Math.sin(t * 4) * 0.05;
         if (headRef.current) {
             headRef.current.rotation.x = 0.2; 
             headRef.current.rotation.y = Math.sin(t) * 0.2; 
         }
         if (rightArmRef.current) {
             rightArmRef.current.rotation.x = -1; 
             rightArmRef.current.rotation.z = 0.5;
         }
         if (leftArmRef.current) {
            leftArmRef.current.rotation.z = -0.2;
         }
         groupRef.current.position.y = BaseY;
    }

    // --- DANCING ANIMATION ---
    else if (state === RabbitState.DANCING) {
        const beat = t * 12;
        BaseY = Math.abs(Math.sin(beat)) * 0.8; // High jump
        
        // Wiggle
        groupRef.current.rotation.y = Math.sin(beat / 2) * 0.2; 
        
        if (headRef.current) {
            headRef.current.rotation.z = Math.cos(beat / 2) * 0.1;
            headRef.current.rotation.x = 0.1 + Math.sin(beat) * 0.1;
        }

        // Wild arms
        if (leftArmRef.current) {
            leftArmRef.current.rotation.z = 2.5 + Math.sin(beat) * 0.5;
            leftArmRef.current.rotation.x = Math.cos(beat) * 0.5;
        }
        if (rightArmRef.current) {
            rightArmRef.current.rotation.z = -2.5 - Math.sin(beat) * 0.5;
            rightArmRef.current.rotation.x = Math.sin(beat) * 0.5;
        }

        // Legs kick
        if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(beat) * 0.5;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(beat) * 0.5;
    }

    // IDLE
    else if (state === RabbitState.IDLE) {
       BaseY = Math.sin(t * 2) * 0.1;
       if (headRef.current) {
           headRef.current.rotation.z = Math.sin(t * 1) * 0.05;
           if (isSick) headRef.current.rotation.z = 0.1;
       }
       
       if (holdingUmbrella && rightArmRef.current) {
           rightArmRef.current.rotation.x = -2.5; 
           rightArmRef.current.rotation.z = -0.2;
       } else if (rightArmRef.current) {
            rightArmRef.current.rotation.x = 0;
            rightArmRef.current.rotation.z = 0;
       }
    }

    // SITTING
    else if (isSitting) {
       BaseY = -0.8; 
       if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.PI / 2;
       if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.PI / 2;
       if (headRef.current) headRef.current.rotation.x = 0.1 + Math.sin(t * 2) * 0.02; 
       
       // WORK TYPING
       if (state === RabbitState.WORKING && leftArmRef.current && rightArmRef.current) {
           leftArmRef.current.position.z = 0.6;
           rightArmRef.current.position.z = 0.6;
           leftArmRef.current.rotation.y = -0.2;
           rightArmRef.current.rotation.y = 0.2;
           leftArmRef.current.rotation.x = -1.3 + Math.sin(t * 25) * 0.15;
           rightArmRef.current.rotation.x = -1.3 + Math.cos(t * 25) * 0.15;
       }
       else if (scene === SceneType.RESTAURANT && role === 'MAIN') {
           if (Math.sin(t * 0.5) > 0.8 && rightArmRef.current) {
                rightArmRef.current.rotation.x = -2.5; 
                rightArmRef.current.rotation.z = -0.2;
           } else if (rightArmRef.current) {
                rightArmRef.current.position.z = 0.5;
                rightArmRef.current.rotation.x = -1.5 + Math.sin(t * 10) * 0.2;
           }
       }
       else {
            if (leftArmRef.current) leftArmRef.current.position.z = 0.2;
            if (rightArmRef.current) rightArmRef.current.position.z = 0.2;
            if (hasPopcorn && rightArmRef.current) {
                 rightArmRef.current.rotation.x = -1.2;
                 rightArmRef.current.position.z = 0.4;
                 if (headRef.current) headRef.current.rotation.x = 0.1 + Math.abs(Math.sin(t * 5)) * 0.1;
            }
       }
    } 

    // EXERCISE
    else if (state === RabbitState.EXERCISE) {
        if (outfit === Outfit.SPORT_SWIM) {
            groupRef.current.rotation.x = -Math.PI / 2; 
            BaseY = 0.5 + Math.sin(t * 3) * 0.1;
            if (leftArmRef.current) {
                 leftArmRef.current.rotation.x = Math.PI; 
                 leftArmRef.current.rotation.z = Math.sin(t * 5) * 0.5; 
            }
            if (rightArmRef.current) {
                 rightArmRef.current.rotation.x = Math.PI;
                 rightArmRef.current.rotation.z = -Math.sin(t * 5 + 1) * 0.5;
            }
            if (leftLegRef.current) leftLegRef.current.rotation.x = Math.cos(t * 10) * 0.3;
            if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.cos(t * 10) * 0.3;
            if (headRef.current) headRef.current.rotation.x = -0.8; 
        }
        else if (outfit === Outfit.SPORT_GYM) {
            BaseY = 0;
            if (rightArmRef.current) {
                const lift = (Math.sin(t * 3) + 1) / 2; 
                rightArmRef.current.rotation.z = -0.2; 
                rightArmRef.current.rotation.x = -lift * 2.0; 
            }
            if (leftArmRef.current) leftArmRef.current.rotation.z = 0.3; 
            if (headRef.current) headRef.current.rotation.z = -0.1; 
        }
        else if (outfit === Outfit.SPORT_RUN) {
            BaseY = Math.abs(Math.sin(t * 15)) * 0.3;
            if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 15);
            if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t * 15);
            if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.sin(t * 15);
            if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(t * 15);
            if (headRef.current) headRef.current.rotation.x = 0.1;
        }
        else if (outfit === Outfit.SPORT_PILATES) {
             groupRef.current.rotation.x = -Math.PI / 2; 
             BaseY = 0.2; 
             if (headRef.current) headRef.current.rotation.x = 0.8; 
             const legLift = (Math.sin(t * 2) + 1) / 2 * 1.2; 
             if (leftLegRef.current) leftLegRef.current.rotation.x = legLift;
             if (rightLegRef.current) rightLegRef.current.rotation.x = legLift;
             if (leftArmRef.current) {
                 leftArmRef.current.rotation.z = 0.3;
                 leftArmRef.current.position.z = -0.2;
             }
             if (rightArmRef.current) {
                 rightArmRef.current.rotation.z = -0.3;
                 rightArmRef.current.position.z = -0.2;
             }
        }
        else {
             BaseY = Math.abs(Math.sin(t * 15)) * 0.5;
        }
    }

    // HAPPY
    else if (state === RabbitState.HAPPY) {
        BaseY = Math.abs(Math.sin(t * 10)) * 2;
        groupRef.current.rotation.y = t * 8; 
        if (leftArmRef.current) leftArmRef.current.rotation.z = 2.5;
        if (rightArmRef.current) rightArmRef.current.rotation.z = -2.5;
    }

    // EATING / DRINKING
    else if (state === RabbitState.EATING || state === RabbitState.DRINKING) {
        if (headRef.current) headRef.current.rotation.x = -0.2; 
        if (rightArmRef.current) {
             rightArmRef.current.rotation.x = -2.2 + Math.sin(t * 15) * 0.2;
             rightArmRef.current.rotation.z = -0.3;
             rightArmRef.current.rotation.y = -0.5;
             rightArmRef.current.position.z = 0.2; 
        }
    }

    // CLEANING (Legacy)
    else if (state === RabbitState.CLEANING) {
        groupRef.current.rotation.y = Math.sin(t * 20) * 0.2;
        if (headRef.current) headRef.current.rotation.z = Math.sin(t * 20) * 0.1;
    }

    // SLEEPING
    else if (state === RabbitState.SLEEPING) {
        groupRef.current.rotation.x = -Math.PI / 2; 
        groupRef.current.rotation.z = Math.PI / 2;
        BaseY = 0; 
        if (bodyRef.current) bodyRef.current.scale.set(1.05 * widthScale, 1, 1);
    } 
    
    // WAKING
    else if (state === RabbitState.WAKING) {
        BaseY = Math.abs(Math.sin(t * 10)) * 0.3;
        if (headRef.current) {
            headRef.current.rotation.x = -0.2;
            headRef.current.rotation.z = Math.sin(t * 20) * 0.1;
        }
    }

    // DEAD
    else if (state === RabbitState.DEAD) {
        groupRef.current.rotation.z = Math.PI / 2;
        BaseY = -1.5;
    }

    if (groupRef.current && state !== RabbitState.SHOWERING && state !== RabbitState.DANCING) groupRef.current.position.y = BaseY;
    else if (groupRef.current && (state === RabbitState.SHOWERING || state === RabbitState.DANCING)) groupRef.current.position.y = BaseY;
  });

  const getColors = () => {
      if (role === 'WAITER') return { shirt: '#222', pants: '#222', tie: 'red', acc: 'none' };
      if (role === 'EXTRA') return { shirt: Math.random() > 0.5 ? '#888' : '#999', pants: '#666' }; // Fallback, but EXTRA should override in props

      switch (outfit) {
          case Outfit.WORK: return { shirt: '#FFFFFF', tie: 'red', acc: 'glasses', pants: '#333' };
          case Outfit.SPORT_SWIM: return { shirt: '#00BFFF', pants: '#000080', acc: 'goggles' };
          case Outfit.SPORT_BIKE: return { shirt: '#FFD700', pants: '#333', acc: 'helmet' };
          case Outfit.SPORT_RUN: return { shirt: '#FF4500', pants: '#222', acc: 'headband' };
          case Outfit.SPORT_GYM: return { shirt: '#808080', pants: '#111', acc: 'sweatband' };
          case Outfit.SPORT_PILATES: return { shirt: '#FFB7C5', pants: '#FF69B4', acc: 'none' };
          case Outfit.PAJAMA: return { shirt: '#4B0082', star: true, pants: '#4B0082' };
          case Outfit.PARTY: return { shirt: '#FF00FF', pants: '#00FFFF', acc: 'shades', necklace: 'glow' };
          default: return { shirt: '#FFB3D9', pants: '#FFFFFF' };
      }
  };

  const style = getColors();
  const bodyColor = getBodyColor();

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
      
      {holdingUmbrella && <Umbrella />}
      {hasPopcorn && <PopcornBucket />}

      {/* BUBBLES EFFECT */}
      {(state === RabbitState.BRUSHING || state === RabbitState.WASHING_FACE || state === RabbitState.SHOWERING) && <Bubbles />}
      
      {/* FLIES AND DIRT */}
      {visualDirty && role === 'MAIN' && (
          <group>
              <mesh position={[0.8, 2, 1.1]}>
                  <circleGeometry args={[0.3]} />
                  <meshStandardMaterial color="#5D4037" opacity={0.8} transparent />
              </mesh>
              <mesh position={[-0.5, 1.5, 1.1]}>
                  <circleGeometry args={[0.2]} />
                  <meshStandardMaterial color="#5D4037" opacity={0.8} transparent />
              </mesh>
               <mesh position={[0, 1, 0.6]}>
                  <circleGeometry args={[0.4]} />
                  <meshStandardMaterial color="#5D4037" opacity={0.6} transparent />
              </mesh>
              <Flies />
          </group>
      )}
      
      {/* CLEAN SPARKLE EFFECT */}
      {!visualDirty && dailyHygiene && dailyHygiene.brushed && dailyHygiene.washedFace && dailyHygiene.showered && role === 'MAIN' && (
           <group>
               {/* Simple floating sparkles can be added here or via particle system */}
           </group>
      )}

      {state === RabbitState.SLEEPING && (
         <group position={[3, 4.5, 0]} rotation={[Math.PI/2, -Math.PI/2, 0]}>
            <Zzz />
         </group>
      )}

      {state === RabbitState.CLEANING && (
          <mesh position={[1.5, 3, 1]}>
               <sphereGeometry args={[0.5]} />
               <meshStandardMaterial color="#E0FFFF" transparent opacity={0.6} />
          </mesh>
      )}

      {state === RabbitState.SOCIAL && role === 'MAIN' && scene !== SceneType.NIGHTCLUB && (
          <mesh position={[0, 5, 0]}>
               <octahedronGeometry args={[0.5]} />
               <meshStandardMaterial color="#FF0000" />
          </mesh>
      )}

      {/* HEAD */}
      <mesh ref={headRef} position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[2.5, 2.2, 2.2]} />
        <meshStandardMaterial color={bodyColor} />
        
        {/* FACE EXPRESSION */}
        {state === RabbitState.DEAD ? (
             <>
                <mesh position={[-0.6, 0, 1.11]}><Text position={[0,0,0]} fontSize={0.5} color="black">X</Text></mesh>
                <mesh position={[0.6, 0, 1.11]}><Text position={[0,0,0]} fontSize={0.5} color="black">X</Text></mesh>
             </>
        ) : visualDirty ? (
            <>
                <mesh position={[-0.6, 0, 1.11]}><boxGeometry args={[0.3, 0.3, 0.1]} /><meshStandardMaterial color="black" /></mesh>
                <mesh position={[0.6, 0, 1.11]}><boxGeometry args={[0.3, 0.3, 0.1]} /><meshStandardMaterial color="black" /></mesh>
                <mesh position={[0, -0.6, 1.11]} rotation={[0,0,0]}><torusGeometry args={[0.2, 0.05, 8, 10, Math.PI]} /><meshStandardMaterial color="black" /></mesh>
            </>
        ) : (
            <>
                <mesh position={[-0.6, 0, 1.11]}><boxGeometry args={[0.3, 0.3, 0.1]} /><meshStandardMaterial color="black" /></mesh>
                <mesh position={[0.6, 0, 1.11]}><boxGeometry args={[0.3, 0.3, 0.1]} /><meshStandardMaterial color="black" /></mesh>
            </>
        )}

        <mesh position={[-0.8, -0.5, 1.11]}>
            <boxGeometry args={[0.4, 0.2, 0.1]} />
            <meshStandardMaterial color="#FFB7C5" opacity={isSick ? 0.3 : 1} transparent={isSick} />
        </mesh>
        <mesh position={[0.8, -0.5, 1.11]}>
            <boxGeometry args={[0.4, 0.2, 0.1]} />
            <meshStandardMaterial color="#FFB7C5" opacity={isSick ? 0.3 : 1} transparent={isSick} />
        </mesh>
        
        {/* Accessories */}
        {style.acc === 'glasses' && (
            <group position={[0, 0, 1.2]}>
                <mesh position={[-0.6, 0, 0]}><boxGeometry args={[0.6, 0.4, 0.1]} /><meshStandardMaterial color="#333" wireframe /></mesh>
                <mesh position={[0.6, 0, 0]}><boxGeometry args={[0.6, 0.4, 0.1]} /><meshStandardMaterial color="#333" wireframe /></mesh>
            </group>
        )}
        {style.acc === 'shades' && (
            <group position={[0, 0, 1.15]}>
                 {/* Shutter Shades */}
                 <mesh position={[0, 0, 0]}><boxGeometry args={[1.8, 0.6, 0.2]} /><meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.5} /></mesh>
                 <mesh position={[0, 0, 0.11]}><boxGeometry args={[1.6, 0.05, 0.05]} /><meshStandardMaterial color="black" /></mesh>
                 <mesh position={[0, 0.2, 0.11]}><boxGeometry args={[1.6, 0.05, 0.05]} /><meshStandardMaterial color="black" /></mesh>
                 <mesh position={[0, -0.2, 0.11]}><boxGeometry args={[1.6, 0.05, 0.05]} /><meshStandardMaterial color="black" /></mesh>
            </group>
        )}
        {style.acc === 'goggles' && (
            <mesh position={[0, 0, 1.15]}><boxGeometry args={[2, 0.6, 0.2]} /><meshStandardMaterial color="cyan" transparent opacity={0.6} /></mesh>
        )}
        {style.acc === 'helmet' && (
             <mesh position={[0, 1.2, 0]}><cylinderGeometry args={[1.4, 1.4, 0.5]} /><meshStandardMaterial color="blue" /></mesh>
        )}
        {style.acc === 'headband' && (
             <mesh position={[0, 0.8, 0]} rotation={[Math.PI/2, 0, 0]}><torusGeometry args={[1.3, 0.1, 8, 20]} /><meshStandardMaterial color="red" /></mesh>
        )}
        {style.acc === 'sweatband' && (
             <mesh position={[0, 0.8, 0]} rotation={[Math.PI/2, 0, 0]}><torusGeometry args={[1.3, 0.1, 8, 20]} /><meshStandardMaterial color="white" /></mesh>
        )}
        {outfit === Outfit.SPORT_SWIM && (
             <mesh position={[0, 0.2, 0]}><boxGeometry args={[2.6, 2.3, 2.3]} /><meshStandardMaterial color="#000080" /></mesh>
        )}
      </mesh>

      {/* EARS */}
      <group>
        <mesh position={[-0.8, 5, 0]} castShadow>
            <boxGeometry args={[0.6, 1.8, 0.6]} />
            <meshStandardMaterial color={bodyColor} />
            <mesh position={[0, -0.2, 0.31]}><boxGeometry args={[0.4, 1.2, 0.1]} /><meshStandardMaterial color="#FFB7C5" /></mesh>
        </mesh>
        <mesh position={[0.8, 5, 0]} castShadow>
            <boxGeometry args={[0.6, 1.8, 0.6]} />
            <meshStandardMaterial color={bodyColor} />
            <mesh position={[0, -0.2, 0.31]}><boxGeometry args={[0.4, 1.2, 0.1]} /><meshStandardMaterial color="#FFB7C5" /></mesh>
        </mesh>
      </group>

      {/* BODY */}
      <mesh ref={bodyRef} position={[0, 1.5, 0]} castShadow>
        {state === RabbitState.SHOWERING ? (
             // Naked body when showering
             <boxGeometry args={[1.5, 1.8, 1]} /> 
        ) : (
             <boxGeometry args={[1.5, 1.8, 1]} />
        )}
        
        <meshStandardMaterial color={state === RabbitState.SHOWERING ? bodyColor : style.shirt} />
        
        {(style.star || role === 'WAITER') && state !== RabbitState.SHOWERING && (
             <mesh position={[0, 0, 0.51]}>
                 {role === 'WAITER' 
                    ? <boxGeometry args={[0.3, 0.2, 0.1]} /> 
                    : <coneGeometry args={[0.3, 0, 5]} />
                 }
                 <meshStandardMaterial color={role === 'WAITER' ? 'red' : 'yellow'} />
             </mesh>
        )}
        {style.tie && state !== RabbitState.SHOWERING && <mesh position={[0, 0.2, 0.51]}><boxGeometry args={[0.2, 0.8, 0.05]} /><meshStandardMaterial color="red" /></mesh>}
      </mesh>

      {/* ARMS */}
      <mesh ref={leftArmRef} position={[-1, 2, 0.2]}>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color={bodyColor} />
        {style.necklace === 'glow' && <GlowStickAccessory />}
      </mesh>
      <mesh ref={rightArmRef} position={[1, 2, 0.2]}>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color={bodyColor} />
        {role === 'WAITER' && (
            <mesh position={[0, -0.4, 0]}>
                <boxGeometry args={[0.5, 0.6, 0.1]} />
                <meshStandardMaterial color="white" />
            </mesh>
        )}

        {/* HOLDING ITEMS */}
        {state === RabbitState.EATING && role === 'MAIN' && <CarrotAccessory />}
        {state === RabbitState.DRINKING && role === 'MAIN' && <WaterBottleAccessory />}
        {outfit === Outfit.SPORT_GYM && state === RabbitState.EXERCISE && <DumbbellAccessory />}
        {state === RabbitState.BRUSHING && <ToothbrushAccessory />}
        {style.necklace === 'glow' && <GlowStickAccessory />}
      </mesh>

      {/* LEGS */}
      <group>
        <mesh ref={leftLegRef} position={[-0.5, 0.3, 0]}>
             <boxGeometry args={[0.4, 0.6, 1]} />
             <meshStandardMaterial color={state === RabbitState.SHOWERING ? bodyColor : style.pants} />
        </mesh>
        <mesh ref={rightLegRef} position={[0.5, 0.3, 0]}>
             <boxGeometry args={[0.4, 0.6, 1]} />
             <meshStandardMaterial color={state === RabbitState.SHOWERING ? bodyColor : style.pants} />
        </mesh>
      </group>
    </group>
  );
};

export default VoxelRabbit;
