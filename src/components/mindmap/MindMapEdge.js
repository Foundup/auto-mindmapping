import { MarkerType } from 'reactflow';

export const LINE_TYPES = {
  SMOOTHSTEP: 'smoothstep',
  STRAIGHT: 'straight',
  BEZIER: 'bezier'
};

export const edgeDefaults = {
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

export const getEdgeStyle = (edge, edgeTypes) => ({
  ...edgeDefaults,
  type: edgeTypes[edge.id] || LINE_TYPES.SMOOTHSTEP,
}); 