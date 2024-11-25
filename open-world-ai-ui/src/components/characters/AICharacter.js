import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function AICharacter({ onInteract, ...props }) {
  const ref = useRef();
  const { camera, size } = useThree();

  // Load the GLTF model with animations
  const { scene, animations } = useGLTF("/models/granny.glb");

  // Set up animations
  const { actions } = useAnimations(animations, ref);

  // Play the idle animation on load
  useEffect(() => {
    if (actions && actions["Idle"]) {
      actions["Idle"].play();
    } else {
      console.warn("Idle animation not found in granny.glb");
    }
  }, [actions]);

  // Track screen position
  useFrame(() => {
    if (ref.current) {
      const vector = new THREE.Vector3();
      ref.current.getWorldPosition(vector);
      vector.project(camera);
      const x = (vector.x * 0.5 + 0.5) * size.width;
      const isOnRight = x > size.width / 2;
      ref.current.screenPosition = { x, isOnRight };
    }
  });

  const handlePointerDown = (event) => {
    event.stopPropagation();
    if (onInteract && ref.current?.screenPosition) {
      onInteract({ isOnRight: ref.current.screenPosition.isOnRight });
    }
  };

  return (
    <primitive
      ref={ref}
      object={scene}
      onPointerDown={handlePointerDown}
      {...props}
    />
  );
}

export default AICharacter;
