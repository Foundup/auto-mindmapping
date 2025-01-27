export const getNodeType = (content) => {
  if (content.includes('{"') && content.includes('"}')) return 'decision';
  if (content.includes('["') && content.includes('"]')) return 'process';
  if (content.includes('<"') && content.includes('">')) return 'input';
  if (content.includes('|"') && content.includes('"|')) return 'user';
  if (content.includes('(("') && content.includes('"))')) return 'root';
  if (content.includes('("') && content.includes('")')) return 'output';
  return 'default';
};

export const extractIcon = (line) => {
  if (!line.includes('::icon')) return '';
  const iconMatch = line.match(/::icon\((.*?)\)/);
  return iconMatch ? iconMatch[1].replace('fafa', 'fa fa') : '';
};

export const processChartContent = (content, nodeShapes, expandedNodes) => {
  if (!content) return { nodes: [], edges: [] };

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

  lines.forEach(line => {
    const indentMatch = line.match(/^[\t\s]*/);
    const level = indentMatch ? indentMatch[0].length / 2 : 0;

    const contentMatch = line.match(/(\(\(".*?"\)\))|(\[".*?"\])|(\{".*?"\})|(<".*?">)|(\|".*?"\|)|(\(".*?"\))/);
    if (!contentMatch) return;

    const content = contentMatch[0];
    const nodeType = getNodeType(content);
    const icon = extractIcon(line);

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
        icon,
        level,
        type: nodeType
      },
      position,
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

  return { nodes, edges };
}; 