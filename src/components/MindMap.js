import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';

const SHAPES = {
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  DIAMOND: 'diamond',
  HEXAGON: 'hexagon',
  PARALLELOGRAM: 'parallelogram',
};

const getNodeStyle = (type, shape = SHAPES.RECTANGLE, isRoot = false, isExpanded = false) => {
  const baseStyle = {
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    padding: '12px 20px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    minWidth: '150px',
    cursor: 'pointer',
    position: 'relative',
  };

  if (isRoot) {
    return {
      ...baseStyle,
      background: '#2c3e50',
      border: '3px solid #f1c40f',
      borderRadius: shape === SHAPES.CIRCLE ? '50%' : '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      padding: '20px',
      minWidth: '200px',
      boxShadow: '0 0 20px rgba(241, 196, 15, 0.3)',
      ...(shape === SHAPES.DIAMOND && {
        transform: 'rotate(45deg)',
        '& .node-content': {
          transform: 'rotate(-45deg)',
        },
      }),
      ...(shape === SHAPES.HEXAGON && {
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      }),
      ...(shape === SHAPES.PARALLELOGRAM && {
        transform: 'skew(-20deg)',
        '& .node-content': {
          transform: 'skew(20deg)',
        },
      }),
    };
  }

  const expandedStyle = isExpanded ? {
    border: '2px solid #f1c40f',
    boxShadow: '0 0 10px rgba(241, 196, 15, 0.2)',
  } : {};

  const shapeStyles = {
    [SHAPES.CIRCLE]: {
      borderRadius: '50%',
      aspectRatio: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [SHAPES.DIAMOND]: {
      transform: 'rotate(45deg)',
      '& .node-content': {
        transform: 'rotate(-45deg)',
      },
    },
    [SHAPES.HEXAGON]: {
      clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    },
    [SHAPES.PARALLELOGRAM]: {
      transform: 'skew(-20deg)',
      '& .node-content': {
        transform: 'skew(20deg)',
      },
    },
  };

  const typeStyles = {
    decision: {
      background: '#8e44ad',
      border: '2px solid #9b59b6',
    },
    process: {
      background: '#2980b9',
      border: '2px solid #3498db',
    },
    input: {
      background: '#27ae60',
      border: '2px solid #2ecc71',
    },
    output: {
      background: '#c0392b',
      border: '2px solid #e74c3c',
    },
    user: {
      background: '#d35400',
      border: '2px solid #e67e22',
    },
    default: {
      background: '#2c3e50',
      border: '2px solid #3498db',
    },
  };

  return {
    ...baseStyle,
    ...typeStyles[type] || typeStyles.default,
    ...shapeStyles[shape] || {},
    ...expandedStyle,
  };
};

// Custom Node Component
const CustomNode = ({ data, isConnectable }) => {
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

const edgeDefaults = {
  type: 'smoothstep',
  animated: true,
  style: {
    stroke: '#3498db',
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#3498db',
  },
};

// Constants for layout
const SPACING = {
  X: 250, // Horizontal spacing between nodes
  Y: 100, // Vertical spacing between siblings
};

const LINE_TYPES = {
  SMOOTHSTEP: 'smoothstep',
  STRAIGHT: 'straight',
  BEZIER: 'bezier'
};

const SNAP_GRID = [20, 20];

function MindMap({ chart }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set(['node-0']));
  const [allNodes, setAllNodes] = useState([]);
  const [allEdges, setAllEdges] = useState([]);
  const [nodeShapes, setNodeShapes] = useState({});
  const [edgeTypes, setEdgeTypes] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleNodeClick = (event, node) => {
    if (event.button === 2) { // Right click
      event.preventDefault();
      const currentShape = nodeShapes[node.id] || SHAPES.RECTANGLE;
      const shapes = Object.values(SHAPES);
      const nextShapeIndex = (shapes.indexOf(currentShape) + 1) % shapes.length;
      setNodeShapes(prev => ({
        ...prev,
        [node.id]: shapes[nextShapeIndex]
      }));
    } else {
      const nodeId = node.id;
      setExpandedNodes(prev => {
        const newExpanded = new Set(prev);
        if (newExpanded.has(nodeId)) {
          // Collapse: remove this node and all its descendants
          const descendants = getDescendants(nodeId);
          descendants.forEach(id => newExpanded.delete(id));
        } else {
          // Expand: add just this node
          newExpanded.add(nodeId);
        }
        return newExpanded;
      });
    }
  };

  const getDescendants = (nodeId) => {
    const descendants = new Set();
    const stack = [nodeId];
    
    while (stack.length > 0) {
      const current = stack.pop();
      descendants.add(current);
      
      // Find all edges where this node is the source
      allEdges.forEach(edge => {
        if (edge.source === current) {
          stack.push(edge.target);
        }
      });
    }
    
    return descendants;
  };

  const getNodeType = (content) => {
    if (content.includes('{"') && content.includes('"}')) return 'decision';
    if (content.includes('["') && content.includes('"]')) return 'process';
    if (content.includes('<"') && content.includes('">')) return 'input';
    if (content.includes('|"') && content.includes('"|')) return 'user';
    if (content.includes('(("') && content.includes('"))')) return 'root';
    if (content.includes('("') && content.includes('")')) return 'output';
    return 'default';
  };

  const calculateNodePosition = (level, index, totalAtLevel) => {
    const x = level * SPACING.X;
    const totalHeight = (totalAtLevel - 1) * SPACING.Y;
    const y = (index * SPACING.Y) - (totalHeight / 2);
    return { x, y };
  };

  const processChart = useCallback((content) => {
    if (!content) return { nodes: [], edges: [] };

    try {
      setDebugInfo('Original chart content:\n' + content);

      const lines = content.split('\n').filter(line => line.trim() && line.trim() !== 'mindmap');
      const nodes = [];
      const edges = [];
      let currentNodeId = 0;
      let lastNodeAtLevel = {};
      
      // First pass: count nodes at each level
      const nodesPerLevel = {};
      lines.forEach(line => {
        const level = (line.match(/^[\t\s]*/)[0].length / 2) || 0;
        nodesPerLevel[level] = (nodesPerLevel[level] || 0) + 1;
      });

      // Track nodes added at each level
      const nodesAddedAtLevel = {};

      lines.forEach((line) => {
        const indentMatch = line.match(/^[\t\s]*/);
        const level = indentMatch ? indentMatch[0].length / 2 : 0;

        const contentMatch = line.match(/(\(\(".*?"\)\))|(\[".*?"\])|(\{".*?"\})|(<".*?">)|(\|".*?"\|)|(\(".*?"\))/);
        if (!contentMatch) return;

        const content = contentMatch[0];
        const nodeType = getNodeType(content);
        const hasIcon = line.includes('::icon');

        let icon = '';
        if (hasIcon) {
          const iconMatch = line.match(/::icon\((.*?)\)/);
          if (iconMatch) {
            icon = iconMatch[1].replace('fafa', 'fa fa');
          }
        }

        nodesAddedAtLevel[level] = (nodesAddedAtLevel[level] || 0);
        const position = calculateNodePosition(
          level,
          nodesAddedAtLevel[level],
          nodesPerLevel[level]
        );

        const nodeId = `node-${currentNodeId}`;
        const node = {
          id: nodeId,
          type: 'custom',
          data: { 
            label: content.replace(/[[\](){}|<>"]/g, ''),
            icon: icon,
            level: level,
            type: nodeType
          },
          position: position,
          style: getNodeStyle(
            nodeType, 
            nodeShapes[nodeId] || SHAPES.RECTANGLE,
            level === 0, 
            expandedNodes.has(nodeId)
          ),
        };

        nodes.push(node);

        if (level > 0 && lastNodeAtLevel[level - 1] !== undefined) {
          edges.push({
            id: `edge-${currentNodeId}`,
            source: lastNodeAtLevel[level - 1],
            target: node.id,
            ...edgeDefaults,
          });
        }

        lastNodeAtLevel[level] = node.id;
        nodesAddedAtLevel[level]++;
        currentNodeId++;
      });

      setAllNodes(nodes);
      setAllEdges(edges);

      // Filter nodes and edges based on expanded state
      const visibleNodes = nodes.filter(node => {
        if (node.data.level === 0) return true;
        const parentEdge = edges.find(edge => edge.target === node.id);
        return parentEdge && expandedNodes.has(parentEdge.source);
      });

      const visibleEdges = edges.filter(edge => 
        visibleNodes.some(n => n.id === edge.source) && 
        visibleNodes.some(n => n.id === edge.target)
      );

      return { nodes: visibleNodes, edges: visibleEdges };
    } catch (err) {
      console.error('Error processing chart:', err);
      setError('Error processing mindmap structure');
      setDebugInfo(prev => prev + '\n\nError: ' + err.message);
      return { nodes: [], edges: [] };
    }
  }, [expandedNodes, nodeShapes]);

  useEffect(() => {
    if (!chart) return;

    const { nodes, edges } = processChart(chart);
    setNodes(nodes);
    setEdges(edges);
  }, [chart, processChart, setNodes, setEdges]);

  const nodeTypes = {
    custom: CustomNode,
  };

  const handleNodeDoubleClick = (event, node) => {
    event.preventDefault();
    setEditingNode(node);
    setEditValue(node.data.label);
    setIsEditing(true);
  };

  const handleEdgeContextMenu = (event, edge) => {
    event.preventDefault();
    const currentType = edgeTypes[edge.id] || LINE_TYPES.SMOOTHSTEP;
    const types = Object.values(LINE_TYPES);
    const nextTypeIndex = (types.indexOf(currentType) + 1) % types.length;
    setEdgeTypes(prev => ({
      ...prev,
      [edge.id]: types[nextTypeIndex]
    }));
  };

  const handleEditSave = () => {
    if (!editingNode) return;
    
    setNodes(nds =>
      nds.map(n => {
        if (n.id === editingNode.id) {
          return {
            ...n,
            data: { ...n.data, label: editValue }
          };
        }
        return n;
      })
    );
    setIsEditing(false);
    setEditingNode(null);
    setEditValue('');
  };

  const handleNodeDragStop = (event, node) => {
    const newX = Math.round(node.position.x / SNAP_GRID[0]) * SNAP_GRID[0];
    const newY = Math.round(node.position.y / SNAP_GRID[1]) * SNAP_GRID[1];
    
    setNodes(nds => 
      nds.map(n => {
        if (n.id === node.id) {
          return {
            ...n,
            position: { x: newX, y: newY }
          };
        }
        return n;
      })
    );
  };

  // Update edge defaults to include type from edgeTypes state
  const getEdgeStyle = (edge) => ({
    ...edgeDefaults,
    type: edgeTypes[edge.id] || LINE_TYPES.SMOOTHSTEP,
  });

  return (
    <div className="mindmap-wrapper" onContextMenu={e => e.preventDefault()}>
      {error ? (
        <div className="mindmap-error">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <div className="error-title">{error}</div>
            <div className="error-subtitle">React Flow mindmap</div>
            <details className="debug-details">
              <summary className="debug-header">
                Debug Information
              </summary>
              <pre className="debug-info">{debugInfo}</pre>
            </details>
          </div>
        </div>
      ) : (
        <div style={{ width: '100%', height: '600px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges.map(edge => ({
              ...edge,
              ...getEdgeStyle(edge)
            }))}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
            onNodeDragStop={handleNodeDragStop}
            onEdgeContextMenu={handleEdgeContextMenu}
            nodeTypes={nodeTypes}
            snapToGrid={true}
            snapGrid={SNAP_GRID}
            fitView
            minZoom={0.1}
            maxZoom={1.5}
            defaultZoom={0.8}
            attributionPosition="bottom-left"
          >
            <Controls showInteractive={false} />
            <MiniMap 
              nodeColor={node => node.style?.background || '#2c3e50'}
              maskColor="rgba(0, 0, 0, 0.2)"
            />
            <Background color="#34495e" gap={16} size={1} />
          </ReactFlow>

          {isEditing && editingNode && (
            <div className="node-edit-modal">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleEditSave();
                  }
                }}
                autoFocus
              />
              <div className="edit-buttons">
                <button onClick={handleEditSave}>Save</button>
                <button onClick={() => {
                  setIsEditing(false);
                  setEditingNode(null);
                  setEditValue('');
                }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MindMap; 