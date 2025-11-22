
import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { SoftShadows, Float, OrbitControls, Text, Stars } from '@react-three/drei';
import VoxelRabbit from './VoxelRabbit';
import { RabbitState, Outfit, SceneType, Season, Weather, Task, DailyHygiene } from '../types';
import { Mesh, Group } from 'three';

interface SceneProps {
  state: RabbitState;
  outfit: Outfit;
  scene: SceneType;
  season: Season;
  weather: Weather;
  isDirty: boolean;
  showCookie: boolean;
  workTimer?: number; 
  isWorking?: boolean;
  hunger?: number;
  timeOfDay?: number; 
  weight: number;
  lampOn: boolean;
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  dailyHygiene: DailyHygiene;
}

const ParticleSystem = ({ weather }: { weather: Weather }) => {
    const count = 150;
    const mesh = useRef<any>(null);
    
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 10;
            const y = Math.random() * 10;
            const z = (Math.random() - 0.5) * 10;
            const speed = 0.05 + Math.random() * 0.1;
            temp.push({ x, y, z, speed });
        }
        return temp;
    }, []);

    useFrame(() => {
        if (!mesh.current) return;
        particles.forEach((particle, i) => {
            particle.y -= particle.speed;
            if (particle.y < 0) {
                particle.y = 10;
                particle.x = (Math.random() - 0.5) * 10;
                particle.z = (Math.random() - 0.5) * 10;
            }
            if (weather === Weather.SNOW) particle.x += Math.sin(particle.y) * 0.01;
            if (weather === Weather.SAKURA) {
                particle.x += 0.02;
                particle.z += 0.01;
            }
            const dummyObject = mesh.current.children[i];
            if (dummyObject) {
                dummyObject.position.set(particle.x, particle.y, particle.z);
                if (weather === Weather.SAKURA) {
                     dummyObject.rotation.x += 0.01;
                     dummyObject.rotation.y += 0.02;
                }
            }
        });
    });

    if (weather === Weather.SUNNY || weather === Weather.CLOUDY) return null;

    let color = "#FFFFFF";
    let size: [number, number, number] = [0.05, 0.05, 0.05];

    if (weather === Weather.RAIN) {
        color = "#A8D8FF";
        size = [0.02, 0.2, 0.02]; 
    } else if (weather === Weather.SNOW) {
        color = "#FFFFFF";
        size = [0.08, 0.08, 0.08]; 
    } else if (weather === Weather.SAKURA) {
        color = "#FFB7C5";
        size = [0.1, 0.01, 0.1]; 
    }

    return (
        <group ref={mesh}>
            {particles.map((p, i) => (
                <mesh key={i} position={[p.x, p.y, p.z]}>
                    <boxGeometry args={size} />
                    <meshStandardMaterial color={color} transparent opacity={0.8} />
                </mesh>
            ))}
        </group>
    );
};

const ShowerStream = () => {
    const mesh = useRef<any>(null);
    const count = 50;
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                x: (Math.random() - 0.5) * 1,
                y: Math.random() * 4,
                z: (Math.random() - 0.5) * 1,
                speed: 0.1 + Math.random() * 0.1
            });
        }
        return temp;
    }, []);

    useFrame(() => {
        if (!mesh.current) return;
        particles.forEach((particle, i) => {
            particle.y -= particle.speed;
            if (particle.y < 0) particle.y = 4;
            const dummy = mesh.current.children[i];
            if (dummy) dummy.position.set(particle.x, particle.y, particle.z);
        });
    });

    return (
        <group position={[0, 1, 0]} ref={mesh}>
            {particles.map((p, i) => (
                <mesh key={i}>
                    <boxGeometry args={[0.03, 0.2, 0.03]} />
                    <meshBasicMaterial color="#A8D8FF" transparent opacity={0.6} />
                </mesh>
            ))}
        </group>
    )
}

const VoxelCat = () => {
    return (
        <group>
            <mesh position={[0, 1.8, 0]} castShadow>
                <boxGeometry args={[1.2, 1, 1]} />
                <meshStandardMaterial color="#888" />
            </mesh>
            <mesh position={[-0.4, 2.4, 0]} rotation={[0, Math.PI/4, 0]}>
                <coneGeometry args={[0.2, 0.5, 4]} />
                <meshStandardMaterial color="#888" />
            </mesh>
            <mesh position={[0.4, 2.4, 0]} rotation={[0, Math.PI/4, 0]}>
                <coneGeometry args={[0.2, 0.5, 4]} />
                <meshStandardMaterial color="#888" />
            </mesh>
            <mesh position={[0, 0.8, 0]} castShadow>
                <boxGeometry args={[0.8, 1, 0.8]} />
                <meshStandardMaterial color="#999" />
            </mesh>
            <mesh position={[0, 1.7, 0.55]}><boxGeometry args={[1.4, 0.05, 0.05]} /><meshStandardMaterial color="black" /></mesh>
        </group>
    )
}

const Cookie3D = ({ breakTime }: { breakTime: number }) => {
    const meshRef = useRef<Mesh>(null);
    useFrame((state) => {
        if(meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });
    return (
        <group>
             <mesh position={[0, 0, 4]} rotation={[0,0,0]}>
                <planeGeometry args={[20, 10]} />
                <meshBasicMaterial color="black" transparent opacity={0.8} />
             </mesh>
            
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <group ref={meshRef} position={[0, 1.5, 5]} scale={[1.5, 1.5, 1.5]}>
                    <mesh castShadow>
                        <cylinderGeometry args={[0.8, 0.8, 0.15, 32]} />
                        <meshStandardMaterial color="#D2691E" />
                    </mesh>
                    <mesh position={[0.3, 0.08, 0.2]}><boxGeometry args={[0.15, 0.1, 0.15]} /><meshStandardMaterial color="#3E2723" /></mesh>
                    <mesh position={[-0.2, 0.08, -0.2]}><boxGeometry args={[0.15, 0.1, 0.15]} /><meshStandardMaterial color="#3E2723" /></mesh>
                    
                    <Text position={[0, 0, 0.2]} fontSize={0.3} color="white">
                         {breakTime}s
                    </Text>
                </group>
            </Float>
        </group>
    )
}

const FoodItems = () => (
    <group>
        <mesh position={[0.5, 0.2, 0.5]}>
            <sphereGeometry args={[0.2]} />
            <meshStandardMaterial color="red" />
            <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.02, 0.02, 0.1]} /><meshStandardMaterial color="brown" /></mesh>
        </mesh>
        <group position={[-0.5, 0.2, 0.8]} rotation={[0, 0.5, 0]}>
            <mesh>
                <cylinderGeometry args={[0.3, 0.3, 0.2, 3, 1, false, 0, 1]} />
                <meshStandardMaterial color="pink" />
            </mesh>
            <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.08]} /><meshStandardMaterial color="red" /></mesh>
        </group>
    </group>
)

const NightclubEnvironment = () => {
    const laserRef = useRef<Group>(null);
    const ballRef = useRef<Mesh>(null);
    
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (laserRef.current) {
            laserRef.current.rotation.y = t * 0.5;
            laserRef.current.rotation.z = Math.sin(t) * 0.2;
        }
        if (ballRef.current) {
            ballRef.current.rotation.y = t;
        }
    });

    const crowdPositions = [
        [-2, 0, -2], [2, 0, -2], [-1, 0, -3], [1, 0, -3], [0, 0, -4], [-3, 0, -1], [3, 0, -1]
    ];

    return (
        <group position={[0, 0, 0]}>
            {/* Dark Walls */}
            <mesh position={[0, 5, -5]}>
                <planeGeometry args={[20, 10]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[-5, 5, 0]} rotation={[0, Math.PI/2, 0]}>
                <planeGeometry args={[20, 10]} />
                <meshStandardMaterial color="#111" />
            </mesh>
             <mesh position={[5, 5, 0]} rotation={[0, -Math.PI/2, 0]}>
                <planeGeometry args={[20, 10]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            
            {/* Disco Ball */}
            <mesh ref={ballRef} position={[0, 4, 0]} castShadow>
                 <dodecahedronGeometry args={[0.8]} />
                 <meshStandardMaterial color="silver" metalness={1} roughness={0} emissive="#222" />
            </mesh>

            {/* Lasers */}
            <group ref={laserRef} position={[0, 4, 0]}>
                 <mesh position={[2, -2, 0]} rotation={[0, 0, 0.5]}>
                      <cylinderGeometry args={[0.02, 0.02, 8]} />
                      <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={2} />
                 </mesh>
                 <mesh position={[-2, -2, 0]} rotation={[0, 0, -0.5]}>
                      <cylinderGeometry args={[0.02, 0.02, 8]} />
                      <meshStandardMaterial color="#FF00FF" emissive="#FF00FF" emissiveIntensity={2} />
                 </mesh>
                 <mesh position={[0, -2, 2]} rotation={[0.5, 0, 0]}>
                      <cylinderGeometry args={[0.02, 0.02, 8]} />
                      <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={2} />
                 </mesh>
            </group>

            {/* Dance Floor Grid */}
            <gridHelper args={[10, 10, 0xFF00FF, 0x00FFFF]} position={[0, 0.01, 0]} />
            
            {/* Crowd */}
            {crowdPositions.map((pos, i) => (
                <group key={i} position={[pos[0], 0, pos[2]]} rotation={[0, (Math.random() - 0.5) * 0.5, 0]}>
                    {i % 2 === 0 ? (
                        <VoxelRabbit 
                            state={RabbitState.DANCING} 
                            outfit={Outfit.PARTY} 
                            isDirty={false} 
                            hunger={100} 
                            weight={50} 
                            role="EXTRA" 
                        />
                    ) : (
                        <group scale={[0.8, 0.8, 0.8]}>
                            <VoxelCat />
                        </group>
                    )}
                </group>
            ))}

            {/* Music Visualizer Bars */}
            <group position={[0, 0, -4.5]}>
                 {[...Array(10)].map((_, i) => (
                     <VisualizerBar key={i} index={i} />
                 ))}
            </group>
        </group>
    );
};

const VisualizerBar = ({ index }: { index: number }) => {
    const mesh = useRef<Mesh>(null);
    useFrame(({ clock }) => {
        if (mesh.current) {
            const t = clock.getElapsedTime();
            const scaleY = 1 + Math.sin(t * 5 + index) * 2 + Math.random();
            mesh.current.scale.y = Math.max(0.1, scaleY);
        }
    });
    return (
        <mesh ref={mesh} position={[(index - 4.5) * 0.8, 1, 0]}>
             <boxGeometry args={[0.6, 1, 0.1]} />
             <meshStandardMaterial color={`hsl(${index * 36}, 100%, 50%)`} emissive={`hsl(${index * 36}, 100%, 50%)`} emissiveIntensity={0.5} />
        </mesh>
    );
};

const EnvironmentProps = ({ type, season, activeState }: { type: SceneType, season: Season, activeState: RabbitState }) => {
    let treeColor = "#228B22"; 
    if (season === Season.SPRING) treeColor = "#FF69B4"; 
    if (season === Season.AUTUMN) treeColor = "#D2691E"; 
    if (season === Season.WINTER) treeColor = "#E0FFFF"; 
    
    if (type === SceneType.NIGHTCLUB) {
        return <NightclubEnvironment />;
    }

    if (type === SceneType.BATHROOM) {
        return (
            <group position={[0, 0, -3]}>
                {/* Floor Tile */}
                <mesh position={[0, 0.05, 2]} rotation={[-Math.PI/2, 0, 0]}>
                    <planeGeometry args={[8, 8]} />
                    <meshStandardMaterial color="#E0F7FA" />
                </mesh>
                {/* Wall */}
                <mesh position={[0, 3, -2]}>
                    <planeGeometry args={[8, 6]} />
                    <meshStandardMaterial color="#B2EBF2" />
                </mesh>
                {/* Mirror */}
                <mesh position={[0, 3.5, -1.9]}>
                    <planeGeometry args={[3, 2]} />
                    <meshStandardMaterial color="#E1F5FE" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[0, 3.5, -1.95]}>
                    <boxGeometry args={[3.2, 2.2, 0.1]} />
                    <meshStandardMaterial color="white" />
                </mesh>
                
                {/* Sink / Counter */}
                <mesh position={[0, 1.5, -1.5]}>
                    <boxGeometry args={[3, 0.2, 1]} />
                    <meshStandardMaterial color="white" />
                </mesh>
                
                {/* Shower Head */}
                {activeState === RabbitState.SHOWERING && (
                    <group position={[0, 6, 2]}>
                        <mesh rotation={[Math.PI/2, 0, 0]}>
                            <cylinderGeometry args={[0.5, 0.1, 0.5]} />
                            <meshStandardMaterial color="#CCC" />
                        </mesh>
                        <ShowerStream />
                    </group>
                )}
            </group>
        );
    }

    if (type === SceneType.BEDROOM) {
        return (
            <group position={[-2, 0, -2]}>
                <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
                    <boxGeometry args={[3, 1, 5]} />
                    <meshStandardMaterial color="#FFB3D9" />
                </mesh>
                <mesh position={[0, 1.1, -2]} castShadow>
                    <boxGeometry args={[2.5, 0.4, 1]} />
                    <meshStandardMaterial color="white" />
                </mesh>
                <group position={[1, 1.2, -2]}>
                     <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.1, 0.2, 0.5]} /><meshStandardMaterial color="gold" /></mesh>
                     <mesh position={[0, 0.3, 0]}><coneGeometry args={[0.3, 0.5, 8]} /><meshStandardMaterial color="white" transparent opacity={0.8} /></mesh>
                </group>
            </group>
        );
    }
    
    if (type === SceneType.OFFICE) {
        return (
            <group>
                <group position={[0, -1.5, 1.2]}>
                     <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
                        <boxGeometry args={[3, 0.1, 1.5]} />
                        <meshStandardMaterial color="#8B4513" />
                    </mesh>
                    <mesh position={[-1.4, 0.5, 0]}><boxGeometry args={[0.1, 1, 1.4]} /><meshStandardMaterial color="#5c2e0e" /></mesh>
                    <mesh position={[1.4, 0.5, 0]}><boxGeometry args={[0.1, 1, 1.4]} /><meshStandardMaterial color="#5c2e0e" /></mesh>

                    <group position={[0, 1.05, 0.2]}>
                        <mesh position={[0, 0.02, 0]}><boxGeometry args={[0.8, 0.04, 0.5]} /><meshStandardMaterial color="#333" /></mesh>
                        <group position={[0, 0.04, -0.2]} rotation={[-0.4, 0, 0]}>
                            <mesh position={[0, 0.25, 0]}>
                                <boxGeometry args={[0.8, 0.5, 0.04]} />
                                <meshStandardMaterial color="#222" />
                            </mesh>
                            <mesh position={[0, 0.25, 0.03]}>
                                <planeGeometry args={[0.75, 0.45]} />
                                <meshStandardMaterial color="#A8D8FF" emissive="#A8D8FF" emissiveIntensity={0.8} />
                            </mesh>
                            <mesh position={[0, 0.25, -0.03]} rotation={[0, Math.PI, 0]}>
                                <planeGeometry args={[0.2, 0.2]} />
                                <meshStandardMaterial color="#444" />
                            </mesh>
                        </group>
                    </group>
                </group>
            </group>
        );
    }

    if (type === SceneType.GYM) {
        return (
            <group position={[3, 0, -2]}>
                <mesh position={[0, 1, 0]} castShadow>
                    <boxGeometry args={[1, 2, 4]} />
                    <meshStandardMaterial color="#555" />
                </mesh>
                <mesh position={[-1, 0.3, 0]} rotation={[0, 0, Math.PI/2]}>
                    <cylinderGeometry args={[0.3, 0.3, 1]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
                <mesh position={[-1, 1.5, 0]}>
                     <boxGeometry args={[0.2, 2, 3]} />
                     <meshStandardMaterial color="#777" />
                </mesh>
            </group>
        );
    }

    if (type === SceneType.POOL) {
         return (
             <group position={[0, 0, -2]}>
                 <group position={[0, 0.5, -3]}>
                     <mesh position={[-0.5, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 2]} /><meshStandardMaterial color="#CCC" /></mesh>
                     <mesh position={[0.5, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 2]} /><meshStandardMaterial color="#CCC" /></mesh>
                     <mesh position={[0, 0.8, 0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.05, 0.05, 1.1]} /><meshStandardMaterial color="#CCC" /></mesh>
                     <mesh position={[0, 0.4, 0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.05, 0.05, 1.1]} /><meshStandardMaterial color="#CCC" /></mesh>
                     <mesh position={[0, 0, 0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.05, 0.05, 1.1]} /><meshStandardMaterial color="#CCC" /></mesh>
                 </group>
                 <mesh position={[0, -0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
                     <planeGeometry args={[20, 20]} />
                     <meshStandardMaterial color="#00BFFF" transparent opacity={0.8} />
                 </mesh>
                 <mesh position={[2, 0.2, 2]}><sphereGeometry args={[0.3]} /><meshStandardMaterial color="red" /></mesh>
                 <mesh position={[-2, 0.2, 1]}><sphereGeometry args={[0.3]} /><meshStandardMaterial color="white" /></mesh>
             </group>
         )
    }

    if (type === SceneType.TRACK) {
        return (
            <group>
                 <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
                     <planeGeometry args={[20, 20]} />
                     <meshStandardMaterial color="#D2691E" />
                 </mesh>
                 <mesh position={[0, 0.02, 1]} rotation={[-Math.PI/2, 0, 0]}><planeGeometry args={[20, 0.1]} /><meshStandardMaterial color="white" /></mesh>
                 <mesh position={[0, 0.02, -1]} rotation={[-Math.PI/2, 0, 0]}><planeGeometry args={[20, 0.1]} /><meshStandardMaterial color="white" /></mesh>
                 
                 <group position={[-4, 0, -4]}>
                    <mesh position={[0, 1, 0]}><cylinderGeometry args={[0.3, 0.3, 2]} /><meshStandardMaterial color="#8B4513" /></mesh>
                    <mesh position={[0, 2.5, 0]}><dodecahedronGeometry args={[1.5]} /><meshStandardMaterial color={treeColor} /></mesh>
                 </group>
            </group>
        )
    }

    if (type === SceneType.STUDIO) {
        return (
            <group position={[0, 0, -2]}>
                <mesh position={[0, 1.5, -3]}>
                    <planeGeometry args={[6, 3]} />
                    <meshStandardMaterial color="#ADD8E6" metalness={0.8} roughness={0.1} />
                </mesh>
                <mesh position={[0, 1.5, -3.05]}>
                    <boxGeometry args={[6.2, 3.2, 0.1]} />
                    <meshStandardMaterial color="#8B4513" />
                </mesh>
                
                <mesh position={[0, 0.02, 2]} rotation={[-Math.PI/2, 0, 0]}>
                    <planeGeometry args={[1.5, 3]} />
                    <meshStandardMaterial color="#FF69B4" />
                </mesh>

                <group position={[3, 0, -2]}>
                    <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.4, 0.3, 1]} /><meshStandardMaterial color="#A0522D" /></mesh>
                    <mesh position={[0, 1.2, 0]}><dodecahedronGeometry args={[0.6]} /><meshStandardMaterial color="green" /></mesh>
                </group>
            </group>
        )
    }

    if (type === SceneType.RESTAURANT) {
        return (
            <group position={[0, 0, 0]}>
                <mesh position={[0, 1, 2]} castShadow receiveShadow>
                    <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
                    <meshStandardMaterial color="#FFF" />
                </mesh>
                <mesh position={[0, 0.5, 2]}><cylinderGeometry args={[0.2, 0.2, 1]} /><meshStandardMaterial color="#333" /></mesh>
                <group position={[0, 0.5, 3.5]} rotation={[0, Math.PI, 0]}>
                    <VoxelCat />
                </group>
                <group position={[2.5, 0, 2]} rotation={[0, -0.8, 0]}>
                    <VoxelRabbit state={RabbitState.IDLE} outfit={Outfit.WORK} isDirty={false} hunger={100} weight={50} role="WAITER" />
                </group>
                <group position={[-3, 0, 4]} rotation={[0, 0.5, 0]}>
                     <mesh position={[0, 1, 0]}><cylinderGeometry args={[1, 1, 0.1]} /><meshStandardMaterial color="#EEE" /></mesh>
                     <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.2, 0.2, 1]} /><meshStandardMaterial color="#333" /></mesh>
                     <group position={[0, 0, -1]}>
                         <VoxelRabbit state={RabbitState.EATING} outfit={Outfit.CASUAL} isDirty={false} hunger={100} weight={60} role="EXTRA" />
                     </group>
                </group>
                <mesh position={[0.5, 1.1, 1.8]} rotation={[-Math.PI/2, 0, -0.2]}>
                    <planeGeometry args={[0.4, 0.6]} />
                    <meshStandardMaterial color="yellow" />
                </mesh>
                <mesh position={[-0.3, 1.06, 2.2]}><cylinderGeometry args={[0.4, 0.3, 0.05]} /><meshStandardMaterial color="white" /></mesh>
                <mesh position={[0, 1.06, 1.8]}><cylinderGeometry args={[0.4, 0.3, 0.05]} /><meshStandardMaterial color="white" /></mesh>
            </group>
        );
    }

    if (type === SceneType.CINEMA) {
        return (
            <group position={[0, 0, 0]}>
                <mesh position={[0, 3, -4]}>
                    <planeGeometry args={[8, 4]} />
                    <meshStandardMaterial color="#EEE" emissive="#EEE" emissiveIntensity={0.3} />
                </mesh>
                <mesh position={[0, 0.5, 2]} rotation={[0, 0, 0]}>
                    <boxGeometry args={[3, 0.5, 1]} />
                    <meshStandardMaterial color="#800000" />
                </mesh>
                <mesh position={[0, 1.5, 2.4]}>
                    <boxGeometry args={[3, 1.5, 0.2]} />
                    <meshStandardMaterial color="#800000" />
                </mesh>
            </group>
        );
    }
    
    if (type === SceneType.TV_ROOM) {
        return (
             <group position={[0, 0, 2]}>
                 <mesh position={[0, 0.5, 0]}>
                     <boxGeometry args={[3, 0.5, 1]} />
                     <meshStandardMaterial color="#483D8B" />
                 </mesh>
                 <mesh position={[0, 1.2, 0.4]}>
                     <boxGeometry args={[3, 1, 0.2]} />
                     <meshStandardMaterial color="#483D8B" />
                 </mesh>
                 <group position={[0, 0, -3]}>
                     <mesh position={[0, 0.5, 0]}><boxGeometry args={[2, 0.8, 0.5]} /><meshStandardMaterial color="#333" /></mesh>
                     <mesh position={[0, 1.5, 0]}>
                         <boxGeometry args={[2, 1.2, 0.1]} />
                         <meshStandardMaterial color="black" />
                     </mesh>
                     <mesh position={[0, 1.5, 0.06]}>
                         <planeGeometry args={[1.8, 1]} />
                         <meshStandardMaterial color="#A8D8FF" emissive="#A8D8FF" emissiveIntensity={0.5} />
                     </mesh>
                 </group>
             </group>
        );
    }
    
    if (type === SceneType.PICNIC) {
        return (
            <group position={[2.5, 0, -2]}>
                <mesh position={[0, 1, 0]} castShadow>
                    <cylinderGeometry args={[0.5, 0.4, 2]} />
                    <meshStandardMaterial color="#8B4513" />
                </mesh>
                <mesh position={[0, 2.5, 0]} castShadow>
                    <dodecahedronGeometry args={[1]} />
                    <meshStandardMaterial color={treeColor} />
                </mesh>
                <mesh position={[-2.5, 0.02, 2]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
                    <planeGeometry args={[3, 3]} />
                    <meshStandardMaterial color="red" /> 
                </mesh>
                <mesh position={[-3.5, 0.4, 2.5]} castShadow>
                    <boxGeometry args={[0.8, 0.6, 0.5]} />
                    <meshStandardMaterial color="#DEB887" />
                </mesh>
                <group position={[-2.5, 0.1, 1.5]}>
                    <FoodItems />
                </group>
            </group>
        );
    }

    // Default Living Room
    return (
        <group position={[2.5, 0, -2]}>
            <mesh position={[0, 1, 0]} castShadow>
                <cylinderGeometry args={[0.5, 0.4, 2]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
             <mesh position={[0, 2.5, 0]} castShadow>
                <dodecahedronGeometry args={[1]} />
                <meshStandardMaterial color={treeColor} />
            </mesh>

            {season === Season.AUTUMN && (
                <mesh position={[1, 0.5, 0.5]}>
                    <sphereGeometry args={[0.4]} />
                    <meshStandardMaterial color="orange" />
                    <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.05, 0.05, 0.2]} /><meshStandardMaterial color="green" /></mesh>
                </mesh>
            )}
            {season === Season.WINTER && (
                <group position={[-1, 0.6, 1]}>
                    <mesh position={[0, 0, 0]}><sphereGeometry args={[0.4]} /><meshStandardMaterial color="white" /></mesh>
                    <mesh position={[0, 0.6, 0]}><sphereGeometry args={[0.3]} /><meshStandardMaterial color="white" /></mesh>
                    <mesh position={[0, 0.6, 0.3]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[0.05, 0.2, 8]} /><meshStandardMaterial color="orange" /></mesh>
                </group>
            )}
        </group>
    );
}

const Scene: React.FC<SceneProps> = ({ 
    state, outfit, scene, season, weather, isDirty, showCookie, workTimer, 
    isWorking, hunger = 100, timeOfDay = 12, weight, lampOn,
    tasks, onAddTask, onToggleTask, dailyHygiene
}) => {
  
  let rabbitPosition: [number, number, number] = [0, -1.5, 0];
  let rabbitRotation: [number, number, number] = [0, 0, 0];
  
  if (scene === SceneType.BEDROOM) rabbitPosition = [-2, -0.2, -2];
  if (scene === SceneType.RESTAURANT) rabbitPosition = [0, -1.5, 0.8]; 
  if (scene === SceneType.CINEMA || scene === SceneType.TV_ROOM) rabbitPosition = [0, -0.5, 2]; 
  if (scene === SceneType.PICNIC) rabbitPosition = [0, -1.5, 0]; 
  if (scene === SceneType.OFFICE) rabbitPosition = [0, -1.5, 0];
  if (scene === SceneType.STUDIO) rabbitPosition = [0, -1.5, 2]; 
  if (scene === SceneType.POOL) rabbitPosition = [0, -1.5, 0]; 
  if (scene === SceneType.BATHROOM) rabbitPosition = [0, -1.5, 0]; 
  if (scene === SceneType.NIGHTCLUB) rabbitPosition = [0, -1.5, 2]; // Foreground center

  let groundColor = "#FFF5F7"; 
  if (season === Season.WINTER) groundColor = "#F0F8FF"; 
  if (season === Season.AUTUMN) groundColor = "#FFE4B5"; 
  if (scene === SceneType.GYM) groundColor = "#e5e5e5";
  if (scene === SceneType.BEDROOM) groundColor = "#FFEFF5";
  if (scene === SceneType.OFFICE) groundColor = "#F5F5DC";
  if (scene === SceneType.CINEMA) groundColor = "#222"; 
  if (scene === SceneType.RESTAURANT) groundColor = "#3E2723";
  if (scene === SceneType.PICNIC) groundColor = "#90EE90";
  if (scene === SceneType.POOL) groundColor = "#1E90FF"; 
  if (scene === SceneType.TRACK) groundColor = "#8B4513"; 
  if (scene === SceneType.STUDIO) groundColor = "#D2B48C"; 
  if (scene === SceneType.BATHROOM) groundColor = "#E0F7FA";
  if (scene === SceneType.NIGHTCLUB) groundColor = "#000";

  const isNight = timeOfDay >= 22 || timeOfDay < 6;
  
  let lightIntensity = isNight ? (lampOn ? 1.0 : 0.3) : (weather === Weather.RAIN || weather === Weather.CLOUDY ? 0.8 : 1.2);
  let lightColor = isNight ? (lampOn ? "#FFD700" : "#483D8B") : (weather === Weather.RAIN ? "#B0C4DE" : "#FFF");
  
  if (scene === SceneType.CINEMA) { lightIntensity = 0.8; lightColor = "#AAA"; }
  if (scene === SceneType.RESTAURANT) { lightIntensity = 1.5; lightColor = "#FFD700"; }
  if (scene === SceneType.TV_ROOM) lightIntensity = 1.0;
  if (scene === SceneType.BATHROOM) { lightIntensity = 1.2; lightColor = "#F0FFFF"; }
  if (scene === SceneType.NIGHTCLUB) { lightIntensity = 0.4; lightColor = "#FF00FF"; }

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas shadows camera={{ position: [0, 1.5, 8], fov: 50 }}>
        <Suspense fallback={null}>
          {isNight && !lampOn && scene !== SceneType.CINEMA && scene !== SceneType.BATHROOM && scene !== SceneType.NIGHTCLUB && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
          
          <ambientLight intensity={lightIntensity * 0.6} color={lightColor} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={lightIntensity} 
            color={lightColor}
            castShadow 
            shadow-mapSize={1024}
          />
          
          {lampOn && isNight && <pointLight position={[0, 3, 0]} intensity={0.5} color="#FFA500" distance={10} decay={2} />}
          {scene === SceneType.NIGHTCLUB && (
              <>
                 <pointLight position={[0, 3, 0]} intensity={0.8} color="magenta" distance={20} decay={2} />
                 <pointLight position={[-3, 1, 2]} intensity={0.8} color="cyan" distance={10} decay={2} />
              </>
          )}
          
          <group position={[0, -1.5, 0]}>
             <EnvironmentProps type={scene} season={season} activeState={state} />
             
             {/* Floor for shadows */}
             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <shadowMaterial transparent opacity={0.15} />
             </mesh>
             
             {/* Base Ground Plane */}
             {scene !== SceneType.NIGHTCLUB && (
                 <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial color={groundColor} />
                 </mesh>
             )}
          </group>

          {(scene === SceneType.LIVING_ROOM || scene === SceneType.PICNIC || scene === SceneType.TRACK) && (
              <ParticleSystem weather={weather} />
          )}

          <group position={rabbitPosition} rotation={rabbitRotation as any}>
             <VoxelRabbit 
                state={state} 
                outfit={outfit} 
                isDirty={isDirty} 
                hunger={hunger} 
                weather={weather} 
                scene={scene}
                weight={weight}
                dailyHygiene={dailyHygiene}
             />
          </group>
          
          {showCookie && <Cookie3D breakTime={15} />}
          
          <SoftShadows size={15} samples={12} />
          <OrbitControls enableZoom={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2.2} enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene;
