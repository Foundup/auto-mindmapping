import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import {
  DEFAULT_MODEL,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_PROMPT_TEMPLATE
} from '../config/defaults';

export function useAppState() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [user, loading] = useAuthState(auth);

  const [maxTokens, setMaxTokens] = useState(
    localStorage.getItem("maxTokens") || DEFAULT_MAX_TOKENS
  );

  const [temperature, setTemperature] = useState(
    localStorage.getItem("temperature") || DEFAULT_TEMPERATURE
  );

  const [promptTemplate, setPromptTemplate] = useState(
    localStorage.getItem("promptTemplate") || DEFAULT_PROMPT_TEMPLATE
  );

  // Function to check if user can make API calls
  const canMakeApiCalls = () => {
    if (!user) {
      return false;
    }
    return !!process.env.REACT_APP_OPENAI_API_KEY;
  };

  return {
    prompt,
    setPrompt,
    result,
    setResult,
    model,
    setModel,
    user,
    loading,
    maxTokens,
    setMaxTokens,
    temperature,
    setTemperature,
    promptTemplate,
    setPromptTemplate,
    canMakeApiCalls
  };
} 