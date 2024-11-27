import React, { useRef } from 'react';
import { useBox, useCylinder, useSphere } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Candy-themed color palette
export const candyColors = {
  pink: '#FF69B4',
  blue: '#87CEEB',
  yellow: '#FFD700',
  green: '#98FB98',
  purple: '#DDA0DD',
};

// Common candy material properties
const candyMaterial = {
  metalness: 0.3,
  roughness: 0.2,
  clearcoat: 0.8,
  clearcoatRoughness: 0.2,
};

export function CandyPillar({ position, scale, color = candyColors.pink, rotation = [0, 0, 0] }) {
  const [ref] = useCylinder(() => ({
    type: 'Static',
    position,
    rotation,
    args: [scale[0], scale[0], scale[1], 16],
    mass: 0
  }));

  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.2 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[scale[0], scale[0], scale[1], 16]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color={color}
        {...candyMaterial}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export function CandyBubble({ position, radius = 1, color = candyColors.blue }) {
  const [ref] = useSphere(() => ({
    type: 'Static',
    position,
    args: [radius],
    mass: 0
  }));

  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.2 + Math.sin(state.clock.getElapsedTime() * 3) * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color={color}
        {...candyMaterial}
        emissive={color}
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

export function CandyBridge({ position, scale, color = candyColors.yellow }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: scale,
    mass: 0
  }));

  return (
    <group position={position}>
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={scale} />
        <meshPhysicalMaterial
          color={color}
          {...candyMaterial}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Decorative stripes */}
      <mesh position={[0, scale[1]/2 + 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[scale[0], scale[2]]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

export function CandyPyramid({ position, scale, color = candyColors.purple }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: scale,
    mass: 0
  }));

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <coneGeometry args={[scale[0], scale[1], 4]} />
      <meshPhysicalMaterial
        color={color}
        {...candyMaterial}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

export function CandyPlatform({ position, scale, color = candyColors.green }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: scale,
    mass: 0
  }));

  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.1 + Math.sin(state.clock.getElapsedTime()) * 0.05;
    }
  });

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshPhysicalMaterial
        ref={materialRef}
        color={color}
        {...candyMaterial}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}
