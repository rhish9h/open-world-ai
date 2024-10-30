// src/components/characters/Character.js
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import useKeyboardControls from "../../hooks/useKeyboardControls";

function Character(props) {
  const ref = useRef();

  // Load the GLTF model
  const { scene } = useGLTF("/models/character.glb");
  ref.current = scene;

  // Get keyboard input
  const { forward, backward, left, right } = useKeyboardControls();

  // Movement speed
  const speed = 2;

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
      }
    }
  });

  return <primitive object={scene} />;
}

export default Character;
