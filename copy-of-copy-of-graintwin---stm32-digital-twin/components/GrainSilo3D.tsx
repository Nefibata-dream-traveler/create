
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SystemState } from '../types';

// Add type augmentation to support Three.js elements in JSX
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

interface SiloProps {
  state: SystemState;
}

const SiloModel: React.FC<{ state: SystemState }> = ({ state }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Keep a reference to the latest state for the animation loop
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Generate Grain Particles (Cylindrical Volume)
  const particleCount = 12000;
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Uniform distribution within a cylinder
      const r = 1.9 * Math.sqrt(Math.random()); 
      const theta = Math.random() * 2 * Math.PI;
      const y = Math.random() * 4; // Height 0 to 4

      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Initial color (Gold/Yellow)
      cols[i * 3] = 0.99;     // R
      cols[i * 3 + 1] = 0.83; // G
      cols[i * 3 + 2] = 0.30; // B
    }
    return { positions: pos, colors: cols };
  }, []);

  // Removed shadowed 'state' parameter to avoid confusion with SiloProps state
  useFrame(() => {
    if (!pointsRef.current) return;
    
    const geometry = pointsRef.current.geometry;
    const colorsAttr = geometry.attributes.color;
    const positionsArray = geometry.attributes.position.array;
    const colorsArray = colorsAttr.array;
    
    const { temperatures, humidity } = stateRef.current;
    
    // Define Colors
    // Base: Gold (#fcd34d) -> 0.99, 0.83, 0.30

    const t1 = temperatures[0]; // Bottom (y ~ 0.5)
    const t2 = temperatures[1]; // Middle (y ~ 2.0)
    const t3 = temperatures[2]; // Top    (y ~ 3.5)

    const isHumid = humidity > 60;
    // Moisture pocket coords (Simulated leak location)
    const leakX = 1.2;
    const leakY = 1.0;
    const leakZ = 0;
    const leakRadius = 1.8;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const x = positionsArray[idx];
      const y = positionsArray[idx + 1];
      const z = positionsArray[idx + 2];

      // --- 1. Temperature Interpolation ---
      let localTemp = 25;
      if (y < 2.0) {
        const t = Math.max(0, Math.min(1, (y - 0.5) / 1.5));
        localTemp = t1 + (t2 - t1) * t;
      } else {
        const t = Math.max(0, Math.min(1, (y - 2.0) / 1.5));
        localTemp = t2 + (t3 - t2) * t;
      }
      const heatFactor = Math.max(0, Math.min(1, (localTemp - 28) / 15));

      // --- 2. Humidity Logic (Localized Pocket) ---
      let wetFactor = 0;
      if (isHumid) {
        const dist = Math.sqrt((x - leakX)**2 + (y - leakY)**2 + (z - leakZ)**2);
        if (dist < leakRadius) {
           const severity = (humidity - 60) / 40; 
           wetFactor = Math.max(0, (1 - dist / leakRadius)) * severity;
        }
      }

      // --- 3. Mix Colors ---
      let r = 0.99;
      let g = 0.83;
      let b = 0.30;

      // Apply Heat (Reddish Orange)
      if (heatFactor > 0) {
        r = r + (0.94 - r) * heatFactor;
        g = g + (0.27 - g) * heatFactor;
        b = b + (0.27 - b) * heatFactor;
      }

      // Apply Wetness (Cyan/Blue) - Overrides heat visually
      if (wetFactor > 0) {
        r = r + (0.02 - r) * wetFactor;
        g = g + (0.71 - g) * wetFactor;
        b = b + (0.83 - b) * wetFactor;
      }

      colorsArray[idx] = r;
      colorsArray[idx + 1] = g;
      colorsArray[idx + 2] = b;
    }

    colorsAttr.needsUpdate = true;
  });

  return (
    <group position={[0, -2, 0]}>
      {/* Silo Glass Shell */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[2.1, 2.1, 5, 32, 1, true]} />
        <meshPhysicalMaterial 
          color="#94a3b8" 
          transparent 
          opacity={0.1} 
          metalness={0.9} 
          roughness={0.1} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      
      {/* Silo Cap/Ring */}
      <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.1, 0.1, 16, 100]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Grain Particles with Vertex Colors */}
      <points ref={pointsRef} position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.05} 
          vertexColors
          transparent 
          opacity={0.85} 
          sizeAttenuation 
          blending={THREE.NormalBlending}
        />
      </points>

      {/* Sensor Probes Visualization */}
      {[0.5, 2.0, 3.5].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh>
            <sphereGeometry args={[0.15]} />
            <meshBasicMaterial color={state.temperatures[i] > 30 ? "#ef4444" : "#22c55e"} />
          </mesh>
          <Html position={[0.2, 0, 0]} center>
            <div className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-md whitespace-nowrap border border-slate-600">
              传感器 {i + 1}: {state.temperatures[i].toFixed(1)}°C
            </div>
          </Html>
        </group>
      ))}

      {/* Pest Marker (Mesh) */}
      {state.pestCount > 0 && state.pestPosition && (
        <group position={[state.pestPosition.x * 1.8, 4.05, state.pestPosition.y * 1.8]}>
          <mesh>
             <sphereGeometry args={[0.25]} />
             <meshStandardMaterial color="#ef4444" emissive="#991b1b" emissiveIntensity={0.8} />
          </mesh>
          <pointLight distance={3} intensity={5} color="red" />
           <Html position={[0, 0.4, 0]} center zIndexRange={[100, 0]}>
            <div className="bg-red-600/90 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce border-2 border-white/50 shadow-lg shadow-red-900/50 whitespace-nowrap">
              发现害虫
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};

export const GrainSilo3D: React.FC<SiloProps> = ({ state }) => {
  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-slate-900">
      <Canvas shadows camera={{ position: [6, 4, 8], fov: 45 }}>
        <PerspectiveCamera makeDefault position={[6, 4, 8]} fov={45} />
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2} 
          maxDistance={15} 
          minDistance={5} 
        />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#3b82f6" />
        
        <SiloModel state={state} />
        
        <gridHelper args={[20, 20, 0x1e293b, 0x1e293b]} position={[0, -2, 0]} />
      </Canvas>
    </div>
  );
};
