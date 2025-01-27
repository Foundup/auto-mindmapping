import React, { useState, useRef, useEffect } from 'react';
import '../styles/ChatDialog.css';

function ChatDialog({ onSendMessage, result }) {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hi! I can help you create and modify mind maps. What would you like to explore?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Add new message when result changes
  useEffect(() => {
    if (result) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I\'ve updated the mind map. Would you like me to explain any part of it or help you modify it?' 
      }]);
    }
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Send to parent for processing
    if (onSendMessage) {
      onSendMessage(input);
    }
  };

  const toggleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`chat-dialog ${isOpen ? 'open' : ''} ${isMinimized ? 'minimized' : ''}`}>
      <div className="chat-header" onClick={toggleMinimize}>
        <div className="chat-title">
          <img src="/logo192.png" alt="AI Assistant" className="chat-logo" />
          <span>AI Assistant</span>
        </div>
        <div className="chat-controls">
          <button className="minimize-button" onClick={toggleMinimize}>
            {isMinimized ? '▲' : '▼'}
          </button>
          <button className="close-button" onClick={() => setIsOpen(false)}>
            ×
          </button>
        </div>
      </div>
      {!isMinimized && (
        <>
          <div className="messages-container">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                {message.role === 'assistant' && (
                  <img src="/logo192.png" alt="AI" className="message-avatar" />
                )}
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the mind map..."
              className="chat-input"
            />
            <button type="submit" className="send-button" disabled={!input.trim()}>
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default ChatDialog; 