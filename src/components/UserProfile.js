import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import { authService } from '../services/auth_service';
import '../styles/UserProfile.css';

export function UserProfile({ 
  model, 
  setModel, 
  maxTokens, 
  setMaxTokens, 
  temperature, 
  setTemperature,
  promptTemplate,
  setPromptTemplate
}) {
  const [user] = useAuthState(auth);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpgrade = () => {
    // TODO: Implement upgrade logic
    console.log('Upgrade clicked');
  };

  const handleMaxTokensChange = (e) => {
    const value = e.target.value;
    setMaxTokens(value);
    localStorage.setItem("maxTokens", value);
  };

  const handleTemperatureChange = (e) => {
    const value = e.target.value;
    setTemperature(value);
    localStorage.setItem("temperature", value);
  };

  const handlePromptTemplateChange = (e) => {
    const value = e.target.value;
    setPromptTemplate(value);
    localStorage.setItem("promptTemplate", value);
  };

  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="user-info">
        <img 
          src={user.photoURL} 
          alt={user.displayName} 
          className="user-avatar"
        />
        <div className="user-details">
          <div className="user-name">{user.displayName}</div>
          <div className="account-type">Free Account</div>
        </div>
        <button className="upgrade-button" onClick={handleUpgrade}>
          Upgrade
        </button>
      </div>

      {showDropdown && (
        <div className="user-dropdown">
          <div className="user-details">
            <p className="user-email">{user.email}</p>
          </div>

          <div className="settings-section">
            <div className="setting-item">
              <label htmlFor="model">Model:</label>
              <select 
                id="model"
                value={model} 
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="gpt-4o-mini">GPT-4 Mini</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>

            <div className="setting-item">
              <label htmlFor="maxTokens">Max Tokens:</label>
              <input
                id="maxTokens"
                type="number"
                value={maxTokens}
                onChange={handleMaxTokensChange}
                min="1"
                max="4000"
              />
            </div>

            <div className="setting-item">
              <label htmlFor="temperature">Temperature:</label>
              <input
                id="temperature"
                type="number"
                value={temperature}
                onChange={handleTemperatureChange}
                min="0"
                max="1"
                step="0.1"
              />
            </div>

            <div className="setting-item">
              <label htmlFor="promptTemplate">Prompt Template:</label>
              <textarea
                id="promptTemplate"
                value={promptTemplate}
                onChange={handlePromptTemplateChange}
                rows="4"
              />
            </div>
          </div>

          <button 
            className="sign-out-btn"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
} 