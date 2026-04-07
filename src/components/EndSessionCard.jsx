import React, { useState, useEffect } from 'react';
import { Copy, Download, Home, Loader2, Sparkles } from 'lucide-react';
import { sendEndSession } from '../api';
import './EndSessionCard.css';

export default function EndSessionCard({ sessionId, conceptTopic, chatHistory, onRestart }) {
  const [cheatSheet, setCheatSheet] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadEndSession() {
      try {
        setLoading(true);
        // We pass the last student message as context if available.
        const studentMessages = chatHistory.filter(m => m.sender === 'student');
        const lastMsg = studentMessages.length > 0 ? studentMessages[studentMessages.length - 1].text : '';
        
        const response = await sendEndSession(sessionId, lastMsg, conceptTopic);
        setCheatSheet(response.cheatSheet || "We couldn't generate a cheat sheet right now, but great job exploring!");
        setMessage(response.message || "Session ended! See you next time.");
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadEndSession();
  }, [sessionId, conceptTopic, chatHistory]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cheatSheet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([`Learning: ${conceptTopic}\n\n${cheatSheet}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${conceptTopic}_CheatSheet.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  if (loading) {
    return (
      <div className="end-container">
        <div className="loader-box">
          <Loader2 size={48} className="spinner" color="var(--primary)" />
          <p>Generating your personal cheat sheet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="end-container">
         <div className="end-card glass-panel text-center">
            <h3>Oh no!</h3>
            <p>We couldn't load your cheat sheet. Please try again later.</p>
            <button onClick={onRestart} className="home-btn mt-4">
              <Home size={18} /> Back to Start
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="end-container animate-slide-up">
      <div className="end-card glass-panel">
        <div className="end-header">
           <Sparkles size={28} color="var(--accent)" />
           <h2>{message || 'Awesome Job!'}</h2>
        </div>
        
        <p className="subtitle">Here is a cheat sheet of what you explored about <strong>{conceptTopic}</strong>:</p>
        
        <div className="sheet-box">
           <p>{cheatSheet}</p>
        </div>

        <div className="actions">
          <button onClick={handleCopy} className="action-btn" title="Copy text">
            <Copy size={18} /> {copied ? 'Copied!' : 'Copy'}
          </button>
          
          <button onClick={handleDownload} className="action-btn" title="Download as Text">
            <Download size={18} /> Download
          </button>

          <button onClick={onRestart} className="home-btn" title="Start a new session">
            <Home size={18} /> New Topic
          </button>
        </div>
      </div>
    </div>
  );
}
