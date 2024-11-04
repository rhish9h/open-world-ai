import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

function AICharacter({ onInteract, ...props }) {
  const ref = useRef();
  const { scene } = useGLTF("/models/granny.glb");

  const handlePointerDown = (event) => {
    event.stopPropagation();
    console.log("Clicked on AI Character")
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
