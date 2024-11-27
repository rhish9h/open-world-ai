import React, { useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Checkpoint({ 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [4, 3, 0.1],
  color = '#4CAF50',
  checkpointNumber = 1,
  onPlayerPass = () => {},
}) {
  const [isPassed, setIsPassed] = useState(false);
  const wallRef = useRef();
  const particlesRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Wall pulsing effect
    if (wallRef.current) {
      wallRef.current.material.opacity = 0.3 + Math.sin(time * 1.5) * 0.1;
    }

    // Particle animation
    if (particlesRef.current && isPassed) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.02; // Move particles upward
        if (positions[i + 1] > scale[1]) {
          positions[i + 1] = 0; // Reset particle position
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Glow effect
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.4 + Math.sin(time * 2) * 0.1;
    }
  });

  // Create particle geometry
  const particleCount = 50;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * scale[0];     // X
    particlePositions[i + 1] = Math.random() * scale[1];         // Y
    particlePositions[i + 2] = (Math.random() - 0.5) * scale[2]; // Z
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Main holographic wall */}
      <mesh ref={wallRef} receiveShadow>
        <boxGeometry args={scale} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.3}
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Checkpoint number */}
      <Text
        position={[0, scale[1]/2 + 0.3, 0]}
        fontSize={0.5}
        color={color}
        anchorX="center"
        anchorY="bottom"
      >
        {`Checkpoint ${checkpointNumber}`}
      </Text>

      {/* Glow effect */}
      <mesh ref={glowRef} scale={[1.1, 1.1, 1.1]}>
        <boxGeometry args={scale} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Particles effect (visible when passed) */}
      {isPassed && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attachObject={['attributes', 'position']}
              count={particleCount}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color={color}
            size={0.1}
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
}

export default Checkpoint;
