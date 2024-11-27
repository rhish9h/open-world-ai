import React, { useState } from 'react';
import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import StartPoint from './StartPoint';
import EndPoint from './EndPoint';
import Checkpoint from './Checkpoint';
import GroundArrow from './GroundArrow';
import {
  CandyPillar,
  CandyBubble,
  CandyBridge,
  CandyPyramid,
  CandyPlatform,
  candyColors
} from './CandyObstacles';

// Helper function to ensure obstacles are above ground
const validateHeight = (position) => {
  return [position[0], Math.max(position[1], 0.5), position[2]];
};

// Default walking-friendly obstacles with candy theme
const defaultObstacles = [
  { 
    type: 'pillar',
    position: validateHeight([5, 1, 0]),
    scale: [1, 2, 1],
    rotation: [0, Math.PI / 6, 0],
    color: candyColors.pink
  },
  {
    type: 'bridge',
    position: validateHeight([10, 1, 0]),
    scale: [6, 0.5, 2],
    color: candyColors.yellow
  },
  {
    type: 'bubble',
    position: validateHeight([15, 2, 0]),
    radius: 1.5,
    color: candyColors.blue
  },
  {
    type: 'pyramid',
    position: validateHeight([20, 1, 0]),
    scale: [2, 3, 2],
    color: candyColors.purple
  },
  {
    type: 'platform',
    position: validateHeight([25, 1, 0]),
    scale: [4, 0.5, 4],
    color: candyColors.green
  }
];

// Default checkpoint positions
const defaultCheckpoints = [
  { position: [7.5, 1, 0], rotation: [0, Math.PI / 2, 0] },
  { position: [17.5, 1, 0], rotation: [0, Math.PI / 2, 0] }
];

// Default arrow positions and rotations to guide players
const defaultArrows = [
  { position: [2.5, 0.01, 0], rotation: [0, 0, 0] },
  { position: [12.5, 0.01, 0], rotation: [0, 0, 0] },
  { position: [22.5, 0.01, 0], rotation: [0, 0, 0] }
];

function ObstacleCourse({ 
  startPosition = [0, 0, 0],
  endPosition = [30, 0, 0],
  obstacles = defaultObstacles,
  checkpoints = defaultCheckpoints,
  arrows = defaultArrows,
  courseId = 'course1'
}) {
  const [checkpointsPassed, setCheckpointsPassed] = useState(new Set());

  const handleCheckpointPass = (checkpointNumber) => {
    setCheckpointsPassed(prev => new Set([...prev, checkpointNumber]));
  };

  const renderObstacle = (obstacle, index) => {
    const { type, position, scale, rotation, color, radius } = obstacle;
    
    switch (type) {
      case 'pillar':
        return (
          <CandyPillar
            key={`${courseId}-pillar-${index}`}
            position={position}
            scale={scale}
            rotation={rotation}
            color={color}
          />
        );
      case 'bridge':
        return (
          <CandyBridge
            key={`${courseId}-bridge-${index}`}
            position={position}
            scale={scale}
            color={color}
          />
        );
      case 'bubble':
        return (
          <CandyBubble
            key={`${courseId}-bubble-${index}`}
            position={position}
            radius={radius}
            color={color}
          />
        );
      case 'pyramid':
        return (
          <CandyPyramid
            key={`${courseId}-pyramid-${index}`}
            position={position}
            scale={scale}
            color={color}
          />
        );
      case 'platform':
        return (
          <CandyPlatform
            key={`${courseId}-platform-${index}`}
            position={position}
            scale={scale}
            color={color}
          />
        );
      default:
        return null;
    }
  };

  return (
    <group>
      {/* Start and End points */}
      <StartPoint position={startPosition} />
      <EndPoint position={endPosition} />

      {/* Checkpoints */}
      {checkpoints.map((checkpoint, index) => (
        <Checkpoint
          key={`${courseId}-checkpoint-${index}`}
          position={checkpoint.position}
          rotation={checkpoint.rotation}
          checkpointNumber={index + 1}
          onPlayerPass={() => handleCheckpointPass(index)}
        />
      ))}

      {/* Ground Arrows */}
      {arrows.map((arrow, index) => (
        <GroundArrow
          key={`${courseId}-arrow-${index}`}
          position={arrow.position}
          rotation={arrow.rotation}
          color={candyColors.yellow}
        />
      ))}

      {/* Obstacles */}
      {obstacles.map((obstacle, index) => renderObstacle(obstacle, index))}
    </group>
  );
}

export default ObstacleCourse;
