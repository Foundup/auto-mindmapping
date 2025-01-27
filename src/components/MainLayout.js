import React from 'react';
import { UserProfile } from './UserProfile';
import { MindmappingTab } from './MindmappingTab';
import '../styles/MainLayout.css';

export function MainLayout({ appState }) {
  const {
    prompt,
    setPrompt,
    result,
    setResult,
    model,
    setModel,
    maxTokens,
    setMaxTokens,
    temperature,
    setTemperature,
    promptTemplate,
    setPromptTemplate,
    canMakeApiCalls
  } = appState;

  return (
    <div className="app">
      <header className="app-header">
        <div className="title-section">
          <div className="title">Foundups AI Mind Map</div>
          <div className="version">version 0.026</div>
        </div>
        <UserProfile />
      </header>
      <main className="app-main">
        <MindmappingTab />
      </main>
    </div>
  );
}

export default MainLayout; 