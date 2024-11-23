// src/components/characters/Character.js
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import useKeyboardControls from '../../hooks/useKeyboardControls';

function Character(props) {
  const ref = useRef();
  const cameraRef = useRef(new THREE.Vector3());
  const { camera } = useThree();

  // Load the GLTF model with animations
  const { scene, animations } = useGLTF('/models/animated_character.glb');
  scene.traverse((object) => {
    object.castShadow = true;
  });

  // Setup animations
  const { actions } = useAnimations(animations, ref);

  // Get keyboard input
  const { forward, backward, left, right } = useKeyboardControls();

  // Camera settings
  const cameraDistance = 8;    // Increased from 5 to 8 (further back)
  const cameraHeight = 3.5;    // Increased from 2 to 3.5 (higher up)
  const cameraSmoothness = 0.1;  // Lower = smoother camera

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

      // Update camera position
      const characterPosition = ref.current.position;
      const characterRotation = ref.current.rotation;

      // Calculate ideal camera position (behind and above character)
      const idealOffset = new THREE.Vector3(
        -Math.sin(characterRotation.y) * cameraDistance,
        cameraHeight,
        -Math.cos(characterRotation.y) * cameraDistance
      );

      const idealPosition = new THREE.Vector3();
      idealPosition.copy(characterPosition).add(idealOffset);

      // Smoothly move camera to ideal position
      cameraRef.current.lerp(idealPosition, cameraSmoothness);
      camera.position.copy(cameraRef.current);

      // Make camera look at character
      const lookAtPosition = new THREE.Vector3();
      lookAtPosition.copy(characterPosition).add(new THREE.Vector3(0, 1, 0));
      camera.lookAt(lookAtPosition);
    }
  });

  // Initialize camera position
  useEffect(() => {
    if (ref.current) {
      const pos = ref.current.position;
      cameraRef.current.set(pos.x, pos.y + cameraHeight, pos.z + cameraDistance);
      camera.position.copy(cameraRef.current);
      camera.lookAt(pos);
    }
  }, [camera]);

  return <primitive ref={ref} object={scene} />;
}

export default Character;
