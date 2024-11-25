import React from 'react';
import { useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';

function StartPoint({ position = [0, 0, 0], scale = [1, 1, 1], color = '#00ff00' }) {
  return (
    <group position={position}>
      {/* Base platform */}
      <mesh 
        position={[0, 0.1, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
      </mesh>
      
      {/* Flag pole */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Flag */}
      <mesh position={[0.5, 3.5, 0]} castShadow>
        <boxGeometry args={[1, 0.8, 0.05]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Start text */}
      <Text
        position={[0, 0.5, 1.2]}
        rotation={[0, Math.PI / 4, 0]}
        fontSize={0.5}
        color="#ffffff"
      >
        START
      </Text>
    </group>
  );
}

export default StartPoint;
