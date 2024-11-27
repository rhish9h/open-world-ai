import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GroundArrow({
  position = [0, 0.01, 0], // Slightly above ground to prevent z-fighting
  rotation = [0, 0, 0],
  scale = [2, 2, 1],
  color = '#FFD700',
}) {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.opacity = 0.6 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
    }
  });

  // Create arrow shape
  const shape = new THREE.Shape();
  
  // Arrow body
  shape.moveTo(-0.25, -0.5);
  shape.lineTo(0.25, -0.5);
  shape.lineTo(0.25, 0);
  shape.lineTo(0.5, 0);
  shape.lineTo(0, 0.5);
  shape.lineTo(-0.5, 0);
  shape.lineTo(-0.25, 0);
  shape.lineTo(-0.25, -0.5);

  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[shape]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color={color}
          transparent
          opacity={0.6}
          metalness={0.3}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default GroundArrow;
