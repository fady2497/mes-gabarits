import React, { useEffect, useRef, useState } from 'react';

const deg2rad = (deg) => (deg * Math.PI) / 180;

// Utility to describe an SVG arc for a sector
const describeArc = (cx, cy, r, startAngle, endAngle) => {
  const start = {
    x: cx + r * Math.cos(deg2rad(startAngle)),
    y: cy + r * Math.sin(deg2rad(startAngle))
  };
  const end = {
    x: cx + r * Math.cos(deg2rad(endAngle)),
    y: cy + r * Math.sin(deg2rad(endAngle))
  };
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    'Z'
  ].join(' ');
};

const Wheel = ({ segments = [], selectedIndex = 0, spinning = false, size = 220 }) => {
  const [rotation, setRotation] = useState(0);
  const prevSpinning = useRef(false);
  const anglePerSegment = 360 / segments.length;

  useEffect(() => {
    // Detect rising edge of spinning true
    if (spinning && !prevSpinning.current) {
      const extraSpins = 6; // full circles
      // We want the selected segment to land at the top (e.g., 0 deg)
      const targetAngle = 360 - selectedIndex * anglePerSegment - anglePerSegment / 2;
      const totalRotation = extraSpins * 360 + targetAngle;
      setRotation(totalRotation);
    }
    prevSpinning.current = spinning;
  }, [spinning, selectedIndex, anglePerSegment]);

  const radius = size / 2;
  const viewBox = `0 0 ${size} ${size}`;
  let cumulativeAngle = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox={viewBox}
        width={size}
        height={size}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)' : 'none'
        }}
        className="rounded-full"
      >
        {/* Outer ring */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - 1}
          fill="#0a0a0a"
          stroke="#fff"
          strokeWidth="4"
        />
        {/* Segments */}
        {segments.map((seg, idx) => {
          const startAngle = cumulativeAngle;
          const endAngle = cumulativeAngle + anglePerSegment;
          const path = describeArc(radius, radius, radius, startAngle, endAngle);
          cumulativeAngle += anglePerSegment;
          const fallback = idx % 2 === 0 ? '#111827' : '#0f172a';
          return (
            <path
              key={idx}
              d={path}
              fill={seg.color || fallback}
              stroke="#1f2937"
              strokeWidth="1"
            />
          );
        })}
        {/* Spokes */}
        {segments.map((_, idx) => {
          const angle = idx * anglePerSegment;
          const x2 = radius + (radius - 6) * Math.cos(deg2rad(angle));
          const y2 = radius + (radius - 6) * Math.sin(deg2rad(angle));
          return (
            <line
              key={`spoke-${idx}`}
              x1={radius}
              y1={radius}
              x2={x2}
              y2={y2}
              stroke="#374151"
              strokeWidth="1"
            />
          );
        })}
        {/* Inner dotted ring */}
        {segments.map((_, idx) => {
          const angle = (idx + 0.5) * anglePerSegment;
          const x = radius + radius * 0.6 * Math.cos(deg2rad(angle));
          const y = radius + radius * 0.6 * Math.sin(deg2rad(angle));
          return <circle key={`dot-${idx}`} cx={x} cy={y} r={radius * 0.03} fill="#ffffff" />;
        })}
        {/* Center bullseye */}
        <circle
          cx={radius}
          cy={radius}
          r={radius * 0.18}
          fill="#ffffff"
          stroke="#111827"
          strokeWidth="3"
        />
        <circle cx={radius} cy={radius} r={radius * 0.08} fill="#0a0a0a" />
        {/* Text labels */}
        {segments.map((seg, idx) => {
          const angle = (idx + 0.5) * anglePerSegment;
          const x = radius + radius * 0.75 * Math.cos(deg2rad(angle));
          const y = radius + radius * 0.75 * Math.sin(deg2rad(angle));
          return (
            <text
              key={idx}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={Math.max(10, Math.floor(size / 24))}
              fill="#ffffff"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
            >
              {seg.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default Wheel;
