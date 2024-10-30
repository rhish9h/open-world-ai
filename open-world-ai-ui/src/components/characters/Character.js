// src/Character.js
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function Character(props) {
  const { scene } = useGLTF('/models/character.glb');
  const ref = useRef();

  // Animation or movement logic goes here

  return <primitive ref={ref} object={scene} {...props} />;
}

export default Character;
