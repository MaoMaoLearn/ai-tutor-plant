import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import './SetupScreen.css';

export default function SetupScreen({ onStart }) {
  const [name, setName] = useState('');
  const [concept, setConcept] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && concept.trim()) {
      onStart(name.trim(), concept.trim());
    }
  };

  return (
    <div className="setup-container animate-slide-up">
      <div className="setup-card glass-panel">
        <div className="setup-header">
          <div className="icon-wrapper">
            <Sparkles size={32} color="var(--primary)" />
          </div>
          <h1>AI Tutor</h1>
          <p>Your personal guide to discovering amazing ideas!</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="input-group">
            <label htmlFor="name">Hi! What's your name?</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="concept">What do you want to explore today?</label>
            <input
              id="concept"
              type="text"
              placeholder="e.g. Photosynthesis, Volcanoes..."
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="start-btn" disabled={!name.trim() || !concept.trim()}>
            Start Exploring <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
