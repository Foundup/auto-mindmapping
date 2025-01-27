import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import ChatDialog from './ChatDialog';
import LoadingSpinner from './LoadingSpinner';
import { FiDownload, FiZoomIn, FiZoomOut, FiRotateCcw, FiHelpCircle, FiSettings, FiCopy, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { MINDMAP_FORMATS } from './mindmap/formats';
import { AI_MODELS } from './models';
import '../styles/MindmappingTab.css';
import { generateMindMap } from '../services/api';

const TEMPLATES = {
  BRAINSTORM: {
    name: 'Brainstorming',
    prompt: 'Create a detailed mind map for brainstorming ideas about: ',
    style: 'creative and expansive'
  },
  PLANNING: {
    name: 'Project Planning',
    prompt: 'Create a structured mind map for planning all aspects of: ',
    style: 'organized and hierarchical'
  },
  ANALYSIS: {
    name: 'Problem Analysis',
    prompt: 'Create an analytical mind map to break down and solve: ',
    style: 'logical and systematic'
  }
};

const LOADING_TIMEOUT = 30000; // 30 seconds
const LOCAL_STORAGE_KEY = 'mindmap_preferences';

export function MindmappingTab() {
  // Load preferences from local storage
  const loadPreferences = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const prefs = JSON.parse(saved);
        return {
          template: prefs.template || 'BRAINSTORM',
          format: prefs.format || 'REACTFLOW',
          model: prefs.model || 'GPT4',
          temperature: prefs.temperature || 0.7,
          maxTokens: prefs.maxTokens || null
        };
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
    return null;
  };

  const prefs = loadPreferences();
  const [prompt, setPrompt] = useState('');
  const [template, setTemplate] = useState(prefs?.template || 'BRAINSTORM');
  const [format, setFormat] = useState(prefs?.format || 'REACTFLOW');
  const [model, setModel] = useState(prefs?.model || 'GPT4');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawOutput, setRawOutput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [temperature, setTemperature] = useState(prefs?.temperature || 0.7);
  const [maxTokens, setMaxTokens] = useState(prefs?.maxTokens || null);
  const [isOutputCollapsed, setIsOutputCollapsed] = useState(false);

  const abortControllerRef = useRef(null);
  const loadingTimeoutRef = useRef(null);

  // Save preferences when they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        template,
        format,
        model,
        temperature,
        maxTokens
      }));
    } catch (err) {
      console.error('Error saving preferences:', err);
    }
  }, [template, format, model, temperature, maxTokens]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const handleCreate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setRawOutput('');

    // Set loading timeout
    loadingTimeoutRef.current = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setError('Request timed out. Please try again.');
        setIsLoading(false);
      }
    }, LOADING_TIMEOUT);

    try {
      const fullPrompt = `${TEMPLATES[template].prompt}${prompt}\n\nStyle: ${TEMPLATES[template].style}`;
      const data = await generateMindMap(
        fullPrompt,
        'gpt-3.5-turbo',
        temperature || DEFAULT_TEMPERATURE
      );

      setRawOutput(data.mindmapText);
      setResult(data.visualization);
      
      // Add to history
      const newHistory = [...history.slice(0, historyIndex + 1), data];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request was cancelled');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    }
  };

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousState = history[historyIndex - 1];
      setRawOutput(previousState.mindmapText);
      setResult(previousState.visualization);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextState = history[historyIndex + 1];
      setRawOutput(nextState.mindmapText);
      setResult(nextState.visualization);
    }
  }, [history, historyIndex]);

  const handleExport = useCallback(() => {
    if (!rawOutput) return;

    try {
      const blob = new Blob([rawOutput], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindmap_${new Date().toISOString()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Error exporting mind map: ${err.message}`);
    }
  }, [rawOutput]);

  const handleCopyOutput = useCallback(() => {
    if (!rawOutput) return;
    
    try {
      navigator.clipboard.writeText(rawOutput);
      // Could add a toast notification here
    } catch (err) {
      setError(`Error copying to clipboard: ${err.message}`);
    }
  }, [rawOutput]);

  // Debounced settings handlers
  const debouncedSetTemperature = useCallback(
    debounce((value) => setTemperature(value), 300),
    []
  );

  const debouncedSetMaxTokens = useCallback(
    debounce((value) => setMaxTokens(value), 300),
    []
  );

  const CurrentMindMap = MINDMAP_FORMATS[format].component;

  return (
    <div className="mindmapping-container">
      <div className="toolbar">
        <div className="toolbar-selects">
          <select 
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="template-select"
          >
            {Object.entries(TEMPLATES).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="format-select"
          >
            {Object.entries(MINDMAP_FORMATS).map(([key, { name, description }]) => (
              <option key={key} value={key} title={description}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="model-select"
          >
            {Object.entries(AI_MODELS).map(([key, { name, provider, description }]) => (
              <option key={key} value={key} title={description}>
                {name} ({provider})
              </option>
            ))}
          </select>
        </div>
        <div className="toolbar-buttons">
          <button onClick={handleUndo} disabled={historyIndex <= 0} title="Undo">
            <FiRotateCcw />
          </button>
          <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} title="Redo">
            <FiRotateCcw className="flip-horizontal" />
          </button>
          <button onClick={handleExport} disabled={!rawOutput} title="Export">
            <FiDownload />
          </button>
          <button onClick={() => setShowSettings(true)} title="Settings">
            <FiSettings />
          </button>
          <button onClick={() => setShowHelp(true)} title="Help">
            <FiHelpCircle />
          </button>
        </div>
      </div>

      <div className="input-section">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Enter your topic for ${TEMPLATES[template].name.toLowerCase()}...`}
          className="prompt-input"
        />
        <button 
          onClick={handleCreate}
          disabled={isLoading || !prompt.trim()}
          className="create-button"
        >
          {isLoading ? <LoadingSpinner /> : 'Generate Mind Map'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <div className="error-content">{error}</div>
        </div>
      )}

      <div className="output-container">
        <div className="output-section">
          <div className="output-header">
            <h3 className="section-title">Output</h3>
            <div className="output-controls">
              <button 
                className="control-button"
                onClick={handleCopyOutput}
                disabled={!rawOutput}
                title="Copy output"
              >
                <FiCopy />
              </button>
              <button 
                className="control-button"
                onClick={() => setIsOutputCollapsed(!isOutputCollapsed)}
                title={isOutputCollapsed ? "Expand" : "Collapse"}
              >
                {isOutputCollapsed ? <FiChevronDown /> : <FiChevronUp />}
              </button>
            </div>
          </div>
          
          {!isOutputCollapsed && (
            <div className="output-content">
              <pre className="output-text">
                {rawOutput || 'No output generated yet. Click "Generate Mind Map" to start.'}
              </pre>
            </div>
          )}
        </div>

        {rawOutput && (
          <div className="output-section">
            <h3 className="section-title">Mind Map Preview</h3>
            <div className="mindmap-preview">
              <CurrentMindMap content={rawOutput} />
            </div>
          </div>
        )}
      </div>

      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-content" onClick={e => e.stopPropagation()}>
            <h2>Model Settings</h2>
            <div className="settings-group">
              <label>
                Temperature
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => debouncedSetTemperature(parseFloat(e.target.value))}
                />
                <span>{temperature}</span>
              </label>
              <label>
                Max Tokens
                <input
                  type="number"
                  value={maxTokens || AI_MODELS[model].maxTokens}
                  onChange={(e) => debouncedSetMaxTokens(parseInt(e.target.value))}
                  min="1"
                  max={AI_MODELS[model].maxTokens}
                />
              </label>
            </div>
            <div className="settings-info">
              <h3>Selected Model: {AI_MODELS[model].name}</h3>
              <p>Provider: {AI_MODELS[model].provider}</p>
              <p>{AI_MODELS[model].description}</p>
            </div>
            <button onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </div>
      )}

      {showHelp && (
        <div className="help-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-content" onClick={e => e.stopPropagation()}>
            <h2>How to Use the Mind Map Generator</h2>
            <ol>
              <li>Select a template type from the dropdown menu</li>
              <li>Choose your preferred mind map format</li>
              <li>Select an AI model for generation</li>
              <li>Enter your topic or question in the text area</li>
              <li>Click "Generate Mind Map" to create your visualization</li>
              <li>Use the toolbar to undo/redo changes or export your mind map</li>
              <li>Click and drag nodes to rearrange them (React Flow format only)</li>
              <li>Right-click nodes to change their shape (React Flow format only)</li>
              <li>Double-click nodes to edit their content (React Flow format only)</li>
            </ol>
            <button onClick={() => setShowHelp(false)}>Got it!</button>
          </div>
        </div>
      )}

      <ChatDialog />
    </div>
  );
}

MindmappingTab.propTypes = {
  // Add props if needed
};

export default MindmappingTab; 