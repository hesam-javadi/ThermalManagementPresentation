import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

// Glowing particles
const GlowingParticles: React.FC = () => {
  const ref = useRef<THREE.Points>(null!);
  
  // Generate random particles
  const count = 2000;
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 30; 
      positions[i3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, [count]);

  // Store original positions
  const originalPositions = useMemo(() => {
    return particlePositions.slice();
  }, [particlePositions]);

  // Random colors for particles
  const colors = useMemo(() => {
    const particleColors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#0ff"), // Cyan
      new THREE.Color("#f0f"), // Magenta
      new THREE.Color("#ff0"), // Yellow
      new THREE.Color("#0cf"), // Light blue
      new THREE.Color("#f09")  // Pink
    ];
    
    for (let i = 0; i < count; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      const i3 = i * 3;
      particleColors[i3] = color.r;
      particleColors[i3 + 1] = color.g;
      particleColors[i3 + 2] = color.b;
    }
    
    return particleColors;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      const time = clock.getElapsedTime();
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      const boundaryLimit = 50;
      
      // Move particles with different speeds
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const speed = Math.sin(i * 0.01) * 0.01 + 0.02;  // Varied speed
        
        positions[i3 + 1] += Math.sin((i + time) * 0.2) * 0.02;
        positions[i3] += Math.cos((i + time) * 0.1) * 0.02;
        positions[i3 + 2] -= speed; // Move towards camera
        
        // Reset particles that move out of range
        if (positions[i3 + 2] < -30) {
          positions[i3] = (Math.random() - 0.5) * 50;
          positions[i3 + 1] = (Math.random() - 0.5) * 30;
          positions[i3 + 2] = 50; // Reset to far away
        }
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Create color attribute for the geometry
  const colorAttribute = new THREE.BufferAttribute(colors, 3);

  return (
    <Points ref={ref} positions={particlePositions} stride={3} frustumCulled={false}>
      <pointsMaterial 
        size={0.5}
        sizeAttenuation={true}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
      {/* Apply colors directly to the geometry */}
    </Points>
  );
};

// Combined background effect
const BackgroundEffect: React.FC = () => {
  return (
    <>
      <GlowingParticles />
      <fog attach="fog" args={["var(--dark)", 20, 80]} />
      <ambientLight intensity={0.2} />
    </>
  );
};

export default BackgroundEffect; 