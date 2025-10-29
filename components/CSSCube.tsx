"use client";

import { useEffect, useRef } from "react";

export default function CSSCube() {
  const cubeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (cubeRef.current) {
        // Add subtle tilt based on mouse position
        const tiltX = y * 20;
        const tiltY = -x * 20;
        cubeRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
    };

    const handleMouseLeave = () => {
      if (cubeRef.current) {
        cubeRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      {/* Animated cube container */}
      <div
        ref={cubeRef}
        className="cube-3d"
        style={{
          width: "200px",
          height: "200px",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Cube faces */}
        <div className="cube-face cube-face-front" />
        <div className="cube-face cube-face-back" />
        <div className="cube-face cube-face-right" />
        <div className="cube-face cube-face-left" />
        <div className="cube-face cube-face-top" />
        <div className="cube-face cube-face-bottom" />

        {/* Wireframe overlay */}
        <div className="cube-wireframe">
          {/* Edges */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`wire wire-${i}`} />
          ))}
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-64 animate-pulse rounded-full bg-emerald/20 blur-3xl" />
      </div>
    </div>
  );
}
