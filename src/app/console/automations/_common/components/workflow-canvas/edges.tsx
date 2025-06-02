'use client';

import { EdgeProps, getBezierPath } from 'reactflow';
import { memo } from 'react';
import { EdgeComponentProps } from './types';

// A styled custom edge component for our workflow
export const CustomEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  selected
}: EdgeComponentProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: selected ? 2 : 1,
          stroke: selected ? '#3b82f6' : '#b1b1b7',
        }}
        className="react-flow__edge-path transition-all"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {label && (
        <foreignObject
          width={80}
          height={40}
          x={labelX - 40}
          y={labelY - 20}
          className="flex items-center justify-center edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="px-2 py-1 text-xs text-white bg-gray-800 rounded-md">
            {label}
          </div>
        </foreignObject>
      )}
    </>
  );
});

CustomEdge.displayName = 'CustomEdge';

export const edgeTypes = {
  custom: CustomEdge as any,
};
