"use client";

import { useEffect, useRef } from "react";

export default function SmokeRingsHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const rings = ringsRef.current;
    if (!container || !rings) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Subtle tilt based on mouse position
      const tiltX = y * 10;
      const tiltY = -x * 10;
      rings.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };

    const handleMouseLeave = () => {
      if (rings) {
        rings.style.transform = "rotateX(0deg) rotateY(0deg)";
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
      style={{ perspective: "1200px" }}
    >
      {/* Rings container with parallax tilt */}
      <div
        ref={ringsRef}
        className="relative flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Outer Ring - Purple gradient, Y-axis rotation */}
        <div
          className="smoke-ring smoke-ring-outer"
          style={{
            width: "300px",
            height: "300px",
            border: "3px solid transparent",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.8))",
            boxShadow: "0 0 40px rgba(168, 85, 247, 0.5), inset 0 0 40px rgba(168, 85, 247, 0.3)",
            animation: "smokeRotateY 8s linear infinite, smokePulse 4s ease-in-out infinite",
            position: "absolute",
          }}
        />

        {/* Middle Ring - Emerald gradient, X-axis rotation */}
        <div
          className="smoke-ring smoke-ring-middle"
          style={{
            width: "200px",
            height: "200px",
            border: "3px solid transparent",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.8))",
            boxShadow: "0 0 30px rgba(16, 185, 129, 0.5), inset 0 0 30px rgba(16, 185, 129, 0.3)",
            animation: "smokeRotateX 12s linear infinite, smokePulse 6s ease-in-out infinite 1s",
            position: "absolute",
          }}
        />

        {/* Inner Ring - Mixed gradient, Z-axis rotation */}
        <div
          className="smoke-ring smoke-ring-inner"
          style={{
            width: "100px",
            height: "100px",
            border: "3px solid transparent",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.6), rgba(16, 185, 129, 0.6))",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.6), inset 0 0 20px rgba(16, 185, 129, 0.4)",
            animation: "smokeRotateZ 15s linear infinite reverse, smokePulse 5s ease-in-out infinite 2s",
            position: "absolute",
          }}
        />

        {/* Center glow effect */}
        <div
          className="absolute"
          style={{
            width: "50px",
            height: "50px",
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.8), transparent)",
            filter: "blur(20px)",
            animation: "smokePulse 3s ease-in-out infinite",
          }}
        />
      </div>

      {/* Background ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div
          className="rounded-full"
          style={{
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.15), rgba(16, 185, 129, 0.1), transparent)",
            filter: "blur(60px)",
            animation: "smokePulse 8s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
