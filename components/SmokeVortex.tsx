"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  angle: number;
  distance: number;
  speed: number;
}

export default function SmokeVortex() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Responsive canvas sizing
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle color gradient (purple to emerald)
    const colorStops = [
      { r: 139, g: 92, b: 246 }, // Purple #8b5cf6
      { r: 168, g: 85, b: 247 }, // Mid purple
      { r: 16, g: 185, b: 129 }, // Emerald #10b981
      { r: 52, g: 211, b: 153 }, // Light emerald
    ];

    const getGradientColor = (ratio: number): string => {
      const index = Math.floor(ratio * (colorStops.length - 1));
      const nextIndex = Math.min(index + 1, colorStops.length - 1);
      const localRatio = (ratio * (colorStops.length - 1)) % 1;

      const color1 = colorStops[index];
      const color2 = colorStops[nextIndex];

      const r = Math.floor(color1.r + (color2.r - color1.r) * localRatio);
      const g = Math.floor(color1.g + (color2.g - color1.g) * localRatio);
      const b = Math.floor(color1.b + (color2.b - color1.b) * localRatio);

      return `rgb(${r}, ${g}, ${b})`;
    };

    // Initialize particles
    const initParticles = () => {
      // Responsive particle count based on screen size
      const isMobile = canvas.width < 768;
      const isTablet = canvas.width >= 768 && canvas.width < 1024;

      let particleCount;
      if (isMobile) {
        particleCount = Math.floor(canvas.width / 4); // 150-200 on mobile
      } else if (isTablet) {
        particleCount = Math.floor(canvas.width / 3.5); // 250-300 on tablet
      } else {
        particleCount = Math.floor(canvas.width / 3); // 350-400 on desktop
      }

      particleCount = Math.min(400, Math.max(150, particleCount));
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 10; // Start near center
        const speed = 0.3 + Math.random() * 0.7;
        const colorRatio = Math.random();

        particlesRef.current.push({
          x: canvas.width / 2 + Math.cos(angle) * distance,
          y: canvas.height / 2 + Math.sin(angle) * distance,
          vx: 0,
          vy: 0,
          radius: 1.5 + Math.random() * 2.5, // Increased from 1-3.5 to 1.5-4
          opacity: 0.4 + Math.random() * 0.5, // Increased from 0.3-0.8 to 0.4-0.9
          color: getGradientColor(colorRatio),
          angle,
          distance,
          speed,
        });
      }
    };

    initParticles();

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left - rect.width / 2) / rect.width,
        y: (e.clientY - rect.top - rect.height / 2) / rect.height,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Animation loop
    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Throttle to ~60fps
      if (deltaTime < 16) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.min(canvas.width, canvas.height) * 0.65; // Increased from 0.4 to 0.65

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Spiral motion
        particle.angle += 0.02 * particle.speed;
        particle.distance += particle.speed;

        // Reset particle if it goes too far
        if (particle.distance > maxDistance) {
          particle.distance = 0;
          particle.angle = Math.random() * Math.PI * 2;
          particle.opacity = 0.3 + Math.random() * 0.5;
        }

        // Calculate position with spiral
        particle.x = centerX + Math.cos(particle.angle) * particle.distance;
        particle.y = centerY + Math.sin(particle.angle) * particle.distance;

        // Apply mouse parallax (subtle)
        const parallaxX = mouseRef.current.x * 20;
        const parallaxY = mouseRef.current.y * 20;
        particle.x += parallaxX;
        particle.y += parallaxY;

        // Fade out as distance increases
        const distanceRatio = particle.distance / maxDistance;
        const currentOpacity = particle.opacity * (1 - distanceRatio);

        // Draw particle with enhanced glow
        ctx.shadowBlur = 18; // Increased from 10 to 18
        ctx.shadowColor = particle.color;
        ctx.globalAlpha = currentOpacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset shadow for next frame
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          width: "100%",
          height: "100%",
          willChange: "transform",
        }}
      />

      {/* Background ambient glow - Enhanced */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
        <div
          className="rounded-full"
          style={{
            width: "80%",
            height: "80%",
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.2), rgba(16, 185, 129, 0.15), transparent)",
            filter: "blur(80px)",
            animation: "smokePulse 8s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
