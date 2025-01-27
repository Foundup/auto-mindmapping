import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import mermaid from 'mermaid';

// Initialize mermaid with default config
try {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
    mindmap: {
      padding: 20,
      useMaxWidth: true,
    },
  });
} catch (error) {
  console.error('Error initializing mermaid:', error);
}

export const formatToMermaid = (content) => {
  if (!content) return '';
  
  try {
    const lines = content.split('\n')
      .filter(line => line.trim() && line.trim() !== 'mindmap');
    
    let mermaidContent = 'mindmap\n';
    
    lines.forEach(line => {
      const indentMatch = line.match(/^[\t\s]*/);
      const level = indentMatch ? indentMatch[0].length / 2 : 0;
      const indent = '  '.repeat(level);
      
      // Convert node types to Mermaid syntax
      let processedLine = line.trim();
      if (processedLine.includes('{"') && processedLine.includes('"}')) {
        processedLine = processedLine.replace(/\{"(.*?)"\}/, '[$1]((diamond))');
      } else if (processedLine.includes('["') && processedLine.includes('"]')) {
        processedLine = processedLine.replace(/\["(.*?)"\]/, '[$1]((square))');
      } else if (processedLine.includes('<"') && processedLine.includes('">')) {
        processedLine = processedLine.replace(/<"(.*?)">/, '[$1]((circle))');
      } else if (processedLine.includes('|"') && processedLine.includes('"|')) {
        processedLine = processedLine.replace(/\|"(.*?)"\|/, '[$1]((hexagon))');
      } else if (processedLine.includes('(("') && processedLine.includes('"))')) {
        processedLine = processedLine.replace(/\(\("(.*?)"\)\)/, '[$1]((stadium))');
      } else if (processedLine.includes('("') && processedLine.includes('")')) {
        processedLine = processedLine.replace(/\("(.*?)"\)/, '[$1]((rounded))');
      }
      
      // Handle icons
      if (processedLine.includes('::icon')) {
        processedLine = processedLine.replace(/::icon\((.*?)\)/, '::$1');
      }
      
      mermaidContent += `${indent}${processedLine}\n`;
    });
    
    return mermaidContent;
  } catch (error) {
    console.error('Error formatting mermaid content:', error);
    return ''; // Return empty string on error
  }
};

export function MermaidMindMap({ content }) {
  const mermaidRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let renderTimeout;

    const renderMermaid = async () => {
      if (!mermaidRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        const mermaidContent = formatToMermaid(content);
        if (!mermaidContent) {
          throw new Error('Invalid mind map content');
        }

        // Clear previous content
        mermaidRef.current.innerHTML = mermaidContent;

        // Add a small delay to ensure DOM is updated
        renderTimeout = setTimeout(async () => {
          try {
            await mermaid.contentLoaded();
            if (mounted) {
              setIsLoading(false);
            }
          } catch (err) {
            if (mounted) {
              console.error('Error rendering mermaid:', err);
              setError('Failed to render mind map');
              setIsLoading(false);
            }
          }
        }, 100);
      } catch (err) {
        if (mounted) {
          console.error('Error processing mermaid content:', err);
          setError('Failed to process mind map content');
          setIsLoading(false);
        }
      }
    };

    renderMermaid();

    return () => {
      mounted = false;
      if (renderTimeout) {
        clearTimeout(renderTimeout);
      }
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = '';
      }
    };
  }, [content]);

  if (error) {
    return (
      <div className="mermaid-error">
        <div className="error-icon">⚠️</div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="mermaid-mindmap">
      {isLoading && (
        <div className="mermaid-loading">
          <div className="loading-spinner" />
          <div className="loading-text">Rendering mind map...</div>
        </div>
      )}
      <div ref={mermaidRef} className="mermaid">
        {formatToMermaid(content)}
      </div>
    </div>
  );
}

MermaidMindMap.propTypes = {
  content: PropTypes.string.isRequired,
};

export default MermaidMindMap; 