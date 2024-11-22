import React, { useMemo } from 'react';
import * as THREE from 'three';

function Terrain() {
  // Generate a procedural heightmap
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 100, 64, 64);
    const pos = geo.attributes.position;
    
    // Add some gentle height variation
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, Math.sin(x * 0.1) * Math.sin(z * 0.1) * 0.5);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Create a mixed grass color
  const grassColors = [
    new THREE.Color('#90B53D'), // Light green
    new THREE.Color('#496F1D'), // Dark green
    new THREE.Color('#A2BD5A'), // Yellow-green
  ];

  return (
    <group>
      {/* Main terrain */}
      <mesh 
        receiveShadow 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.1, 0]}
      >
        <primitive object={geometry} />
        <meshPhongMaterial
          color={grassColors[0]}
          shininess={0}
          vertexColors={true}
          onBeforeCompile={(shader) => {
            shader.uniforms.time = { value: 0 };
            shader.vertexShader = `
              varying vec2 vUv;
              ${shader.vertexShader}
            `.replace(
              '#include <begin_vertex>',
              `
                #include <begin_vertex>
                vUv = uv;
              `
            );
            shader.fragmentShader = `
              varying vec2 vUv;
              ${shader.fragmentShader}
            `.replace(
              '#include <color_fragment>',
              `
                #include <color_fragment>
                vec3 color1 = vec3(0.565, 0.710, 0.239);
                vec3 color2 = vec3(0.286, 0.435, 0.114);
                vec3 color3 = vec3(0.635, 0.741, 0.353);
                
                float noise = sin(vUv.x * 50.0) * sin(vUv.y * 50.0);
                vec3 mixedColor = mix(color1, color2, noise);
                mixedColor = mix(mixedColor, color3, sin(vUv.x * 30.0 + vUv.y * 30.0) * 0.5 + 0.5);
                
                diffuseColor.rgb = mixedColor;
              `
            );
          }}
        />
      </mesh>

      {/* Ground decorations */}
      {Array.from({ length: 200 }).map((_, i) => {
        const position = [
          Math.random() * 80 - 40,
          0,
          Math.random() * 80 - 40
        ];
        const scale = Math.random() * 0.3 + 0.1;
        const rotation = Math.random() * Math.PI;

        return (
          <mesh
            key={i}
            position={position}
            rotation={[0, rotation, 0]}
            scale={[scale, scale, scale]}
          >
            <coneGeometry args={[0.2, 1, 4]} />
            <meshPhongMaterial color={grassColors[Math.floor(Math.random() * grassColors.length)]} />
          </mesh>
        );
      })}
    </group>
  );
}

export default Terrain;
