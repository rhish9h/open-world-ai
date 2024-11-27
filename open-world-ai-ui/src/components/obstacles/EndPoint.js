import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import BeaconLight from '../effects/BeaconLight';

function EndPoint({ position, onCollision, showBeacon = true }) {
  const meshRef = useRef();
  const time = useRef(0);
  const { scene } = useThree();

  // Create custom shader material for the cylinder
  const cylinderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      baseColor: { value: new THREE.Color('#FF69B4') }, // Hot pink
      waveColor: { value: new THREE.Color('#FFB6C1') }  // Light pink
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
        // Base pulsating effect with faster speed for end point
        float pulse = sin(time * 3.0) * 0.2 + 0.8;
        
        // Create multiple wave patterns with different frequencies
        float wave1 = sin(vUv.y * 12.0 + time * 4.0) * 0.5 + 0.5;
        float wave2 = cos(vUv.x * 10.0 + time * 3.0) * 0.5 + 0.5;
        float wave3 = sin((vUv.x + vUv.y) * 6.0 + time * 5.0) * 0.5 + 0.5;
        
        // Combine waves with different weights
        float waves = wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3;
        
        // Create double spiral pattern
        float angle = atan(vPosition.x, vPosition.z);
        float spiral1 = sin(angle * 6.0 + time * 4.0 + vPosition.y * 3.0) * 0.5 + 0.5;
        float spiral2 = cos(angle * 4.0 - time * 3.0 + vPosition.y * 2.0) * 0.5 + 0.5;
        float spirals = mix(spiral1, spiral2, 0.5);
        
        // Combine all effects
        vec3 finalColor = mix(baseColor, waveColor, waves * spirals * pulse);
        
        // Add brightness variation
        finalColor *= (0.8 + pulse * 0.2);
        
        // Add enhanced sparkle effect
        float sparkle = fract(sin(dot(vUv + time * 0.2, vec2(12.9898, 78.233))) * 43758.5453);
        finalColor += vec3(sparkle * 0.15);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    side: THREE.DoubleSide
  });

  useFrame((state, delta) => {
    time.current += delta;
    cylinderMaterial.uniforms.time.value = time.current;

    // Add floating movement with larger amplitude for end point
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time.current * 1.5) * 0.15;
      meshRef.current.rotation.y += delta * 0.8; // Faster rotation for end point

      // Check for character collision
      const character = scene.getObjectByName("Character");
      if (character) {
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
      {showBeacon && <BeaconLight color="#FF69B4" height={50} intensity={1.0} pulseSpeed={1.2} />}
    </group>
  );
}

export default EndPoint;
