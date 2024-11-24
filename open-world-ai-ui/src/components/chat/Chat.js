// src/components/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat({ onClose, onSendMessage, messages }) {
  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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

  const toggleMaximize = () => {
    if (isMinimized) return;
    setIsMaximized(!isMaximized);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMaximized) setIsMaximized(false);
  };

  return (
    <div className={`chat-ui ${isMaximized ? 'maximized' : ''} ${isMinimized ? 'minimized' : ''}`}>
      {!isMinimized ? (
        <>
          <div className="chat-header">
            <h2>AI Assistant</h2>
            <div className="chat-controls">
              <button 
                className="control-button minimize-button" 
                onClick={toggleMinimize}
                title="Minimize"
              >
                <span>─</span>
              </button>
              <button 
                className="control-button maximize-button" 
                onClick={toggleMaximize}
                title={isMaximized ? "Exit Fullscreen" : "Fullscreen"}
              >
                <span>{isMaximized ? '⤓' : '⤢'}</span>
              </button>
              <button 
                className="control-button close-button" 
                onClick={onClose}
                title="Close"
              >
                <span>×</span>
              </button>
            </div>
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
              placeholder="Ask me anything..."
            />
            <button type="submit" className="send-button" title="Send">
              <span>➤</span>
            </button>
          </form>
        </>
      ) : (
        <div className="chat-minimized" onClick={toggleMinimize}>
          <span>AI Assistant</span>
          <button className="restore-button">
            <span>⤢</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Chat;
