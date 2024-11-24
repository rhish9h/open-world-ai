import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, Environment, Sparkles } from "@react-three/drei";
import Character from "./components/characters/Character";
import AICharacter from "./components/characters/AICharacter";
import Chat from './components/chat/Chat';
import axios from "axios";
import Terrain from "./components/environment/Terrain";

function App() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleAIInteract = () => {
    console.log("Showing chat");
    setShowChat(true);
  };

  const handleSendMessage = async (text) => {
    setMessages([...messages, { sender: "user", text }]);
    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", { text });
      const aiText = response.data.response.content;
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: aiText },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        {/* Environment and Lighting */}
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.3} />
        <directionalLight 
          castShadow
          position={[2.5, 8, 5]} 
          intensity={1.5}
          shadow-mapSize={[1024, 1024]}
        />
        <Environment preset="sunset" />
        
        {/* Atmospheric particles */}
        <Sparkles 
          count={200}
          scale={15}
          size={2}
          speed={0.2}
          opacity={0.1}
        />

        {/* Characters */}
        <Character position={[0, 0, 0]} />
        <AICharacter position={[4, 0, 0]} onInteract={handleAIInteract} />

        {/* Terrain */}
        <Terrain />
      </Canvas>

      {showChat && (
        <div className="chat-container">
          <Chat
            messages={messages}
            onClose={() => setShowChat(false)}
            onSendMessage={handleSendMessage}
          />
        </div>
      )}
    </div>
  );
}

export default App;
