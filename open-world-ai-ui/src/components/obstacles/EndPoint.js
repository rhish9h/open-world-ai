import React, { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function EndPoint({ 
  position = [0, 0, 0], 
  scale = [1, 1, 1], 
  color = '#ff3366',
  radius = 2,
  height = 4 
}) {
  const hologramRef = useRef();
  const glowRef = useRef();
  const ringRef = useRef();
  const particlesRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate the hologram
    if (hologramRef.current) {
      hologramRef.current.rotation.y += 0.005;
    }
    
    // Pulse the glow
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.5 + Math.sin(time * 2) * 0.2;
    }
    
    // Rotate and pulse the ring
    if (ringRef.current) {
      ringRef.current.rotation.y -= 0.01;
      ringRef.current.scale.x = ringRef.current.scale.z = 1 + Math.sin(time * 3) * 0.1;
    }

    // Animate particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] = Math.sin(time + positions[i] * 0.5) * 0.5; // Y position
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Base hologram cylinder */}
      <mesh ref={hologramRef} receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 32]} />
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

      {/* Inner glow */}
      <mesh ref={glowRef} position={[0, height/4, 0]}>
        <cylinderGeometry args={[radius * 0.8, radius * 0.8, height * 0.8, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Rotating ring */}
      <mesh ref={ringRef} position={[0, height/2, 0]}>
        <torusGeometry args={[radius * 1.2, 0.1, 16, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Finish text */}
      <group position={[0, height/2, 0]}>
        <Text
          position={[0, 0, radius]}
          rotation={[0, 0, 0]}
          fontSize={0.5}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          FINISH
        </Text>
        <Text
          position={[0, 0, -radius]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.5}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          FINISH
        </Text>
      </group>

      {/* Ground marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[radius * 1.2, radius * 1.4, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Victory particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={new Float32Array(300).map(() => (Math.random() - 0.5) * radius * 2)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color={color}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export default EndPoint;
