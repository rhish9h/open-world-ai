import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function BeaconLight({ color, height = 50, intensity = 1.0, pulseSpeed = 1.0 }) {
  const beaconRef = useRef();
  const time = useRef(0);

  // Create custom shader material for the beacon
  const beaconMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(color) },
      height: { value: height },
      intensity: { value: intensity }
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
      uniform vec3 color;
      uniform float height;
      uniform float intensity;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Create vertical gradient
        float gradient = 1.0 - vUv.y;
        
        // Add moving waves
        float wave = sin(vUv.y * 20.0 - time * 2.0) * 0.5 + 0.5;
        
        // Create pulsing effect
        float pulse = sin(time * 2.0) * 0.3 + 0.7;
        
        // Add vertical beam effect
        float beam = smoothstep(0.4, 0.6, wave) * gradient;
        
        // Combine effects
        float alpha = beam * pulse * intensity * (1.0 - vUv.y * 0.8);
        
        // Add sparkles
        float sparkle = fract(sin(dot(vUv + time * 0.1, vec2(12.9898, 78.233))) * 43758.5453);
        alpha += sparkle * 0.1 * gradient;
        
        // Final color
        vec3 finalColor = color * (1.0 + pulse * 0.2);
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  useFrame((state, delta) => {
    time.current += delta * pulseSpeed;
    beaconMaterial.uniforms.time.value = time.current;
  });

  return (
    <group ref={beaconRef}>
      {/* Vertical beacon light */}
      <mesh position={[0, height/2, 0]}>
        <planeGeometry args={[2, height]} />
        <primitive object={beaconMaterial} attach="material" />
      </mesh>
      {/* Perpendicular plane for cross effect */}
      <mesh position={[0, height/2, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[2, height]} />
        <primitive object={beaconMaterial} attach="material" />
      </mesh>
    </group>
  );
}

export default BeaconLight;
