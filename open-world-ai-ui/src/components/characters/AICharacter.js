import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

function AICharacter({ onInteract, ...props }) {
  const ref = useRef();

  // Load the GLTF model with animations
  const { scene, animations } = useGLTF("/models/granny.glb");

  // Set up animations
  const { actions } = useAnimations(animations, ref);

  // Play the idle animation on load
  useEffect(() => {
    // Check if the 'Idle' animation exists
    if (actions && actions["Idle"]) {
      actions["Idle"].play();
    } else {
      console.warn("Idle animation not found in granny.glb");
    }
  }, [actions]);

  const handlePointerDown = (event) => {
    event.stopPropagation();
    console.log("Clicked on AI Character");
    if (onInteract) onInteract();
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
