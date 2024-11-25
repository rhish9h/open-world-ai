import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, Environment, Sparkles } from "@react-three/drei";
import { Physics } from '@react-three/cannon';
import Character from "./components/characters/Character";
import AICharacter from "./components/characters/AICharacter";
import Chat from './components/chat/Chat';
import axios from "axios";
import Terrain from "./components/environment/Terrain";
import ObstacleCourse from "./components/obstacles/ObstacleCourse";

// Define obstacle courses
const courses = [
  {
    id: 'course1',
    startPosition: [-15, 0, -15],
    endPosition: [15, 0, -15],
    obstacles: [
      { 
        type: 'barrier', 
        position: [-10, 1, -15], 
        scale: [0.3, 2, 4], 
        rotation: [0, Math.PI / 6, 0] 
      },
      { 
        type: 'corridor', 
        position: [0, 1, -15], 
        scale: [8, 2, 3] 
      },
      { 
        type: 'maze', 
        position: [10, 1, -15], 
        scale: [6, 2, 6] 
      },
    ]
  },
  // Add more courses here as needed
];

function App() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatOnLeft, setChatOnLeft] = useState(false);

  const handleAIInteract = ({ isOnRight }) => {
    console.log("Showing chat");
    setShowChat(true);
    setChatOnLeft(isOnRight);
  };

  const handleCloseChat = () => {
    setShowChat(false);
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

        <Physics>
          {/* Characters */}
          <Character position={[0, 0, 0]} />
          <AICharacter position={[4, 0, 0]} onInteract={handleAIInteract} />
          
          {/* Render obstacle courses */}
          {courses.map(course => (
            <ObstacleCourse
              key={course.id}
              courseId={course.id}
              startPosition={course.startPosition}
              endPosition={course.endPosition}
              obstacles={course.obstacles}
            />
          ))}

          {/* Terrain */}
          <Terrain />
        </Physics>
      </Canvas>

      {showChat && (
        <Chat
          onClose={handleCloseChat}
          onSendMessage={handleSendMessage}
          messages={messages}
          isOnLeft={chatOnLeft}
        />
      )}
    </div>
  );
}

export default App;
