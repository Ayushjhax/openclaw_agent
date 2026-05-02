'use client';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  settled: boolean;
  driftPhase: number;
  driftAmp: number;
}

const SPRING = 0.055;
const FRICTION = 0.80;
const REPEL_RADIUS = 110;
const REPEL_STRENGTH = 10;
const SAMPLE_GAP = 3;

export default function ParticleTitle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth || window.innerWidth;
    canvas.height = 230;

    // Sample text mask
    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const octx = offscreen.getContext('2d')!;
    octx.fillStyle = 'white';
    octx.font = `italic 80px 'Instrument Serif', serif`;
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    const lines = ['The Intelligence', 'Your Portfolio Deserves'];
    octx.fillText(lines[0], canvas.width / 2, canvas.height * 0.34);
    octx.fillText(lines[1], canvas.width / 2, canvas.height * 0.72);

    const imageData = octx.getImageData(0, 0, canvas.width, canvas.height);
    const particles: Particle[] = [];

    for (let y = 0; y < canvas.height; y += SAMPLE_GAP) {
      for (let x = 0; x < canvas.width; x += SAMPLE_GAP) {
        const idx = (y * canvas.width + x) * 4;
        if (imageData.data[idx + 3] > 128) {
          const startY = Math.random() < 0.5 ? -50 : canvas.height + 50;
          particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width,
            y: startY,
            tx: x,
            ty: y,
            vx: 0,
            vy: 0,
            settled: false,
            driftPhase: Math.random() * Math.PI * 2,
            driftAmp: 0.3 + Math.random() * 0.5,
          });
        }
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    let animId: number;
    let frame = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = frame * 0.016;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_RADIUS) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          p.vx -= (dx / dist) * force * REPEL_STRENGTH;
          p.vy -= (dy / dist) * force * REPEL_STRENGTH;
        }

        let targetX = p.tx;
        let targetY = p.ty;

        if (dist > REPEL_RADIUS) {
          // Settled drift
          targetX += Math.sin(t * 0.8 + p.driftPhase) * p.driftAmp;
          targetY += Math.cos(t * 0.6 + p.driftPhase) * p.driftAmp;
        }

        p.vx += (targetX - p.x) * SPRING;
        p.vy += (targetY - p.y) * SPRING;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        const nearMouse = dist < REPEL_RADIUS * 1.3;
        const r = nearMouse ? 2.2 : 1.4;
        const opacity = nearMouse ? 1 : 0.85;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
      }

      frame++;
      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth || window.innerWidth;
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '230px', display: 'block', cursor: 'default' }}
    />
  );
}
