import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Checkpoint({ position, rotation }) {
  const meshRef = useRef();
  const [isPassed, setIsPassed] = useState(false);
  const [passEffect, setPassEffect] = useState(false);
  const time = useRef(0);

  // Create a translucent material with custom shader for the wall
  const wallMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      baseColor: { value: new THREE.Color('#87CEEB') },
      opacity: { value: 0.5 },
      isPassed: { value: 0 },
      passEffect: { value: 0 }
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
      uniform float passEffect;
      varying vec2 vUv;
      
      void main() {
        // Base color and opacity
        vec3 color = baseColor;
        float alpha = opacity;

        // Create flowing effect
        float flow = sin(vUv.y * 10.0 + time * 2.0) * 0.1;
        
        // Add vertical gradient
        float gradient = 1.0 - abs(vUv.y - 0.5) * 0.5;
        
        // Pulsing effect
        float pulse = sin(time * 2.0) * 0.15 + 0.85;
        
        // Pass-through effect
        if (passEffect > 0.0) {
          vec2 center = vec2(0.5, 0.5);
          float dist = length(vUv - center);
          float ripple = sin(dist * 30.0 - time * 10.0) * 0.5 + 0.5;
          color += vec3(1,1,1) * ripple * passEffect;
          alpha = mix(alpha, 1.0, passEffect * ripple);
        }
        
        // Combine all effects
        color = color * (1.0 + flow) * pulse;
        alpha = alpha * gradient * pulse;
        
        if (isPassed > 0.0) {
          color += vec3(0.2, 0.2, 0.4);
        }
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });

  // Create burst particles for pass-through effect
  const particleCount = 100;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = Math.random() * 0.2;
    
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 4 - 2;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    
    velocities[i * 3] = Math.cos(angle) * 0.1;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
    velocities[i * 3 + 2] = Math.sin(angle) * 0.1;
    
    const color = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.8);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    
    sizes[i] = Math.random() * 0.2 + 0.1;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      passEffect: { value: 0 }
    },
    vertexShader: `
      attribute vec3 velocity;
      attribute vec3 color;
      attribute float size;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float time;
      uniform float passEffect;
      
      void main() {
        vColor = color;
        vec3 pos = position;
        if (passEffect > 0.0) {
          pos += velocity * time * 5.0;
        }
        vAlpha = passEffect * (1.0 - length(pos) * 0.5);
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      
      void main() {
        if (vAlpha <= 0.0) discard;
        vec2 xy = gl_PointCoord.xy - vec2(0.5);
        float ll = length(xy);
        if (ll > 0.5) discard;
        gl_FragColor = vec4(vColor, vAlpha * (0.5 - ll));
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  useEffect(() => {
    if (isPassed) {
      setPassEffect(true);
      setTimeout(() => setPassEffect(false), 1500);
    }
  }, [isPassed]);

  useFrame((state, delta) => {
    time.current += delta;
    
    // Update materials
    wallMaterial.uniforms.time.value = time.current;
    wallMaterial.uniforms.isPassed.value = isPassed ? 1.0 : 0.0;
    wallMaterial.uniforms.passEffect.value = passEffect ? 1.0 : 0.0;
    
    particleMaterial.uniforms.time.value = time.current;
    particleMaterial.uniforms.passEffect.value = passEffect ? 1.0 : 0.0;
    
    // Subtle floating movement
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time.current) * 0.1;
    }

    // Check if player is near the checkpoint
    const playerPosition = state.camera.position;
    const checkpointPos = new THREE.Vector3(position[0], position[1], position[2]);
    const distance = checkpointPos.distanceTo(playerPosition);
    
    if (distance < 2 && !isPassed) {
      setIsPassed(true);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Main checkpoint wall */}
      <mesh ref={meshRef}>
        <planeGeometry args={[4, 4]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      
      {/* Particle effects */}
      <points>
        <primitive object={particleGeometry} attach="geometry" />
        <primitive object={particleMaterial} attach="material" />
      </points>
    </group>
  );
}

export default Checkpoint;
