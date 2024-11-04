// src/components/Chat.js
import React, { useState, useEffect, useRef } from 'react';

function Chat({ onClose, onSendMessage, messages }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  // Auto-scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-ui">
      <div className="chat-header">
        <h2>Chat</h2>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">
          <svg viewBox="0 0 24 24">
            <path
              d="M1.5 12L22 3v18L1.5 12z"
              fill="currentColor"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default Chat;
