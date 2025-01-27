import React, { useState, useEffect } from 'react';
import { userService } from '../services/user_service';
import { Login } from './Login';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';

export function Account({
  token,
  setToken,
  model,
  setModel,
  promptTemplate,
  setPromptTemplate,
  maxTokens,
  setMaxTokens,
  temperature,
  setTemperature,
}) {
  const [localTemperature, setLocalTemperature] = useState(String(temperature));
  const [user] = useAuthState(auth);
  const [userTier, setUserTier] = useState('free');

  const handlePromptTemplateChange = (e) => {
    setPromptTemplate(e.target.value);
    localStorage.setItem("promptTemplate", e.target.value);
  };

  function extractIntFromString(str) {
    const result = str.match(/\d+/);
    if (result) {
      return parseInt(result[0], 10);
    } else {
      return 0;
    }
  }

  function extractFloatFromString(str) {
    str = str.replace(",", "."); // Replace comma with period as a decimal separator
    const result = str.match(/^-?(\d+)?(\.\d*)?/); // Match optional digits before and after the decimal point
    if (result) {
      return result[0] === "" ? 0 : parseFloat(result[0]); // Return '0' if the input is an empty string
    } else {
      return 0;
    }
  }

  const handleMaxTokensChange = (e) => {
    let maxTokens = extractIntFromString(e.target.value);
    setMaxTokens(maxTokens);
    localStorage.setItem("maxTokens", maxTokens);
  };

  const handleTemperatureChange = (e) => {
    const input = e.target.value;
    setLocalTemperature(input);

    const parsedTemperature = extractFloatFromString(input);
    if (!isNaN(parsedTemperature) && input !== "") {
      setTemperature(parsedTemperature);
      localStorage.setItem("temperature", parsedTemperature);
    }
  };

  const handleTemperatureBlur = () => {
    const parsedTemperature = parseFloat(localTemperature);
    if (isNaN(parsedTemperature)) {
      setLocalTemperature(String(temperature));
    } else {
      setLocalTemperature(String(parsedTemperature));
      setTemperature(parsedTemperature);
      localStorage.setItem("temperature", parsedTemperature);
    }
  };

  const handleUpgradeToPremium = () => {
    alert('Premium upgrade coming soon! This will remove token limits and add advanced features.');
  };

  return (
    <div className="settings-container">
      <div className="auth-section">
        <Login />
        {user && (
          <div className="tier-info">
            <h4>Account Tier: {userTier === 'premium' ? 'Premium 🌟' : 'Free'}</h4>
            {userTier === 'free' && (
              <button 
                className="upgrade-btn"
                onClick={handleUpgradeToPremium}
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        )}
      </div>

      <div className="settings-section">
        <div>
          <label htmlFor="model">Model:</label>
          <select
            name="model"
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="gpt-4o">gpt-4o</option>
            <option value="gpt-4-turbo">gpt-4-turbo</option>
            <option value="gpt-4">gpt-4</option>
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            <option value="gpt-4o-2024-08-06">gpt-4o-2024-08-06</option>
            <option value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k</option>
            <option value="chatgpt-4o-latest">chatgpt-4o-latest</option>
          </select>
        </div>

        <div>
          <label htmlFor="maxTokens">Max tokens:</label>
          <input
            type="text"
            id="maxTokens"
            name="maxTokens"
            value={maxTokens}
            onChange={handleMaxTokensChange}
          />
        </div>

        <div>
          <label htmlFor="temperature">Temperature:</label>
          <input
            type="text"
            id="temperature"
            name="temperature"
            value={localTemperature}
            onChange={handleTemperatureChange}
            onBlur={handleTemperatureBlur}
          />
        </div>

        <div>
          <label htmlFor="promptTemplate">Prompt Template:</label>
          <textarea
            id="promptTemplate"
            name="promptTemplate"
            value={promptTemplate}
            onChange={handlePromptTemplateChange}
          />
        </div>
      </div>
    </div>
  );
} 