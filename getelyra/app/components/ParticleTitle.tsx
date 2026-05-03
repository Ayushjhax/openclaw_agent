'use client';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  tx: number; ty: number;
  vx: number; vy: number;
  settled: boolean;
  driftPhase: number;
  driftAmp: number;
}

const SPRING = 0.055;
const FRICTION = 0.80;
const REPEL_RADIUS = 110;
const REPEL_STRENGTH = 10;
const SAMPLE_GAP = 3;

function getCanvasHeight(w: number) {
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  if (w < 500 || vh < 700) return 180;
  if (vh < 820) return 220;
  return 280;
}
function getFont1(w: number) { return Math.min(72, Math.max(38, w * 0.145)); }
function getFont2(w: number) { return Math.min(40, Math.max(20, w * 0.078)); }

export default function ParticleTitle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function init() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth || window.innerWidth;
      const h = getCanvasHeight(w);
      canvas.width = w;
      canvas.height = h;
      canvas.style.height = `${h}px`;

      const f1 = getFont1(w);
      const f2 = getFont2(w);

      const offscreen = document.createElement('canvas');
      offscreen.width = w;
      offscreen.height = h;
      const octx = offscreen.getContext('2d')!;
      octx.fillStyle = 'white';
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';

      octx.font = `italic ${f1}px 'Instrument Serif', serif`;
      octx.fillText('The Intelligence', w / 2, h * 0.30);

      octx.font = `italic ${f2}px 'Instrument Serif', serif`;
      octx.fillText('Powered by multi-agentic orchestration', w / 2, h * 0.74);

      const imageData = octx.getImageData(0, 0, w, h);
      const particles: Particle[] = [];

      for (let y = 0; y < h; y += SAMPLE_GAP) {
        for (let x = 0; x < w; x += SAMPLE_GAP) {
          const idx = (y * w + x) * 4;
          if (imageData.data[idx + 3] > 128) {
            const startY = Math.random() < 0.5 ? -50 : h + 50;
            particles.push({
              x: w / 2 + (Math.random() - 0.5) * w,
              y: startY,
              tx: x, ty: y,
              vx: 0, vy: 0,
              settled: false,
              driftPhase: Math.random() * Math.PI * 2,
              driftAmp: 0.3 + Math.random() * 0.5,
            });
          }
        }
      }
      return particles;
    }

    let particles = init() ?? [];

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onLeave);

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
        ctx.beginPath();
        ctx.arc(p.x, p.y, nearMouse ? 2.2 : 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${nearMouse ? 1 : 0.85})`;
        ctx.fill();
      }
      frame++;
      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      if (!canvas) return;
      cancelAnimationFrame(animId);
      particles = init() ?? [];
      animId = requestAnimationFrame(draw);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', display: 'block', cursor: 'default' }}
    />
  );
}
