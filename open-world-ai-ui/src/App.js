// src/App.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Character from './components/characters/Character';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Canvas>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />

        {/* Character */}
        <Character position={[0, 0, 0]} />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Controls */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
