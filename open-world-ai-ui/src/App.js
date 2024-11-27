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
    startPosition: [-25, 0, -30],
    endPosition: [25, 0, -30],
    obstacles: [
      // North side obstacles (positive z direction)
      { 
        type: 'pillar',
        position: [-15, 1, -20],
        scale: [0.8, 3, 0.8],
        rotation: [0, Math.PI / 4, 0]
      },
      { 
        type: 'bubble',
        position: [-8, 2.5, -22],
        radius: 1.2
      },
      {
        type: 'platform',
        position: [0, 1, -18],
        scale: [3, 0.5, 3],
        rotation: [0, Math.PI / 6, 0]
      },
      {
        type: 'pyramid',
        position: [10, 1, -20],
        scale: [1.5, 2, 1.5],
        rotation: [0, -Math.PI / 6, 0]
      },
      
      // South side obstacles (negative z direction)
      { 
        type: 'bridge',
        position: [-12, 1.5, -40],
        scale: [4, 0.5, 1.5],
        rotation: [0, Math.PI / 8, 0]
      },
      {
        type: 'bubble',
        position: [-5, 2, -38],
        radius: 0.9
      },
      {
        type: 'platform',
        position: [5, 1, -42],
        scale: [2.5, 0.5, 2.5],
        rotation: [0, -Math.PI / 4, 0]
      },
      {
        type: 'pillar',
        position: [15, 1, -38],
        scale: [0.7, 2.5, 0.7],
        rotation: [0, Math.PI / 3, 0]
      }
    ],
    checkpoints: [
      // First checkpoint (North side)
      { position: [-5, 1, -20], rotation: [0, Math.PI / 2, 0] },
      // Second checkpoint (South side)
      { position: [5, 1, -40], rotation: [0, Math.PI / 2, 0] }
    ],
    // Single path of arrows: Start -> Checkpoint 1 -> Checkpoint 2 -> End
    arrows: [
      // Start to First Checkpoint - all arrows point to (-5, -20)
      { position: [-23, 0.01, -30], rotation: [0, Math.PI - Math.atan2(10, 18), 0] },  // Point to CP1
      { position: [-19, 0.01, -28], rotation: [0, Math.PI - Math.atan2(8, 14), 0] },   // Point to CP1
      { position: [-15, 0.01, -26], rotation: [0, Math.PI - Math.atan2(6, 10), 0] },   // Point to CP1
      { position: [-11, 0.01, -24], rotation: [0, Math.PI - Math.atan2(4, 6), 0] },    // Point to CP1
      { position: [-7, 0.01, -21], rotation: [0, Math.PI - Math.atan2(1, 2), 0] },     // Point to CP1
      
      // First Checkpoint to Second Checkpoint - all arrows point to (5, -40)
      { position: [-3, 0.01, -22], rotation: [0, Math.PI - Math.atan2(-18, 8), 0] },   // Point to CP2
      { position: [-1, 0.01, -26], rotation: [0, Math.PI - Math.atan2(-14, 6), 0] },   // Point to CP2
      { position: [1, 0.01, -30], rotation: [0, Math.PI - Math.atan2(-10, 4), 0] },    // Point to CP2
      { position: [3, 0.01, -34], rotation: [0, Math.PI - Math.atan2(-6, 2), 0] },     // Point to CP2
      { position: [5, 0.01, -38], rotation: [0, Math.PI - Math.atan2(-2, 0), 0] },     // Point to CP2
      
      // Second Checkpoint to End - all arrows point to (25, -30)
      { position: [8, 0.01, -38], rotation: [0, Math.PI - Math.atan2(8, 17), 0] },     // Point to End
      { position: [12, 0.01, -36], rotation: [0, Math.PI - Math.atan2(6, 13), 0] },    // Point to End
      { position: [16, 0.01, -34], rotation: [0, Math.PI - Math.atan2(4, 9), 0] },     // Point to End
      { position: [20, 0.01, -32], rotation: [0, Math.PI - Math.atan2(2, 5), 0] },     // Point to End
      { position: [23, 0.01, -30], rotation: [0, Math.PI - Math.atan2(0, 2), 0] }      // Point to End
    ]
  }
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
          <Terrain />
          {courses.map((course) => (
            <ObstacleCourse
              key={course.id}
              courseId={course.id}
              startPosition={course.startPosition}
              endPosition={course.endPosition}
              obstacles={course.obstacles}
              checkpoints={course.checkpoints}
              arrows={course.arrows}
            />
          ))}
          <Character position={[0, 1, 0]} />
          <AICharacter position={[5, 1, 0]} onInteract={handleAIInteract} />
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
