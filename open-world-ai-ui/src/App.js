// src/App.js
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Character from "./components/characters/Character";
import AICharacter from "./components/characters/AICharacter";
import Chat from "./components/Chat";

function App() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleAIInteract = () => {
    console.log("Showing chat");
    setShowChat(true);
  };

  const handleSendMessage = (text) => {
    setMessages([...messages, { sender: "user", text }]);
    // Placeholder for sending message to backend
  };

  return (
    <div style={{ height: "100vh" }}>
      <Canvas>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />

        {/* Character */}
        <Character position={[0, 0, 0]} />
        <AICharacter position={[4, 0, 0]} onInteract={handleAIInteract} />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Controls */}
        <OrbitControls />
      </Canvas>
      {showChat && (
        <Chat
          onClose={() => setShowChat(false)}
          onSendMessage={handleSendMessage}
          messages={messages}
        />
      )}
    </div>
  );
}

export default App;
