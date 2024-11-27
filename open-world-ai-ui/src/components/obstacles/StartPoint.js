import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import BeaconLight from '../effects/BeaconLight';

function StartPoint({ position, onCollision, showBeacon = true }) {
  const meshRef = useRef();
  const time = useRef(0);
  const { scene } = useThree();

  // Create custom shader material for the cylinder
  const cylinderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      baseColor: { value: new THREE.Color('#32CD32') }, // Lime green
      waveColor: { value: new THREE.Color('#98FB98') }  // Pale green
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 baseColor;
      uniform vec3 waveColor;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Base pulsating effect
        float pulse = sin(time * 2.0) * 0.15 + 0.85;
        
        // Create multiple wave patterns
        float wave1 = sin(vUv.y * 10.0 + time * 3.0) * 0.5 + 0.5;
        float wave2 = cos(vUv.x * 8.0 + time * 2.0) * 0.5 + 0.5;
        float wave3 = sin((vUv.x + vUv.y) * 5.0 + time * 4.0) * 0.5 + 0.5;
        
        // Combine waves with different weights
        float waves = wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3;
        
        // Create spiral pattern
        float angle = atan(vPosition.x, vPosition.z);
        float spiral = sin(angle * 4.0 + time * 3.0 + vPosition.y * 2.0) * 0.5 + 0.5;
        
        // Combine all effects
        vec3 finalColor = mix(baseColor, waveColor, waves * spiral * pulse);
        
        // Add brightness variation
        finalColor *= (0.8 + pulse * 0.2);
        
        // Add sparkle effect
        float sparkle = fract(sin(dot(vUv + time * 0.1, vec2(12.9898, 78.233))) * 43758.5453);
        finalColor += vec3(sparkle * 0.1);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    side: THREE.DoubleSide
  });

  useFrame((state, delta) => {
    time.current += delta;
    cylinderMaterial.uniforms.time.value = time.current;

    // Add floating movement
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time.current) * 0.1;
      meshRef.current.rotation.y += delta * 0.5;

      // Find the character in the scene
      const character = scene.getObjectByName('Character');
      if (character) {
        // Check for player collision using character position
        const characterPosition = character.position;
        const distance = new THREE.Vector3(
          characterPosition.x - position[0],
          0,
          characterPosition.z - position[2]
        ).length();

        if (distance < 2 && onCollision) {
          onCollision();
        }
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[1, 1, 0.5, 32]} />
        <primitive object={cylinderMaterial} attach="material" />
      </mesh>
      {showBeacon && <BeaconLight color="#32CD32" height={40} intensity={0.8} pulseSpeed={0.8} />}
    </group>
  );
}

export default StartPoint;
