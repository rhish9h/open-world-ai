// src/components/characters/Character.js
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import useKeyboardControls from '../../hooks/useKeyboardControls';

function Character(props) {
  const ref = useRef();
  const controlsRef = useRef(); // Reference for OrbitControls
  const { camera, gl } = useThree(); // Include gl
  const [isJumping, setIsJumping] = useState(false);
  const currentAction = useRef('Idle');

  // Load the GLTF model with animations
  const { scene: characterScene, animations } = useGLTF('/models/character.glb');
  characterScene.traverse((object) => {
    object.castShadow = true;
  });

  // Setup animations
  const { actions } = useAnimations(animations, ref);

  // Get keyboard input
  const { forward, backward, left, right, jump, shift } = useKeyboardControls();

  // Movement speeds
  const walkSpeed = 4;
  const runSpeed = 8; // 2x walk speed
  const speed = shift ? runSpeed : walkSpeed;

  // Function to handle animation transitions
  const setAnimation = (newAction) => {
    if (currentAction.current !== newAction && !isJumping) {
      const prevAction = actions[currentAction.current];
      const nextAction = actions[newAction];
      
      if (prevAction) {
        prevAction.fadeOut(0.2);
      }
      
      if (nextAction) {
        nextAction.reset().fadeIn(0.2).play();
        currentAction.current = newAction;
      }
    }
  };

  useEffect(() => {
    // Start with Idle animation
    actions.Idle?.play();
  }, [actions]);

  useEffect(() => {
    if (jump && !isJumping) {
      setIsJumping(true);
      const jumpAction = actions['Jumping'];
      if (jumpAction) {
        // Fade out current animation
        const prevAction = actions[currentAction.current];
        if (prevAction) {
          prevAction.fadeOut(0.2);
        }

        jumpAction.reset();
        jumpAction.setLoop(THREE.LoopOnce);
        jumpAction.clampWhenFinished = true;
        jumpAction.fadeIn(0.2).play();
        
        // Reset jumping state when animation completes
        const duration = jumpAction._clip.duration * 1000;
        setTimeout(() => {
          setIsJumping(false);
          jumpAction.fadeOut(0.2);
          // Return to previous animation
          setAnimation(currentAction.current);
        }, duration);
      }
    }
  }, [jump]);

  useFrame((state, delta) => {
    if (ref.current && controlsRef.current) {
      const velocity = new THREE.Vector3();
      const direction = new THREE.Vector3();

      camera.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();

      const rightVector = new THREE.Vector3();
      rightVector.crossVectors(camera.up, direction).normalize();

      // Calculate movement direction based on key inputs
      if (forward) velocity.add(direction);
      if (backward) velocity.sub(direction);
      if (left) velocity.add(rightVector);
      if (right) velocity.sub(rightVector);

      // Move and animate character
      if (velocity.length() > 0) {
        velocity.normalize();
        ref.current.position.addScaledVector(velocity, speed * delta);

        // Rotate character to face movement direction
        const angle = Math.atan2(velocity.x, velocity.z);
        ref.current.rotation.y = angle;

        // Set appropriate movement animation
        setAnimation(shift ? 'Running' : 'Walking');
      } else if (!isJumping) {
        // Return to idle if not moving and not jumping
        setAnimation('Idle');
      }

      // Update camera target
      if (controlsRef.current) {
        controlsRef.current.target.copy(ref.current.position);
      }
    }
  });

  return (
    <>
      <primitive ref={ref} object={characterScene} name="Character" />

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
