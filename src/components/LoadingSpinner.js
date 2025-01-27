import React from 'react';
import '../styles/LoadingSpinner.css';

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <span className="spinner-text">Generating...</span>
    </div>
  );
} 