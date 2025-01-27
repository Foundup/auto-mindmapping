import ReactFlowMindMap from './ReactFlowMindMap';
import MermaidMindMap from './MermaidMindMap';
import PlantUMLMindMap from './PlantUMLMindMap';
import MarkdownMindMap from './MarkdownMindMap';

/**
 * Available mind map formats with their configurations
 */
export const MINDMAP_FORMATS = {
  REACTFLOW: {
    name: 'React Flow',
    component: ReactFlowMindMap,
    description: 'Interactive mind map with drag-and-drop support',
    features: [
      'Drag and drop nodes',
      'Interactive editing',
      'Node customization',
      'Export to PNG'
    ],
    isInteractive: true,
    supportsExport: true,
    defaultFormat: true
  },
  MERMAID: {
    name: 'Mermaid',
    component: MermaidMindMap,
    description: 'Clean and simple mind map visualization',
    features: [
      'Clean visualization',
      'Simple layout',
      'SVG output',
      'Light/dark theme support'
    ],
    isInteractive: false,
    supportsExport: true
  },
  PLANTUML: {
    name: 'PlantUML',
    component: PlantUMLMindMap,
    description: 'Professional diagram with UML styling',
    features: [
      'UML styling',
      'Professional look',
      'SVG output',
      'Multiple themes'
    ],
    isInteractive: false,
    supportsExport: true
  },
  MARKDOWN: {
    name: 'Markdown',
    component: MarkdownMindMap,
    description: 'Simple text-based mind map format',
    features: [
      'Text-based format',
      'Easy to edit',
      'Copy/paste support',
      'GitHub compatible'
    ],
    isInteractive: false,
    supportsExport: false
  }
};

/**
 * Get the component for a specific format
 * @param {string} format - The format identifier
 * @returns {React.Component} The mind map component
 */
export const getMindMapComponent = (format) => {
  const formatConfig = MINDMAP_FORMATS[format];
  if (!formatConfig) {
    console.warn(`Unknown format: ${format}, falling back to React Flow`);
    return MINDMAP_FORMATS.REACTFLOW.component;
  }
  return formatConfig.component;
};

/**
 * Get the default format
 * @returns {string} The default format identifier
 */
export const getDefaultFormat = () => {
  return Object.keys(MINDMAP_FORMATS).find(
    key => MINDMAP_FORMATS[key].defaultFormat
  ) || 'REACTFLOW';
};

/**
 * Check if a format supports exporting
 * @param {string} format - The format identifier
 * @returns {boolean} Whether the format supports exporting
 */
export const supportsExport = (format) => {
  const formatConfig = MINDMAP_FORMATS[format];
  return formatConfig ? formatConfig.supportsExport : false;
};

/**
 * Check if a format is interactive
 * @param {string} format - The format identifier
 * @returns {boolean} Whether the format is interactive
 */
export const isInteractiveFormat = (format) => {
  const formatConfig = MINDMAP_FORMATS[format];
  return formatConfig ? formatConfig.isInteractive : false;
};

export default {
  MINDMAP_FORMATS,
  getMindMapComponent,
  getDefaultFormat,
  supportsExport,
  isInteractiveFormat
}; 