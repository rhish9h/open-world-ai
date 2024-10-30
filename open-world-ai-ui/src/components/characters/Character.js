// src/components/characters/Character.js
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import useKeyboardControls from '../../hooks/useKeyboardControls';

function Character(props) {
  const ref = useRef();

  // Load the GLTF model with animations
  const { scene, animations } = useGLTF('/models/animated_character.glb');
  scene.traverse((object) => {
    object.castShadow = true;
  });

  // Setup animations
  const { actions } = useAnimations(animations, ref);

  // Get keyboard input
  const { forward, backward, left, right } = useKeyboardControls();

  // Movement speed
  const speed = 2;

  // Current action
  let currentAction = '';

  useFrame((state, delta) => {
    if (ref.current) {
      // Calculate direction
      let direction = { x: 0, z: 0 };
      if (forward) direction.z -= 1;
      if (backward) direction.z += 1;
      if (left) direction.x -= 1;
      if (right) direction.x += 1;

      // Normalize direction
      const length = Math.hypot(direction.x, direction.z);
      if (length > 0) {
        direction.x /= length;
        direction.z /= length;

        // Update position
        ref.current.position.x += direction.x * speed * delta;
        ref.current.position.z += direction.z * speed * delta;

        // Rotate character to face direction
        const angle = Math.atan2(direction.x, direction.z);
        ref.current.rotation.y = angle;

        // Play walking animation
        if (currentAction !== 'Walking') {
          actions.Idle.stop();
          actions.Walking.play();
          currentAction = 'Walking';
        }
      } else {
        // Play idle animation
        if (currentAction !== 'Idle') {
          actions.Walking.stop();
          actions.Idle.play();
          currentAction = 'Idle';
        }
      }
    }
  });

  return <primitive ref={ref} object={scene} />;
}

export default Character;
