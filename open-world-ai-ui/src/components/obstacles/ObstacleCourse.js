import React from 'react';
import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import StartPoint from './StartPoint';
import EndPoint from './EndPoint';

// Default walking-friendly obstacles
const defaultObstacles = [
  { type: 'barrier', position: [5, 1, 0], scale: [0.3, 2, 4], rotation: [0, Math.PI / 6, 0] },
  { type: 'corridor', position: [10, 1, 0], scale: [6, 2, 2] },
  { type: 'maze', position: [15, 1, 0], scale: [4, 2, 4] },
];

function Barrier({ position, scale, rotation = [0, 0, 0] }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    rotation,
    args: scale,
  }));

  return (
    <mesh ref={ref} position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#666666" metalness={0.5} roughness={0.5} />
    </mesh>
  );
}

function Corridor({ position, scale }) {
  return (
    <group position={position}>
      {/* Left wall */}
      <Barrier 
        position={[-scale[0]/4, 0, 0]} 
        scale={[0.3, scale[1], scale[2]]} 
      />
      {/* Right wall */}
      <Barrier 
        position={[scale[0]/4, 0, 0]} 
        scale={[0.3, scale[1], scale[2]]} 
      />
      {/* Floor marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -scale[1]/2 + 0.01, 0]}>
        <planeGeometry args={[scale[0]/2, scale[2]]} />
        <meshStandardMaterial color="#444444" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function Maze({ position, scale }) {
  const wallThickness = 0.3;
  const wallHeight = scale[1];
  
  return (
    <group position={position}>
      {/* Outer walls */}
      <Barrier position={[-scale[0]/2, 0, 0]} scale={[wallThickness, wallHeight, scale[2]]} />
      <Barrier position={[scale[0]/2, 0, 0]} scale={[wallThickness, wallHeight, scale[2]]} />
      <Barrier position={[0, 0, -scale[2]/2]} scale={[scale[0], wallHeight, wallThickness]} />
      <Barrier position={[0, 0, scale[2]/2]} scale={[scale[0], wallHeight, wallThickness]} />
      
      {/* Inner maze walls */}
      <Barrier 
        position={[-scale[0]/4, 0, -scale[2]/4]} 
        scale={[scale[0]/2, wallHeight, wallThickness]}
        rotation={[0, Math.PI/4, 0]}
      />
      <Barrier 
        position={[scale[0]/4, 0, scale[2]/4]} 
        scale={[scale[0]/2, wallHeight, wallThickness]}
        rotation={[0, -Math.PI/4, 0]}
      />
      
      {/* Floor marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -scale[1]/2 + 0.01, 0]}>
        <planeGeometry args={[scale[0], scale[2]]} />
        <meshStandardMaterial color="#444444" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function PathMarker({ start, end, color = '#444444' }) {
  return (
    <mesh position={[(start[0] + end[0])/2, 0.01, (start[2] + end[2])/2]}>
      <planeGeometry args={[0.5, 0.5]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

function ObstacleCourse({ 
  startPosition = [0, 0, 0],
  endPosition = [20, 0, 0],
  obstacles = defaultObstacles,
  courseId = 'course1'
}) {
  const renderObstacle = (obstacle) => {
    switch (obstacle.type) {
      case 'barrier':
        return <Barrier key={`${courseId}-barrier-${obstacle.position.join('-')}`} {...obstacle} />;
      case 'corridor':
        return <Corridor key={`${courseId}-corridor-${obstacle.position.join('-')}`} {...obstacle} />;
      case 'maze':
        return <Maze key={`${courseId}-maze-${obstacle.position.join('-')}`} {...obstacle} />;
      default:
        return null;
    }
  };

  // Calculate path markers positions
  const pathPoints = [startPosition, ...obstacles.map(o => o.position), endPosition];
  const pathMarkers = pathPoints.slice(0, -1).map((point, index) => (
    <PathMarker 
      key={`${courseId}-path-${index}`}
      start={point}
      end={pathPoints[index + 1]}
      color={index === 0 ? '#00ff88' : '#444444'}
    />
  ));

  return (
    <group>
      <StartPoint position={startPosition} />
      {obstacles.map(renderObstacle)}
      {pathMarkers}
      <EndPoint position={endPosition} />
    </group>
  );
}

export default ObstacleCourse;
