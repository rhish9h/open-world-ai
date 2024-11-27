import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Checkpoint({ position, onPlayerPass }) {
  const meshRef = useRef();
  const [isPassed, setIsPassed] = useState(false);
  const time = useRef(0);
  const { scene } = useThree();

  const wallMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      baseColor: { value: new THREE.Color('#87CEEB') },
      opacity: { value: 0.5 },
      isPassed: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 baseColor;
      uniform float opacity;
      uniform float isPassed;
      varying vec2 vUv;
      
      void main() {
        vec3 color = mix(baseColor, vec3(0.0, 1.0, 0.0), isPassed); // Mix colors based on isPassed
        float alpha = opacity;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  });

  useEffect(() => {
    if (isPassed) {
      wallMaterial.uniforms.isPassed.value = 1.0;
    }
  }, [isPassed]);

  useFrame((state, delta) => {
    time.current += delta;
    wallMaterial.uniforms.time.value = time.current;

    if (!meshRef.current || isPassed) return;

    const character = scene.getObjectByName('Character');
    if (character) {
      const characterPosition = character.position;
      const distance = new THREE.Vector3(
        characterPosition.x - position[0],
        0,
        characterPosition.z - position[2]
      ).length();

      if (distance < 2) {
        setIsPassed(true);
        onPlayerPass();
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} material={wallMaterial}>
        <planeGeometry args={[4, 4]} />
      </mesh>
    </group>
  );
}

export default Checkpoint;
