import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export const formatToPlantUML = (content) => {
  if (!content) return '';
  
  try {
    const lines = content.split('\n')
      .filter(line => line.trim() && line.trim() !== 'mindmap');
    
    let plantUMLContent = '@startmindmap\n';
    
    lines.forEach(line => {
      const indentMatch = line.match(/^[\t\s]*/);
      const level = indentMatch ? indentMatch[0].length / 2 : 0;
      const indent = '*'.repeat(level + 1) + ' ';
      
      // Convert node types to PlantUML syntax
      let processedLine = line.trim();
      if (processedLine.includes('{"') && processedLine.includes('"}')) {
        processedLine = processedLine.replace(/\{"(.*?)"\}/, '<&decision-box> $1');
      } else if (processedLine.includes('["') && processedLine.includes('"]')) {
        processedLine = processedLine.replace(/\["(.*?)"\]/, '<&box> $1');
      } else if (processedLine.includes('<"') && processedLine.includes('">')) {
        processedLine = processedLine.replace(/<"(.*?)">/, '<&circle-o> $1');
      } else if (processedLine.includes('|"') && processedLine.includes('"|')) {
        processedLine = processedLine.replace(/\|"(.*?)"\|/, '<&hexagon> $1');
      } else if (processedLine.includes('(("') && processedLine.includes('"))')) {
        processedLine = processedLine.replace(/\(\("(.*?)"\)\)/, '<&star> $1');
      } else if (processedLine.includes('("') && processedLine.includes('")')) {
        processedLine = processedLine.replace(/\("(.*?)"\)/, '<&tag> $1');
      }
      
      // Handle icons
      if (processedLine.includes('::icon')) {
        processedLine = processedLine.replace(/::icon\((.*?)\)/, '<$1>');
      }
      
      plantUMLContent += `${indent}${processedLine}\n`;
    });
    
    plantUMLContent += '@endmindmap';
    return plantUMLContent;
  } catch (error) {
    console.error('Error formatting PlantUML content:', error);
    return ''; // Return empty string on error
  }
};

export function PlantUMLMindMap({ content }) {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const loadImage = useCallback(async (encodedDiagram, retryAttempt = 0) => {
    try {
      setIsLoading(true);
      setError(null);

      const plantUMLContent = formatToPlantUML(content);
      if (!plantUMLContent) {
        throw new Error('Invalid mind map content');
      }

      const plantUMLServer = 'https://www.plantuml.com/plantuml/svg/';
      const url = `${plantUMLServer}${encodedDiagram}`;

      // Test if the image loads correctly
      const img = new Image();
      img.onload = () => {
        setImageUrl(url);
        setIsLoading(false);
        setRetryCount(0);
      };
      img.onerror = () => {
        throw new Error('Failed to load PlantUML diagram');
      };
      img.src = url;
    } catch (err) {
      console.error('Error loading PlantUML diagram:', err);
      
      if (retryAttempt < MAX_RETRIES) {
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          loadImage(encodedDiagram, retryAttempt + 1);
        }, RETRY_DELAY);
      } else {
        setError('Failed to load mind map after multiple attempts');
        setIsLoading(false);
      }
    }
  }, [content]);

  useEffect(() => {
    let mounted = true;

    const initializePlantUML = async () => {
      try {
        const plantUMLContent = formatToPlantUML(content);
        if (!plantUMLContent) {
          throw new Error('Invalid mind map content');
        }

        // Use TextEncoder to encode the PlantUML content
        const encoder = new TextEncoder();
        const data = encoder.encode(plantUMLContent);
        const encodedDiagram = btoa(String.fromCharCode.apply(null, data));

        if (mounted) {
          loadImage(encodedDiagram);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error initializing PlantUML:', err);
          setError('Failed to process mind map content');
          setIsLoading(false);
        }
      }
    };

    initializePlantUML();

    return () => {
      mounted = false;
    };
  }, [content, loadImage]);

  if (error) {
    return (
      <div className="plantuml-error">
        <div className="error-icon">⚠️</div>
        <div className="error-message">{error}</div>
        {retryCount > 0 && (
          <div className="retry-message">
            Retry attempt {retryCount} of {MAX_RETRIES}...
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="plantuml-mindmap">
      {isLoading && (
        <div className="plantuml-loading">
          <div className="loading-spinner" />
          <div className="loading-text">
            {retryCount > 0 
              ? `Retrying... (${retryCount}/${MAX_RETRIES})`
              : 'Generating mind map...'}
          </div>
        </div>
      )}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Mind Map" 
          style={{ 
            maxWidth: '100%',
            opacity: isLoading ? 0.5 : 1,
            transition: 'opacity 0.3s ease'
          }} 
        />
      )}
    </div>
  );
}

PlantUMLMindMap.propTypes = {
  content: PropTypes.string.isRequired,
};

export default PlantUMLMindMap; 