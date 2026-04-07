import React, { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import ChatInterface from './components/ChatInterface';
import EndSessionCard from './components/EndSessionCard';

function App() {
  const [appState, setAppState] = useState('setup'); // 'setup' | 'chat' | 'ended'
  const [studentName, setStudentName] = useState('');
  const [conceptTopic, setConceptTopic] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [finalChatHistory, setFinalChatHistory] = useState([]);

  const handleStartSession = (name, concept) => {
    setStudentName(name);
    setConceptTopic(concept);
    
    // Create sessionId: {studentName}_{timestamp}
    // ensure no spaces in name for id
    const cleanName = name.replace(/\s+/g, '_');
    setSessionId(`${cleanName}_${Date.now()}`);
    
    setAppState('chat');
  };

  const handleEndSession = (chatHistory) => {
    setFinalChatHistory(chatHistory);
    setAppState('ended');
  };

  const handleRestart = () => {
    setStudentName('');
    setConceptTopic('');
    setSessionId('');
    setFinalChatHistory([]);
    setAppState('setup');
  };

  return (
    <>
      {appState === 'setup' && (
        <SetupScreen onStart={handleStartSession} />
      )}
      
      {appState === 'chat' && (
        <ChatInterface 
          sessionId={sessionId}
          studentName={studentName}
          conceptTopic={conceptTopic}
          onEndSession={handleEndSession}
        />
      )}
      
      {appState === 'ended' && (
        <EndSessionCard
          sessionId={sessionId}
          conceptTopic={conceptTopic}
          chatHistory={finalChatHistory}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}

export default App;
