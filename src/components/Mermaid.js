import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with minimal configuration
mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'dark',
  mindmap: {
    padding: 16,
    useMaxWidth: true
  },
  themeVariables: {
    'mindmapBranchColor': '#fff',
    'mindmapBranchLabelColor': '#fff',
    'mindmapNodeBorderColor': '#fff',
    'mindmapNodeBackgroundColor': '#333',
    'mindmapNodeTextColor': '#fff'
  }
});

function Mermaid({ chart }) {
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyDebug = async () => {
    try {
      await navigator.clipboard.writeText(debugInfo);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;

      try {
        const element = document.querySelector("#mindmap");
        element.removeAttribute("data-processed");
        
        // Process the chart content
        let processedChart = chart.trim();
        setDebugInfo('Original chart content:\n' + processedChart);
        
        // Add mindmap prefix if missing
        if (!processedChart.startsWith('mindmap')) {
          processedChart = 'mindmap\n' + processedChart;
        }

        // Replace escaped tabs with actual tabs
        processedChart = processedChart.replace(/\\t/g, '\t');
        
        // Fix icon syntax
        processedChart = processedChart.replace(/::icon\(fafa /g, '::icon(fa fa ');
        
        setDebugInfo(prev => prev + '\n\nProcessed chart content:\n' + processedChart);
        
        // Set content and render
        element.innerHTML = processedChart;
        await mermaid.init(undefined, "#mindmap");
        setError('');
      } catch (err) {
        console.error("Error rendering mermaid chart:", err);
        setError('Syntax error in graph');
        setDebugInfo(prev => prev + '\n\nError: ' + err.message);
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div className="mermaid-wrapper">
      {error && (
        <div className="mermaid-error">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <div className="error-title">{error}</div>
            <div className="error-subtitle">mermaid version 9.3.0</div>
            <details className="debug-details">
              <summary className="debug-header">
                Debug Information
                <button 
                  className="copy-btn"
                  onClick={handleCopyDebug}
                >
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
              </summary>
              <pre className="debug-info">{debugInfo}</pre>
            </details>
          </div>
        </div>
      )}
      {!error && <div id="mindmap" className="mermaid">{chart}</div>}
    </div>
  );
}

export default Mermaid; 