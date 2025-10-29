"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  angle: number;
  angleVelocity: number;
}

export default function SmokeParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Mobile detection
    const isMobile = window.innerWidth < 768;
    const maxParticles = isMobile ? 30 : 80;
    const spawnRate = isMobile ? 150 : 80; // ms between spawns

    // Particle colors (purple and emerald variations)
    const colors = [
      "rgba(168, 85, 247, 0.6)",   // Purple
      "rgba(139, 92, 246, 0.5)",   // Light purple
      "rgba(16, 185, 129, 0.6)",   // Emerald
      "rgba(52, 211, 153, 0.5)",   // Light emerald
    ];

    // Create a new particle
    const createParticle = (): Particle => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;

      return {
        x: centerX + (Math.random() - 0.5) * 50,
        y: centerY + (Math.random() - 0.5) * 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 2000 + Math.random() * 2000, // 2-4 seconds
        size: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        angleVelocity: (Math.random() - 0.5) * 0.02,
      };
    };

    // Animation loop
    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new particles
      if (now - lastSpawnRef.current > spawnRate && particlesRef.current.length < maxParticles) {
        particlesRef.current.push(createParticle());
        lastSpawnRef.current = now;
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.life += deltaTime;
        if (particle.life >= particle.maxLife) return false;

        // Update position with sine wave
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.angle += particle.angleVelocity;

        // Add sine wave motion
        particle.x += Math.sin(particle.angle) * 0.5;
        particle.y += Math.cos(particle.angle) * 0.5;

        // Calculate opacity based on life (fade in/out)
        const lifeProgress = particle.life / particle.maxLife;
        let opacity = 1;
        if (lifeProgress < 0.2) {
          opacity = lifeProgress / 0.2; // Fade in
        } else if (lifeProgress > 0.8) {
          opacity = (1 - lifeProgress) / 0.2; // Fade out
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.restore();

        return true;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      particlesRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
