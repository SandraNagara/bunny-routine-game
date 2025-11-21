
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { Text } from '@react-three/drei';
import { RabbitState, Outfit, Weather, SceneType } from '../types';

interface VoxelRabbitProps {
  state: RabbitState;
  outfit: Outfit;
  isDirty: boolean;
  hunger: number;
  weather?: Weather;
  scene?: SceneType;
  weight: number;
  role?: 'MAIN' | 'WAITER' | 'EXTRA';
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

const PopcornBucket = () => (
    <group position={[0.8, 1.5, 1.2]} rotation={[-0.5, 0, -0.5]} scale={[0.6, 0.6, 0.6]}>
         <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.4, 0.8, 8]} />
            <meshStandardMaterial color="red" />
         </mesh>
         <mesh position={[0, 0, 0.02]}><planeGeometry args={[0.2, 0.4]} /><meshStandardMaterial color="white" /></mesh>
         {/* Popcorn kernels */}
         <mesh position={[0, 0.5, 0]}>
             <dodecahedronGeometry args={[0.5]} />
             <meshStandardMaterial color="#FFD700" />
         </mesh>
    </group>
);

const VoxelRabbit: React.FC<VoxelRabbitProps> = ({ state, outfit, isDirty, hunger, weather, scene, weight, role = 'MAIN' }) => {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Mesh>(null);
  const bodyRef = useRef<Mesh>(null);
  const leftArmRef = useRef<Mesh>(null);
  const rightArmRef = useRef<Mesh>(null);
  const leftLegRef = useRef<Mesh>(null);
  const rightLegRef = useRef<Mesh>(null);
  
  const isSick = hunger < 20 && role === 'MAIN';
  const isPale = hunger < 50 && !isSick && role === 'MAIN';
  
  // Weight scaling logic
  const widthScale = role === 'MAIN' ? 1 + (Math.max(0, weight - 50) / 100) : 1; 
  
  const getBodyColor = () => {
      if (role === 'EXTRA') return '#DDD';
      if (isSick) return '#E0EEE0'; 
      if (isPale) return '#FFE4E1'; 
      return '#FFFFFF'; 
  };
  
  const speedMult = isSick ? 0.5 : (isPale ? 0.8 : 1);
  
  const holdingUmbrella = (weather === Weather.RAIN || weather === Weather.SNOW) && 
                          scene === SceneType.LIVING_ROOM && 
                          (state === RabbitState.IDLE || state === RabbitState.HAPPY) &&
                          role === 'MAIN';

  // Update isSitting logic: Include SceneType.OFFICE
  const isSitting = scene === SceneType.OFFICE ||
                    state === RabbitState.WORKING || 
                    (state === RabbitState.SOCIAL && (scene === SceneType.RESTAURANT || scene === SceneType.CINEMA || scene === SceneType.TV_ROOM || scene === SceneType.PICNIC));
  
  const hasPopcorn = (scene === SceneType.CINEMA || scene === SceneType.TV_ROOM) && isSitting && role === 'MAIN';

  useFrame((stateThree) => {
    const t = stateThree.clock.getElapsedTime() * speedMult;
    if (!groupRef.current) return;

    // Reset basic transforms
    if (headRef.current) {
        headRef.current.rotation.set(0, 0, 0);
        headRef.current.position.y = 3.5;
    }
    if (leftLegRef.current) leftLegRef.current.rotation.set(0,0,0);
    if (rightLegRef.current) rightLegRef.current.rotation.set(0,0,0);
    if (leftArmRef.current) leftArmRef.current.rotation.set(0,0,0);
    if (rightArmRef.current) rightArmRef.current.rotation.set(0,0,0);
    
    let BaseY = 0; 
    groupRef.current.rotation.set(0, 0, 0);

    // --- WAITER ANIMATION ---
    if (role === 'WAITER') {
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
         return; 
    }

    // IDLE
    if (state === RabbitState.IDLE) {
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
    if (isSitting) {
       BaseY = -0.8; 
       if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.PI / 2;
       if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.PI / 2;
       if (headRef.current) headRef.current.rotation.x = 0.1 + Math.sin(t * 2) * 0.02; 
       
       // WORK TYPING - Adjusted for Front View
       if (state === RabbitState.WORKING && leftArmRef.current && rightArmRef.current) {
           // Arms reach forward (Z+)
           leftArmRef.current.position.z = 0.6;
           rightArmRef.current.position.z = 0.6;
           // Rotate slightly inwards
           leftArmRef.current.rotation.y = -0.2;
           rightArmRef.current.rotation.y = 0.2;
           // Type up and down
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

    // EXERCISE (SWIM, LIFT, RUN, PILATES)
    if (state === RabbitState.EXERCISE) {
        
        // SWIMMING - Horizontal, Face down, Paddling
        if (outfit === Outfit.SPORT_SWIM) {
            groupRef.current.rotation.x = -Math.PI / 2; // Horizontal
            BaseY = 0.5 + Math.sin(t * 3) * 0.1; // Float
            
            if (leftArmRef.current) {
                 leftArmRef.current.rotation.x = Math.PI; // Start forward
                 leftArmRef.current.rotation.z = Math.sin(t * 5) * 0.5; // Stroke out
            }
            if (rightArmRef.current) {
                 rightArmRef.current.rotation.x = Math.PI;
                 rightArmRef.current.rotation.z = -Math.sin(t * 5 + 1) * 0.5;
            }
            
            if (leftLegRef.current) leftLegRef.current.rotation.x = Math.cos(t * 10) * 0.3; // Flutter kick
            if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.cos(t * 10) * 0.3;
            
            if (headRef.current) headRef.current.rotation.x = -0.8; // Look forward
        }
        
        // WEIGHTLIFTING - Standing, Curl
        else if (outfit === Outfit.SPORT_GYM) {
            BaseY = 0;
            if (rightArmRef.current) {
                // Curl logic
                const lift = (Math.sin(t * 3) + 1) / 2; // 0 to 1
                rightArmRef.current.rotation.z = -0.2; 
                rightArmRef.current.rotation.x = -lift * 2.0; // Lift up
            }
            if (leftArmRef.current) leftArmRef.current.rotation.z = 0.3; // Balance
            if (headRef.current) headRef.current.rotation.z = -0.1; // Strain
        }
        
        // RUNNING - Fast arms/legs
        else if (outfit === Outfit.SPORT_RUN) {
            BaseY = Math.abs(Math.sin(t * 15)) * 0.3;
            if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 15);
            if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t * 15);
            if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.sin(t * 15);
            if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(t * 15);
            if (headRef.current) headRef.current.rotation.x = 0.1;
        }

        // PILATES - On Back, Leg Lifts
        else if (outfit === Outfit.SPORT_PILATES) {
             groupRef.current.rotation.x = -Math.PI / 2; // Lying on back
             BaseY = 0.2; // On Mat
             
             // Head looks up/forward
             if (headRef.current) headRef.current.rotation.x = 0.8; 
             
             // Leg lifts
             const legLift = (Math.sin(t * 2) + 1) / 2 * 1.2; // 0 to 1.2 rads
             if (leftLegRef.current) leftLegRef.current.rotation.x = legLift;
             if (rightLegRef.current) rightLegRef.current.rotation.x = legLift;
             
             // Arms by side on floor
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
             // Fallback
             BaseY = Math.abs(Math.sin(t * 15)) * 0.5;
        }
    }

    // HAPPY
    if (state === RabbitState.HAPPY) {
        BaseY = Math.abs(Math.sin(t * 10)) * 2;
        groupRef.current.rotation.y = t * 8; 
        if (leftArmRef.current) leftArmRef.current.rotation.z = 2.5;
        if (rightArmRef.current) rightArmRef.current.rotation.z = -2.5;
    }

    // EATING / DRINKING
    if (state === RabbitState.EATING || state === RabbitState.DRINKING) {
        if (headRef.current) headRef.current.rotation.x = -0.2; 
        if (rightArmRef.current) {
             rightArmRef.current.rotation.x = -2.2 + Math.sin(t * 15) * 0.2;
             rightArmRef.current.rotation.z = -0.3;
             rightArmRef.current.rotation.y = -0.5;
             // Reset Z position to ensure arm is attached to body correctly even if eating
             rightArmRef.current.position.z = 0.2; 
        }
    }

    // CLEANING
    if (state === RabbitState.CLEANING) {
        groupRef.current.rotation.y = Math.sin(t * 20) * 0.2;
        if (headRef.current) headRef.current.rotation.z = Math.sin(t * 20) * 0.1;
    }

    // SLEEPING
    if (state === RabbitState.SLEEPING) {
        groupRef.current.rotation.x = -Math.PI / 2; 
        groupRef.current.rotation.z = Math.PI / 2;
        BaseY = 0; 
        if (bodyRef.current) bodyRef.current.scale.set(1.05 * widthScale, 1, 1);
    } else {
        if (bodyRef.current) bodyRef.current.scale.set(1 * widthScale, 1, 1);
    }
    
    // WAKING
    if (state === RabbitState.WAKING) {
        BaseY = Math.abs(Math.sin(t * 10)) * 0.3;
        if (headRef.current) {
            headRef.current.rotation.x = -0.2;
            headRef.current.rotation.z = Math.sin(t * 20) * 0.1;
        }
    }

    // DEAD
    if (state === RabbitState.DEAD) {
        groupRef.current.rotation.z = Math.PI / 2;
        BaseY = -1.5;
    }

    // Apply Height
    if (groupRef.current) groupRef.current.position.y = BaseY;
  });

  const getColors = () => {
      if (role === 'WAITER') return { shirt: '#222', pants: '#222', tie: 'red', acc: 'none' };
      if (role === 'EXTRA') return { shirt: '#888', pants: '#666' }; 

      switch (outfit) {
          case Outfit.WORK: return { shirt: '#FFFFFF', tie: 'red', acc: 'glasses', pants: '#333' };
          case Outfit.SPORT_SWIM: return { shirt: '#00BFFF', pants: '#000080', acc: 'goggles' };
          case Outfit.SPORT_BIKE: return { shirt: '#FFD700', pants: '#333', acc: 'helmet' };
          case Outfit.SPORT_RUN: return { shirt: '#FF4500', pants: '#222', acc: 'headband' };
          case Outfit.SPORT_GYM: return { shirt: '#808080', pants: '#111', acc: 'sweatband' };
          case Outfit.SPORT_PILATES: return { shirt: '#FFB7C5', pants: '#FF69B4', acc: 'none' };
          case Outfit.PAJAMA: return { shirt: '#4B0082', star: true, pants: '#4B0082' };
          default: return { shirt: '#FFB3D9', pants: '#FFFFFF' };
      }
  };

  const style = getColors();
  const bodyColor = getBodyColor();

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
      
      {holdingUmbrella && <Umbrella />}
      {hasPopcorn && <PopcornBucket />}

      {state === RabbitState.SLEEPING && (
         <group position={[3, 4.5, 0]} rotation={[Math.PI/2, -Math.PI/2, 0]}>
            <Zzz />
         </group>
      )}

      {isDirty && role === 'MAIN' && (
          <group>
              <mesh position={[0.8, 2, 1.1]}>
                  <circleGeometry args={[0.3]} />
                  <meshStandardMaterial color="#8B4513" opacity={0.6} transparent />
              </mesh>
          </group>
      )}

      {state === RabbitState.CLEANING && (
          <mesh position={[1.5, 3, 1]}>
               <sphereGeometry args={[0.5]} />
               <meshStandardMaterial color="#E0FFFF" transparent opacity={0.6} />
          </mesh>
      )}

      {state === RabbitState.SOCIAL && role === 'MAIN' && (
          <mesh position={[0, 5, 0]}>
               <octahedronGeometry args={[0.5]} />
               <meshStandardMaterial color="#FF0000" />
          </mesh>
      )}

      {/* HEAD */}
      <mesh ref={headRef} position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[2.5, 2.2, 2.2]} />
        <meshStandardMaterial color={bodyColor} />
        
        {state === RabbitState.DEAD ? (
             <>
                <mesh position={[-0.6, 0, 1.11]}><Text position={[0,0,0]} fontSize={0.5} color="black">X</Text></mesh>
                <mesh position={[0.6, 0, 1.11]}><Text position={[0,0,0]} fontSize={0.5} color="black">X</Text></mesh>
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
        {style.acc === 'goggles' && (
            <mesh position={[0, 0, 1.15]}><boxGeometry args={[2, 0.6, 0.2]} /><meshStandardMaterial color="cyan" transparent opacity={0.6} /></mesh>
        )}
        {style.acc === 'helmet' && (
             <mesh position={[0, 1.2, 0]}><cylinderGeometry args={[1.4, 1.4, 0.5]} /><meshStandardMaterial color="blue" /></mesh>
        )}
        {style.acc === 'headband' && (
             <mesh position={[0, 0.8, 0]}><torusGeometry args={[1.3, 0.1, 8, 20]} rotation={[Math.PI/2, 0, 0]} /><meshStandardMaterial color="red" /></mesh>
        )}
        {style.acc === 'sweatband' && (
             <mesh position={[0, 0.8, 0]}><torusGeometry args={[1.3, 0.1, 8, 20]} rotation={[Math.PI/2, 0, 0]} /><meshStandardMaterial color="white" /></mesh>
        )}
        {/* Swim Cap */}
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
        <boxGeometry args={[1.5, 1.8, 1]} />
        <meshStandardMaterial color={style.shirt} />
        {/* Star or Buttons */}
        {(style.star || role === 'WAITER') && (
             <mesh position={[0, 0, 0.51]}>
                 {role === 'WAITER' 
                    ? <boxGeometry args={[0.3, 0.2, 0.1]} /> 
                    : <coneGeometry args={[0.3, 0, 5]} />
                 }
                 <meshStandardMaterial color={role === 'WAITER' ? 'red' : 'yellow'} />
             </mesh>
        )}
        {style.tie && <mesh position={[0, 0.2, 0.51]}><boxGeometry args={[0.2, 0.8, 0.05]} /><meshStandardMaterial color="red" /></mesh>}
      </mesh>

      {/* ARMS */}
      <mesh ref={leftArmRef} position={[-1, 2, 0.2]}>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh ref={rightArmRef} position={[1, 2, 0.2]}>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color={bodyColor} />
        {/* Napkin for waiter */}
        {role === 'WAITER' && (
            <mesh position={[0, -0.4, 0]}>
                <boxGeometry args={[0.5, 0.6, 0.1]} />
                <meshStandardMaterial color="white" />
            </mesh>
        )}

        {/* HOLDING ITEMS - ATTACHED TO HAND */}
        {state === RabbitState.EATING && role === 'MAIN' && <CarrotAccessory />}
        {state === RabbitState.DRINKING && role === 'MAIN' && <WaterBottleAccessory />}
        {outfit === Outfit.SPORT_GYM && state === RabbitState.EXERCISE && <DumbbellAccessory />}
      </mesh>

      {/* LEGS */}
      <group>
        <mesh ref={leftLegRef} position={[-0.5, 0.3, 0]}>
             <boxGeometry args={[0.4, 0.6, 1]} />
             <meshStandardMaterial color={style.pants} />
        </mesh>
        <mesh ref={rightLegRef} position={[0.5, 0.3, 0]}>
             <boxGeometry args={[0.4, 0.6, 1]} />
             <meshStandardMaterial color={style.pants} />
        </mesh>
      </group>
    </group>
  );
};

export default VoxelRabbit;
