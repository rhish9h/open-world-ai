import React from 'react';
import { useBox } from '@react-three/cannon';
import StartPoint from './StartPoint';
import EndPoint from './EndPoint';

const defaultObstacles = [
  { type: 'wall', position: [5, 1.5, 0], scale: [0.5, 3, 4] },
  { type: 'platform', position: [10, 1, 0], scale: [4, 0.5, 4] },
  { type: 'gap', position: [15, 0, 0], scale: [3, 0.1, 4] },
];

function Wall({ position, scale }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: scale,
  }));

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#666666" />
    </mesh>
  );
}

function Platform({ position, scale }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: scale,
  }));

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#444444" />
    </mesh>
  );
}

function Gap({ position, scale }) {
  return (
    <group position={position}>
      <mesh position={[-scale[0]/2 - 0.5, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.2, scale[2]]} />
        <meshStandardMaterial color="#ff4444" />
      </mesh>
      <mesh position={[scale[0]/2 + 0.5, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.2, scale[2]]} />
        <meshStandardMaterial color="#ff4444" />
      </mesh>
    </group>
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
      case 'wall':
        return <Wall key={`${courseId}-wall-${obstacle.position.join('-')}`} {...obstacle} />;
      case 'platform':
        return <Platform key={`${courseId}-platform-${obstacle.position.join('-')}`} {...obstacle} />;
      case 'gap':
        return <Gap key={`${courseId}-gap-${obstacle.position.join('-')}`} {...obstacle} />;
      default:
        return null;
    }
  };

  return (
    <group>
      <StartPoint position={startPosition} />
      {obstacles.map(renderObstacle)}
      <EndPoint position={endPosition} />
    </group>
  );
}

export default ObstacleCourse;
