import React, { useState, useRef } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface NumberLineMarker {
  value: number;
  label?: string;
  color?: string;
  shape?: 'circle' | 'square' | 'triangle';
  draggable?: boolean;
  id?: string;
}

export interface NumberLineJump {
  from: number;
  to: number;
  label?: string;
  color?: string;
  curved?: boolean;
}

export interface NumberLineProps {
  start: number;
  end: number;
  step?: number;
  markers?: NumberLineMarker[];
  jumps?: NumberLineJump[];
  highlightPoints?: number[];
  showAllTicks?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onMarkersChange?: (markers: NumberLineMarker[]) => void;
  onJumpsChange?: (jumps: NumberLineJump[]) => void;
  showEquation?: boolean;
  equationType?: 'addition' | 'subtraction' | 'multiple';
  minDistance?: number; // Minimum distance between draggable markers
}

// ============================================================================
// NUMBER LINE COMPONENT
// ============================================================================

export const NumberLine: React.FC<NumberLineProps> = ({
  start,
  end,
  step = 1,
  markers = [],
  jumps = [],
  highlightPoints = [],
  showAllTicks = true,
  size = 'md',
  interactive = false,
  onMarkersChange,
  onJumpsChange,
  showEquation = false,
  equationType = 'addition',
  minDistance = 1
}) => {
  const [localMarkers, setLocalMarkers] = useState(markers);
  const [draggedMarkerId, setDraggedMarkerId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getDimensions = () => {
    const dimensions = {
      sm: { width: 400, height: 100, tickHeight: 8, markerSize: 8, fontSize: 'text-xs' },
      md: { width: 600, height: 120, tickHeight: 10, markerSize: 10, fontSize: 'text-sm' },
      lg: { width: 800, height: 150, tickHeight: 12, markerSize: 12, fontSize: 'text-base' }
    };
    return dimensions[size];
  };

  const dims = getDimensions();
  const range = end - start;
  const numSteps = range / step;

  const getXPosition = (value: number) => {
    return ((value - start) / range) * dims.width;
  };

  const getValueFromX = (x: number) => {
    const value = start + (x / dims.width) * range;
    return Math.round(value / step) * step;
  };

  const handleMouseDown = (markerId: string) => {
    if (!interactive) return;
    setDraggedMarkerId(markerId);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedMarkerId || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newValue = getValueFromX(x);

    if (newValue < start || newValue > end) return;

    const updatedMarkers = localMarkers.map(marker => {
      if (marker.id === draggedMarkerId) {
        // Check minDistance constraint
        const otherMarkers = localMarkers.filter(m => m.id !== draggedMarkerId && m.draggable);
        
        // For multiple jumps (3+ markers), enforce different rules
        if (equationType === 'multiple' && otherMarkers.length >= 2) {
          // Find the "edges" (first and last markers when sorted)
          const allValues = [...otherMarkers.map(m => m.value), newValue];
          const sorted = [...allValues].sort((a, b) => a - b);
          const minVal = sorted[0];
          const maxVal = sorted[sorted.length - 1];
          
          // If this is a middle marker, it needs to be at least 1 away from edges
          const isMiddleMarker = newValue !== minVal && newValue !== maxVal;
          if (isMiddleMarker) {
            const tooCloseToAny = otherMarkers.some(m => Math.abs(m.value - newValue) < 1);
            if (tooCloseToAny) return marker;
          } else {
            // Edge markers need minDistance from each other
            const tooCloseToEdge = otherMarkers.some(m => {
              const otherAllValues = otherMarkers.map(om => om.value);
              const otherSorted = [...otherAllValues, newValue].sort((a, b) => a - b);
              const otherMin = otherSorted[0];
              const otherMax = otherSorted[otherSorted.length - 1];
              
              // Check if m is also an edge
              const mIsEdge = m.value === otherMin || m.value === otherMax;
              return mIsEdge && Math.abs(m.value - newValue) < minDistance;
            });
            if (tooCloseToEdge) return marker;
          }
        } else {
          // For simple addition/subtraction (2 markers)
          const tooClose = otherMarkers.some(m => Math.abs(m.value - newValue) < minDistance);
          if (tooClose) return marker;
        }
        
        return { ...marker, value: newValue };
      }
      return marker;
    });

    setLocalMarkers(updatedMarkers);
    onMarkersChange?.(updatedMarkers);

    // Update jumps based on marker positions
    if (onJumpsChange && equationType !== 'multiple') {
      if (updatedMarkers.length >= 2) {
        const marker1 = updatedMarkers[0];
        const marker2 = updatedMarkers[1];
        const diff = marker2.value - marker1.value;
        
        const newJumps: NumberLineJump[] = [{
          from: marker1.value,
          to: marker2.value,
          label: diff >= 0 ? `+${diff}` : `${diff}`,
          color: diff >= 0 ? '#3b82f6' : '#f59e0b'
        }];
        
        onJumpsChange?.(newJumps);
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedMarkerId(null);
  };

  const renderMarker = (marker: NumberLineMarker, index: number) => {
    const x = getXPosition(marker.value);
    const y = dims.height / 2;
    const color = marker.color || '#ef4444';
    const shape = marker.shape || 'circle';
    const isDraggable = interactive && marker.draggable;
    const isDragging = draggedMarkerId === marker.id;

    return (
      <g 
        key={`marker-${index}`}
        className={isDraggable ? 'cursor-move' : ''}
        onMouseDown={() => isDraggable && handleMouseDown(marker.id!)}
      >
        {shape === 'circle' && (
          <circle
            cx={x}
            cy={y}
            r={dims.markerSize}
            fill={color}
            stroke="white"
            strokeWidth="2"
            className={isDragging ? 'opacity-80' : ''}
          />
        )}
        {shape === 'square' && (
          <rect
            x={x - dims.markerSize}
            y={y - dims.markerSize}
            width={dims.markerSize * 2}
            height={dims.markerSize * 2}
            fill={color}
            stroke="white"
            strokeWidth="2"
            className={isDragging ? 'opacity-80' : ''}
          />
        )}
        {shape === 'triangle' && (
          <polygon
            points={`${x},${y - dims.markerSize} ${x + dims.markerSize},${y + dims.markerSize} ${x - dims.markerSize},${y + dims.markerSize}`}
            fill={color}
            stroke="white"
            strokeWidth="2"
            className={isDragging ? 'opacity-80' : ''}
          />
        )}
        {marker.label && (
          <text
            x={x}
            y={y - dims.markerSize - 8}
            textAnchor="middle"
            className={`font-semibold ${dims.fontSize} pointer-events-none`}
            fill={color}
          >
            {marker.label}
          </text>
        )}
      </g>
    );
  };

  const renderJump = (jump: NumberLineJump, index: number) => {
    const x1 = getXPosition(jump.from);
    const x2 = getXPosition(jump.to);
    const y = dims.height / 2 - 30;
    const color = jump.color || '#3b82f6';
    const curved = jump.curved ?? true;
    
    // Determine direction
    const isReversed = x2 < x1;

    const midX = (x1 + x2) / 2;
    const controlY = y - 20;

    return (
      <g key={`jump-${index}`}>
        {curved ? (
          <>
            <path
              d={`M ${x1} ${y} Q ${midX} ${controlY} ${x2} ${y}`}
              stroke={color}
              strokeWidth="3"
              fill="none"
            />
            {/* Arrowhead at the end */}
            <polygon
              points={
                isReversed
                  ? `${x2},${y} ${x2 + 8},${y - 5} ${x2 + 8},${y + 5}`
                  : `${x2},${y} ${x2 - 8},${y - 5} ${x2 - 8},${y + 5}`
              }
              fill={color}
            />
          </>
        ) : (
          <>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth="3" />
            <polygon
              points={
                isReversed
                  ? `${x2},${y} ${x2 + 8},${y - 5} ${x2 + 8},${y + 5}`
                  : `${x2},${y} ${x2 - 8},${y - 5} ${x2 - 8},${y + 5}`
              }
              fill={color}
            />
          </>
        )}
        {jump.label && (
          <text
            x={midX}
            y={controlY - 5}
            textAnchor="middle"
            className={`font-semibold ${dims.fontSize}`}
            fill={color}
          >
            {jump.label}
          </text>
        )}
      </g>
    );
  };

  const calculateEquation = () => {
    if (!showEquation || localMarkers.length < 2) return null;

    if (equationType === 'multiple') {
      // For multiple jumps, use actual marker positions, not sorted
      const startMarker = localMarkers.find(m => m.id === 'start-m');
      const midMarker = localMarkers.find(m => m.id === 'mid-m');
      const endMarker = localMarkers.find(m => m.id === 'end-m');
      
      if (!startMarker || !midMarker || !endMarker) return null;
      
      const diff1 = midMarker.value - startMarker.value;
      const diff2 = endMarker.value - midMarker.value;
      
      let equation = `${startMarker.value}`;
      
      if (diff1 >= 0) {
        equation += ` + ${diff1}`;
      } else {
        equation += ` - ${Math.abs(diff1)}`;
      }
      
      if (diff2 >= 0) {
        equation += ` + ${diff2}`;
      } else {
        equation += ` - ${Math.abs(diff2)}`;
      }
      
      equation += ` = ${endMarker.value}`;
      return equation;
    } else {
      // For addition/subtraction - use actual marker order, not sorted
      const firstMarker = localMarkers[0];
      const secondMarker = localMarkers[1];
      const diff = secondMarker.value - firstMarker.value;
      
      if (diff >= 0) {
        return `${firstMarker.value} + ${diff} = ${secondMarker.value}`;
      } else {
        return `${firstMarker.value} - ${Math.abs(diff)} = ${secondMarker.value}`;
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <svg 
        ref={svgRef}
        width={dims.width} 
        height={dims.height}
        className={interactive ? 'cursor-pointer' : ''}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Main line */}
        <line
          x1="0"
          y1={dims.height / 2}
          x2={dims.width}
          y2={dims.height / 2}
          stroke="#1f2937"
          strokeWidth="3"
        />

        {/* Tick marks and labels */}
        {Array.from({ length: numSteps + 1 }).map((_, i) => {
          const value = start + i * step;
          const x = getXPosition(value);
          const isHighlighted = highlightPoints.includes(value);
          const isMajorTick = i % 5 === 0 || i === 0 || i === numSteps;

          return (
            <g key={`tick-${i}`}>
              {(showAllTicks || isMajorTick) && (
                <>
                  <line
                    x1={x}
                    y1={dims.height / 2 - dims.tickHeight}
                    x2={x}
                    y2={dims.height / 2 + dims.tickHeight}
                    stroke="#1f2937"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={dims.height / 2 + dims.tickHeight + 15}
                    textAnchor="middle"
                    className={`font-semibold ${dims.fontSize} ${
                      isHighlighted ? 'fill-blue-600' : 'fill-gray-700'
                    }`}
                  >
                    {value}
                  </text>
                </>
              )}
              {isHighlighted && (
                <circle
                  cx={x}
                  cy={dims.height / 2}
                  r={dims.markerSize}
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
              )}
            </g>
          );
        })}

        {/* Render jumps */}
        {jumps.map((jump, index) => renderJump(jump, index))}

        {/* Render markers */}
        {localMarkers.map((marker, index) => renderMarker(marker, index))}
      </svg>

      {/* Equation display */}
      {showEquation && (
        <div className="text-2xl font-bold text-gray-800">
          {calculateEquation()}
        </div>
      )}

      {interactive && (
        <p className="text-sm text-gray-500">
          {draggedMarkerId ? 'Drag to move the marker' : 'Click and drag the markers'}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// DEMO COMPONENT
// ============================================================================

const NumberLineDemo: React.FC = () => {
  // Addition example
  const [additionMarkers, setAdditionMarkers] = useState<NumberLineMarker[]>([
    { value: 3, label: 'Start', color: '#22c55e', shape: 'circle', draggable: true, id: 'start' },
    { value: 8, label: 'End', color: '#ef4444', shape: 'circle', draggable: true, id: 'end' }
  ]);
  const [additionJumps, setAdditionJumps] = useState<NumberLineJump[]>([
    { from: 3, to: 8, label: '+5', color: '#3b82f6' }
  ]);

  // Multiple jumps example
  const [multipleMarkers, setMultipleMarkers] = useState<NumberLineMarker[]>([
    { value: 2, label: 'Start', color: '#22c55e', shape: 'circle', draggable: true, id: 'start-m' },
    { value: 5, color: '#8b5cf6', shape: 'circle', draggable: true, id: 'mid-m' },
    { value: 9, label: 'End', color: '#ef4444', shape: 'circle', draggable: true, id: 'end-m' }
  ]);
  const [multipleJumps, setMultipleJumps] = useState<NumberLineJump[]>([
    { from: 2, to: 5, label: '+3', color: '#3b82f6' },
    { from: 5, to: 9, label: '+4', color: '#8b5cf6' }
  ]);

  // Update jumps for multiple markers
  const handleMultipleMarkersChange = (markers: NumberLineMarker[]) => {
    setMultipleMarkers(markers);
    
    // Find start (green), middle (purple), and end (red) by their IDs
    const startMarker = markers.find(m => m.id === 'start-m');
    const midMarker = markers.find(m => m.id === 'mid-m');
    const endMarker = markers.find(m => m.id === 'end-m');
    
    if (!startMarker || !midMarker || !endMarker) return;
    
    const newJumps: NumberLineJump[] = [];
    
    // First jump: from start to middle
    const diff1 = midMarker.value - startMarker.value;
    newJumps.push({
      from: startMarker.value,
      to: midMarker.value,
      label: diff1 >= 0 ? `+${diff1}` : `${diff1}`,
      color: '#3b82f6'
    });
    
    // Second jump: from middle to end
    const diff2 = endMarker.value - midMarker.value;
    newJumps.push({
      from: midMarker.value,
      to: endMarker.value,
      label: diff2 >= 0 ? `+${diff2}` : `${diff2}`,
      color: '#8b5cf6'
    });
    
    setMultipleJumps(newJumps);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Interactive Number Line</h1>
        <p className="text-gray-600 mb-8">Drag markers to explore operations dynamically</p>

        <div className="space-y-8">
          {/* Basic Number Line */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Basic Number Line</h2>
            <p className="text-gray-600 mb-4">Simple number line from 0 to 10</p>
            <NumberLine start={0} end={10} size="lg" />
          </div>

          {/* Interactive Addition/Subtraction */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Interactive Addition/Subtraction</h2>
            <p className="text-gray-600 mb-4">
              Drag the start (green) or end (red) markers. When start crosses end, it becomes subtraction!
            </p>
            <NumberLine 
              start={0} 
              end={15}
              markers={additionMarkers}
              jumps={additionJumps}
              size="lg"
              interactive={true}
              onMarkersChange={setAdditionMarkers}
              onJumpsChange={setAdditionJumps}
              showEquation={true}
              equationType="addition"
            />
          </div>

          {/* Interactive Multiple Jumps */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Interactive Multiple Jumps</h2>
            <p className="text-gray-600 mb-4">
              Drag any marker! Minimum distance of 2 between markers is enforced.
            </p>
            <NumberLine 
              start={0} 
              end={12}
              markers={multipleMarkers}
              jumps={multipleJumps}
              size="lg"
              interactive={true}
              onMarkersChange={handleMultipleMarkersChange}
              showEquation={true}
              equationType="multiple"
              minDistance={2}
            />
          </div>

          {/* Static Examples */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Static: Highlighted Points</h2>
            <p className="text-gray-600 mb-4">Non-interactive with emphasized numbers</p>
            <NumberLine 
              start={0} 
              end={20} 
              step={2}
              highlightPoints={[4, 10, 16]}
              size="lg" 
              interactive={false}
            />
          </div>

          {/* Negative Numbers */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Negative Numbers</h2>
            <p className="text-gray-600 mb-4">Number line with negative values</p>
            <NumberLine 
              start={-10} 
              end={10}
              highlightPoints={[-5, 0, 5]}
              size="lg"
            />
          </div>

          {/* Skip Counting */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Skip Counting by 5</h2>
            <p className="text-gray-600 mb-4">Number line with larger intervals</p>
            <NumberLine 
              start={0} 
              end={50}
              step={5}
              highlightPoints={[15, 30, 45]}
              size="lg"
            />
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Component Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-gray-700">
              <li>✅ <strong>Drag and drop markers</strong> - Interactive manipulation</li>
              <li>✅ <strong>Auto-updating equations</strong> - Shows current operation</li>
              <li>✅ <strong>Addition ↔ Subtraction</strong> - Automatic switching</li>
              <li>✅ <strong>Multiple jumps</strong> - Sequence of operations</li>
              <li>✅ <strong>Minimum distance</strong> - Prevent marker collisions</li>
            </ul>
            <ul className="space-y-2 text-gray-700">
              <li>✅ <strong>Flexible range</strong> - Any start/end values</li>
              <li>✅ <strong>Custom markers</strong> - Shapes and colors</li>
              <li>✅ <strong>Negative numbers</strong> - Works with negatives</li>
              <li>✅ <strong>Size variants</strong> - sm, md, lg</li>
              <li>✅ <strong>TypeScript types</strong> - Full type safety</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberLineDemo;