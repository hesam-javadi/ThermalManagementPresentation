import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CircuitThermalVisualization: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create circuit board base
  const boardGeometry = useMemo(() => new THREE.BoxGeometry(3, 0.1, 3), []);
  const boardMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#004040', 
    metalness: 0.5, 
    roughness: 0.2,
    emissive: '#001010',
    emissiveIntensity: 0.2
  }), []);
  
  // Create circuit traces
  const traces = useMemo(() => {
    const lines = [];
    // Horizontal traces
    for (let i = -1.2; i <= 1.2; i += 0.2) {
      lines.push(
        <mesh key={`h-${i}`} position={[0, 0.06, i]} rotation={[0, 0, 0]}>
          <boxGeometry args={[2.8, 0.02, 0.02]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
      );
    }
    
    // Vertical traces
    for (let i = -1.2; i <= 1.2; i += 0.2) {
      lines.push(
        <mesh key={`v-${i}`} position={[i, 0.06, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[2.8, 0.02, 0.02]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
      );
    }
    
    return lines;
  }, []);
  
  // Create heat sinks and components
  const components = useMemo(() => {
    const parts = [];
    
    // Main CPU
    parts.push(
      <group key="cpu" position={[0, 0.05, 0]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.8]} />
          <meshStandardMaterial color="#202020" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Heat spreader */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.6, 0.05, 0.6]} />
          <meshStandardMaterial color="#505050" metalness={1} roughness={0.1} />
        </mesh>
      </group>
    );
    
    // Air cooler
    parts.push(
      <group key="air-cooler" position={[-1, 0.05, -1]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.4, 0.1, 0.4]} />
          <meshStandardMaterial color="#202020" />
        </mesh>
        {/* Fins */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={`fin-${i}`} position={[0, 0.1 + i * 0.05, 0]}>
            <boxGeometry args={[0.6, 0.01, 0.6]} />
            <meshStandardMaterial color="#707070" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
    );
    
    // Water block
    parts.push(
      <group key="water-block" position={[1, 0.05, 1]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.4, 0.1, 0.4]} />
          <meshStandardMaterial color="#202020" />
        </mesh>
        {/* Top plate */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshStandardMaterial 
            color="#0055aa" 
            metalness={0.8} 
            roughness={0.1} 
            transparent={true} 
            opacity={0.8} 
          />
        </mesh>
        {/* Tubes */}
        <mesh position={[0.2, 0.15, 0]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
          <meshStandardMaterial color="#101010" roughness={0.8} />
        </mesh>
        <mesh position={[-0.2, 0.15, 0]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
          <meshStandardMaterial color="#101010" roughness={0.8} />
        </mesh>
      </group>
    );
    
    // Heat pipe
    parts.push(
      <group key="heat-pipe" position={[-1, 0.05, 1]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.4, 0.1, 0.4]} />
          <meshStandardMaterial color="#202020" />
        </mesh>
        {/* Base plate */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.5, 0.03, 0.5]} />
          <meshStandardMaterial color="#707070" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Heat pipes */}
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh key={`pipe-${i}`} position={[0, 0.15, -0.1 + i * 0.1]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
            <meshStandardMaterial color="#cc7722" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>
    );
    
    return parts;
  }, []);
  
  // Heat particles
  const HeatParticles = () => {
    const count = 300;
    const positions = useMemo(() => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        pos[i3] = (Math.random() - 0.5) * 3;
        pos[i3 + 1] = Math.random() * 0.1;
        pos[i3 + 2] = (Math.random() - 0.5) * 3;
      }
      return pos;
    }, [count]);
    
    const sizes = useMemo(() => {
      const size = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        size[i] = Math.random() * 0.03 + 0.01;
      }
      return size;
    }, [count]);
    
    const pointsRef = useRef<THREE.Points>(null);
    
    useFrame((state) => {
      if (pointsRef.current) {
        const time = state.clock.getElapsedTime();
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          
          // Constant upward movement with slight speed variation
          const speed = 0.004 + (i % 5) * 0.001;
          positions[i3 + 1] += speed;
          
          // Add very subtle horizontal drift
          positions[i3] += (Math.random() - 0.5) * 0.001;
          positions[i3 + 2] += (Math.random() - 0.5) * 0.001;
          
          // Reset particles that go too high
          if (positions[i3 + 1] > 1) {
            positions[i3] = (Math.random() - 0.5) * 3;
            positions[i3 + 1] = 0; // Reset to bottom
            positions[i3 + 2] = (Math.random() - 0.5) * 3;
          }
        }
        
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    });
    
    return (
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            count={count} 
            array={positions} 
            itemSize={3}
            args={[positions, 3]}
          />
          <bufferAttribute 
            attach="attributes-size" 
            count={count} 
            array={sizes} 
            itemSize={1}
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.05} 
          color="#00ffff" 
          sizeAttenuation 
          transparent 
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    );
  };
  
  // Animate the group
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = t * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Circuit board */}
      <mesh geometry={boardGeometry} material={boardMaterial} receiveShadow />
      
      {/* Circuit traces */}
      {traces}
      
      {/* Components */}
      {components}
      
      {/* Heat particles */}
      <HeatParticles />
    </group>
  );
}; 