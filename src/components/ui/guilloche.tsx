import React from "react";

interface GuillocheProps {
  size?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
}

export function Guilloche({
  size = 500,
  className = "",
  strokeColor = "currentColor",
  strokeWidth = 0.5,
  opacity = 0.25,
}: GuillocheProps) {
  // Generate multi-lobe hypotrochoid spirograph path points
  const generatePath = (R: number, r: number, d: number, loops: number = 36) => {
    const points: string[] = [];
    const center = size / 2;
    const steps = 720;
    const maxTheta = loops * 2 * Math.PI;
    const stepTheta = maxTheta / steps;

    for (let i = 0; i <= steps; i++) {
      const theta = i * stepTheta;
      const x = center + (R - r) * Math.cos(theta) + d * Math.cos(((R - r) / r) * theta);
      const y = center + (R - r) * Math.sin(theta) - d * Math.sin(((R - r) / r) * theta);
      points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return points.join(" ");
  };

  const scale = size / 500;
  const path1 = generatePath(180 * scale, 84 * scale, 75 * scale, 14);
  const path2 = generatePath(210 * scale, 58 * scale, 65 * scale, 29);
  const path3 = generatePath(140 * scale, 60 * scale, 50 * scale, 10);
  const path4 = generatePath(230 * scale, 46 * scale, 40 * scale, 23);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      {/* Concentric micro-radii rings */}
      <circle cx={size / 2} cy={size / 2} r={(size / 2) * 0.96} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="2 2" />
      <circle cx={size / 2} cy={size / 2} r={(size / 2) * 0.90} stroke={strokeColor} strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={(size / 2) * 0.75} stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeDasharray="3 3" />
      <circle cx={size / 2} cy={size / 2} r={(size / 2) * 0.35} stroke={strokeColor} strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={(size / 2) * 0.12} stroke={strokeColor} strokeWidth={strokeWidth} />

      {/* Intricate Rosette curves */}
      <path d={path1} stroke={strokeColor} strokeWidth={strokeWidth} />
      <path d={path2} stroke={strokeColor} strokeWidth={strokeWidth} />
      <path d={path3} stroke={strokeColor} strokeWidth={strokeWidth} />
      <path d={path4} stroke={strokeColor} strokeWidth={strokeWidth} />
    </svg>
  );
}
