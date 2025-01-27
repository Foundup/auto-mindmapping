import React from 'react';
import { Handle, Position } from 'reactflow';

export const SHAPES = {
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  DIAMOND: 'diamond',
  HEXAGON: 'hexagon',
  PARALLELOGRAM: 'parallelogram',
};

export const getNodeStyle = (nodeType, shape, isRoot, isExpanded) => {
  const baseStyle = {
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    border: '1px solid #3498db',
  };

  // Shape-specific styles
  switch (shape) {
    case SHAPES.CIRCLE:
      return {
        ...baseStyle,
        borderRadius: '50%',
        width: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
      };
    case SHAPES.DIAMOND:
      return {
        ...baseStyle,
        transform: 'rotate(45deg)',
        width: '100px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& > *': {
          transform: 'rotate(-45deg)',
        },
      };
    case SHAPES.HEXAGON:
      return {
        ...baseStyle,
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        width: '120px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
    case SHAPES.PARALLELOGRAM:
      return {
        ...baseStyle,
        transform: 'skew(-20deg)',
        '& > *': {
          transform: 'skew(20deg)',
        },
      };
    default:
      return baseStyle;
  }
};

export const CustomNode = ({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div className="node-content">
        {data.label}
        {data.icon && <i className={data.icon} style={{ marginLeft: '8px' }} />}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </>
  );
}; 