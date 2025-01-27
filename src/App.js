import React from 'react';
import { useAppState } from './hooks/useAppState';
import { LoadingScreen } from './components/LoadingScreen';
import { LoginScreen } from './components/LoginScreen';
import { MainLayout } from './components/MainLayout';
import { UserProfile } from './components/UserProfile';
import { MindmappingTab } from './components/MindmappingTab';
import './styles/App.css';

export default function App() {
  const appState = useAppState();
  const { loading, user } = appState;

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

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
