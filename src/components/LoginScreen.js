import React from 'react';
import { Login } from './Login';
import '../styles/LoginScreen.css';

export function LoginScreen() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="title-section">
          <h1 className="title">Foundups AI Mind Map</h1>
          <div className="version">version 0.035</div>
        </div>
      </header>
      <main className="login-container">
        <Login />
      </main>
    </div>
  );
} 