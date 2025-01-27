export const SPACING = {
  X: 250, // Horizontal spacing between nodes
  Y: 100, // Vertical spacing between siblings
};

export const SNAP_GRID = [20, 20];

export const calculateNodePosition = (level, index, totalAtLevel) => {
  const x = level * SPACING.X;
  const totalHeight = (totalAtLevel - 1) * SPACING.Y;
  const y = (index * SPACING.Y) - (totalHeight / 2);
  return { x, y };
};

export const getDescendants = (nodeId, edges) => {
  const descendants = new Set();
  const stack = [nodeId];
  
  while (stack.length > 0) {
    const current = stack.pop();
    descendants.add(current);
    
    // Find all edges where this node is the source
    edges.forEach(edge => {
      if (edge.source === current) {
        stack.push(edge.target);
      }
    });
  }
  
  return descendants;
}; 