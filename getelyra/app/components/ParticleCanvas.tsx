'use client';
import { useEffect, useRef } from 'react';

interface Pollen {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  phase: number;
  phaseSpeed: number;
  speedX: number;
  speedY: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 60;
    const spawnY = (p: Pollen) => {
      p.x = Math.random() * window.innerWidth;
      p.y = window.innerHeight * (0.55 + Math.random() * 0.13);
    };

    const pollen: Pollen[] = Array.from({ length: COUNT }, () => {
      const p: Pollen = {
        x: 0, y: 0,
        r: 0.1 + Math.random() * 0.7,
        baseOpacity: 0.08 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.5 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.08,
        speedY: -(0.05 + Math.random() * 0.22),
      };
      spawnY(p);
      return p;
    });

    let animId: number;
    let frame = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = frame * 0.016;

      for (const p of pollen) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < canvas.height * 0.44) spawnY(p);

        const heightRatio = p.y / canvas.height;
        const heightFactor = heightRatio < 0.5
          ? 0
          : heightRatio > 0.6
            ? 1
            : (heightRatio - 0.5) / 0.1;

        const pulse = 0.5 + 0.5 * Math.sin(t * p.phaseSpeed + p.phase);
        const opacity = p.baseOpacity * pulse * heightFactor;

        const bloom = p.r * 2.2;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, bloom);
        grad.addColorStop(0, `rgba(255,245,200,${opacity})`);
        grad.addColorStop(1, 'rgba(255,245,200,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, bloom, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      frame++;
      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}
    />
  );
}
