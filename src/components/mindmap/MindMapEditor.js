import React from 'react';

export const NodeEditModal = ({ 
  editValue, 
  setEditValue, 
  handleEditSave, 
  handleEditCancel 
}) => {
  return (
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
        <button onClick={handleEditCancel}>Cancel</button>
      </div>
    </div>
  );
};

export const handleNodeDoubleClick = (event, node, setEditingNode, setEditValue, setIsEditing) => {
  event.preventDefault();
  setEditingNode(node);
  setEditValue(node.data.label);
  setIsEditing(true);
};

export const handleEditSave = (editingNode, editValue, setNodes, setIsEditing, setEditingNode, setEditValue) => {
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

export const handleNodeDragStop = (event, node, setNodes, SNAP_GRID) => {
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