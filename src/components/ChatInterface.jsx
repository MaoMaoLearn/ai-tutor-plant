import React, { useState, useEffect, useRef } from 'react';
import { Send, LogOut, Loader2 } from 'lucide-react';
import { sendDialogueTurn } from '../api';
import './ChatInterface.css';

export default function ChatInterface({ sessionId, studentName, conceptTopic, onEndSession }) {
  const [messages, setMessages] = useState([
    {
      id: "init_msg",
      sender: "ai",
      text: `Hi ${studentName}! I'm so excited to explore **${conceptTopic}** with you today.\n\nType your first message below, and let's go on an adventure to discover how it works!`,
      isInitial: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWaiting]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isWaiting) return;

    const userText = inputText.trim();
    const newUserMsg = { id: Date.now().toString(), sender: 'student', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsWaiting(true);

    try {
      const response = await sendDialogueTurn(sessionId, userText, conceptTopic);
      // Expected response format: { type: "dialogue_turn", metacognitive: "string", question: "string", exchangeCount: number }
      
      const newAiMsg = {
        id: Date.now().toString() + "_ai",
        sender: 'ai',
        text: response.question || "Oops, I lost my train of thought! Could you repeat that?",
        metacognitive: response.metacognitive || response.metacognition
      };
      
      setMessages(prev => [...prev, newAiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "_error",
        sender: 'ai',
        text: "Uh oh, something went wrong on my end. Can we try again?",
        isError: true
      }]);
    } finally {
      setIsWaiting(false);
    }
  };

  const handleEndClick = () => {
    onEndSession(messages);
  };

  return (
    <div className="chat-container">
      <header className="chat-header glass-panel">
        <div className="chat-title">
          <h2>Learning: {conceptTopic}</h2>
        </div>
        <button onClick={handleEndClick} className="end-session-btn" disabled={isWaiting}>
          <LogOut size={16} /> End Session
        </button>
      </header>
      
      <div className="messages-area">
        {messages.map(msg => (
          <div key={msg.id} className={`message-row ${msg.sender === 'student' ? 'row-student' : 'row-ai'} animate-slide-up`}>
            {msg.sender === 'ai' && (
              <div className="avatar ai-avatar">AI</div>
            )}
            
            <div className={`message-bubble ${msg.sender === 'student' ? 'bubble-student' : 'bubble-ai'} ${msg.isError ? 'bubble-error' : ''}`}>
              {msg.metacognitive && (
                <div className="meta-reflection">
                  {msg.metacognitive}
                </div>
              )}
              <div className="msg-text">{msg.text}</div>
            </div>

            {msg.sender === 'student' && (
              <div className="avatar student-avatar">{studentName.charAt(0).toUpperCase()}</div>
            )}
          </div>
        ))}
        
        {isWaiting && (
          <div className="message-row row-ai animate-slide-up">
             <div className="avatar ai-avatar">AI</div>
             <div className="message-bubble bubble-ai typing-indicator">
                <Loader2 size={16} className="spinner" /> Typing...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-area glass-panel">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isWaiting ? "Thinking..." : "Type your message here..."}
          disabled={isWaiting}
          autoFocus
        />
        <button type="submit" disabled={!inputText.trim() || isWaiting} className="send-btn">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
