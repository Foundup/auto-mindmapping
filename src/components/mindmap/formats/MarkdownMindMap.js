import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const formatToMarkdown = (content) => {
  if (!content) return '';
  
  try {
    const lines = content.split('\n')
      .filter(line => line.trim() && line.trim() !== 'mindmap');
    
    let markdownContent = '# Mind Map\n\n';
    let currentLevel = 0;
    let previousLevel = 0;
    
    lines.forEach(line => {
      const indentMatch = line.match(/^[\t\s]*/);
      currentLevel = indentMatch ? indentMatch[0].length / 2 : 0;
      
      // Add bullet points based on level
      const indent = '  '.repeat(currentLevel);
      let processedLine = line.trim();
      
      // Convert node types to markdown syntax
      if (processedLine.includes('{"') && processedLine.includes('"}')) {
        processedLine = processedLine.replace(/\{"(.*?)"\}/, '**$1**');
      } else if (processedLine.includes('["') && processedLine.includes('"]')) {
        processedLine = processedLine.replace(/\["(.*?)"\]/, '`$1`');
      } else if (processedLine.includes('<"') && processedLine.includes('">')) {
        processedLine = processedLine.replace(/<"(.*?)">/, '*$1*');
      } else if (processedLine.includes('|"') && processedLine.includes('"|')) {
        processedLine = processedLine.replace(/\|"(.*?)"\|/, '***$1***');
      } else if (processedLine.includes('(("') && processedLine.includes('"))')) {
        processedLine = processedLine.replace(/\(\("(.*?)"\)\)/, '> $1');
      } else if (processedLine.includes('("') && processedLine.includes('")')) {
        processedLine = processedLine.replace(/\("(.*?)"\)/, '~~$1~~');
      }
      
      // Handle icons
      if (processedLine.includes('::icon')) {
        processedLine = processedLine.replace(/::icon\((.*?)\)/, '📎');
      }
      
      // Add bullet point
      markdownContent += `${indent}- ${processedLine}\n`;
      
      previousLevel = currentLevel;
    });
    
    return markdownContent;
  } catch (error) {
    console.error('Error formatting markdown content:', error);
    return '# Error\n\nFailed to format mind map content.';
  }
};

export function MarkdownMindMap({ content }) {
  const [markdownContent, setMarkdownContent] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const processContent = () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const formattedContent = formatToMarkdown(content);
        if (!formattedContent) {
          throw new Error('Invalid mind map content');
        }

        if (mounted) {
          setMarkdownContent(formattedContent);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error processing markdown:', err);
          setError('Failed to process mind map content');
          setIsLoading(false);
        }
      }
    };

    processContent();

    return () => {
      mounted = false;
    };
  }, [content]);

  if (error) {
    return (
      <div className="markdown-error">
        <div className="error-icon">⚠️</div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="markdown-mindmap">
      {isLoading ? (
        <div className="markdown-loading">
          <div className="loading-spinner" />
          <div className="loading-text">Formatting mind map...</div>
        </div>
      ) : (
        <div className="markdown-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="markdown-title" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="markdown-item" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="markdown-quote" {...props} />
              ),
              code: ({ node, ...props }) => (
                <code className="markdown-code" {...props} />
              )
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

MarkdownMindMap.propTypes = {
  content: PropTypes.string.isRequired,
};

export default MarkdownMindMap; 