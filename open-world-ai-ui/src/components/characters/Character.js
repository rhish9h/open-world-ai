// src/components/characters/Character.js
import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import useKeyboardControls from '../../hooks/useKeyboardControls';

function Character(props) {
  const ref = useRef();
  const controlsRef = useRef(); // Reference for OrbitControls
  const { camera, gl } = useThree(); // Include gl

  // Load the GLTF model with animations
  const { scene: characterScene, animations } = useGLTF('/models/animated_character.glb');
  characterScene.traverse((object) => {
    object.castShadow = true;
  });

  // Setup animations
  const { actions } = useAnimations(animations, ref);

  // Get keyboard input
  const { forward, backward, left, right } = useKeyboardControls();

  // Movement speed
  const speed = 4; // Adjusted speed for smoother movement

  // Current action
  let currentAction = '';

  useFrame((state, delta) => {
    if (ref.current && controlsRef.current) {
      const velocity = new THREE.Vector3();
      const direction = new THREE.Vector3();

      // Get the direction the camera is facing
      camera.getWorldDirection(direction);
      direction.y = 0; // Ignore vertical component
      direction.normalize();

      // Get the right vector from the camera
      const rightVector = new THREE.Vector3();
      rightVector.crossVectors(camera.up, direction).normalize();

      // Calculate movement direction based on key inputs
      if (forward) velocity.add(direction);
      if (backward) velocity.sub(direction);
      if (left) velocity.add(rightVector);
      if (right) velocity.sub(rightVector);

      // Normalize velocity and move character
      if (velocity.length() > 0) {
        velocity.normalize();
        ref.current.position.addScaledVector(velocity, speed * delta);

        // Rotate character to face movement direction
        const angle = Math.atan2(velocity.x, velocity.z);
        ref.current.rotation.y = angle;

        // Play walking animation
        if (currentAction !== 'Walking') {
          actions.Idle?.stop();
          actions.Walking?.play();
          currentAction = 'Walking';
        }
      } else {
        // Play idle animation
        if (currentAction !== 'Idle') {
          actions.Walking?.stop();
          actions.Idle?.play();
          currentAction = 'Idle';
        }
      }

      // Update OrbitControls target to follow the character at a fixed height
      const characterPosition = ref.current.position.clone();
      characterPosition.y += 1.5; // Adjust this value as needed
      controlsRef.current.target.copy(characterPosition);
    }
  });

  return (
    <>
      <primitive ref={ref} object={characterScene} />

      <OrbitControls
        ref={controlsRef}
        args={[camera, gl.domElement]} // Pass camera and DOM element
        enableDamping={true}
        dampingFactor={0.1}
        enablePan={false}
        minPolarAngle={Math.PI / 4} // Prevent camera from going too low (45 degrees)
        maxPolarAngle={Math.PI / 2} // Prevent camera from going under the ground (90 degrees)
        minDistance={5}
        maxDistance={10}
      />
    </>
  );
}

export default Character;
