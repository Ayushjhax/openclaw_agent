'use client';
import { useEffect, useRef } from 'react';

interface Mote {
  x: number;
  y: number;
  r: number;
  opacity: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  speedX: number;
  speedY: number;
}

export default function AtmosphereCanvas() {
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

    const COUNT = 200;
    const motes: Mote[] = Array.from({ length: COUNT }, (_, i) => {
      const inUpperZone = i < COUNT * 0.55;
      return {
        x: Math.random() * window.innerWidth,
        y: inUpperZone
          ? Math.random() * window.innerHeight * 0.6
          : Math.random() * window.innerHeight,
        r: 0.4 + Math.random() * 1.4,
        baseOpacity: 0.18 + Math.random() * 0.45,
        opacity: 0,
        twinkleSpeed: 0.4 + Math.random() * 1.2,
        twinkleOffset: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.14,
        speedY: -(0.04 + Math.random() * 0.18),
      };
    });

    let animId: number;
    let frame = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = frame * 0.016;

      for (const m of motes) {
        m.x += m.speedX;
        m.y += m.speedY;

        if (m.y < -4) m.y = canvas.height + 2;
        if (m.x < -4) m.x = canvas.width + 2;
        if (m.x > canvas.width + 4) m.x = -2;

        const twinkle = 0.5 + 0.5 * Math.sin(t * m.twinkleSpeed + m.twinkleOffset);
        m.opacity = m.baseOpacity * twinkle;

        const bloom = m.r * 2.4;
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, bloom);
        grad.addColorStop(0, `rgba(255,255,255,${m.opacity})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(m.x, m.y, bloom, 0, Math.PI * 2);
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
