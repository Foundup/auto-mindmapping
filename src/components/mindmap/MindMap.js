import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { CustomNode, SHAPES, getNodeStyle } from './MindMapNode';
import { LINE_TYPES, getEdgeStyle } from './MindMapEdge';
import { SPACING, SNAP_GRID, calculateNodePosition, getDescendants } from './MindMapLayout';
import { getNodeType, extractIcon, processChartContent } from './MindMapUtils';
import { NodeEditModal, handleNodeDoubleClick, handleEditSave, handleNodeDragStop } from './MindMapEditor';

function MindMap({ chart }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set(['node-0']));
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
          const descendants = getDescendants(nodeId, edges);
          descendants.forEach(id => newExpanded.delete(id));
        } else {
          newExpanded.add(nodeId);
        }
        return newExpanded;
      });
    }
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

  useEffect(() => {
    if (!chart) return;
    const { nodes: processedNodes, edges: processedEdges } = processChartContent(chart, nodeShapes, expandedNodes);
    setNodes(processedNodes);
    setEdges(processedEdges);
  }, [chart, nodeShapes, expandedNodes, setNodes, setEdges]);

  const nodeTypes = {
    custom: CustomNode,
  };

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
            edges={edges.map(edge => getEdgeStyle(edge, edgeTypes))}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={(e, node) => handleNodeDoubleClick(e, node, setEditingNode, setEditValue, setIsEditing)}
            onNodeDragStop={(e, node) => handleNodeDragStop(e, node, setNodes, SNAP_GRID)}
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
            <NodeEditModal
              editValue={editValue}
              setEditValue={setEditValue}
              handleEditSave={() => handleEditSave(editingNode, editValue, setNodes, setIsEditing, setEditingNode, setEditValue)}
              handleEditCancel={() => {
                setIsEditing(false);
                setEditingNode(null);
                setEditValue('');
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default MindMap; 