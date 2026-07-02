import { useEffect, useRef } from 'react';
import { useGame } from '@store/gameStore';

/**
 * The "Palco": a procedural, pulsing AI core rendered on a 2D canvas. Its size,
 * color and orbiting agents reflect the live game state — a graphical companion
 * to the textual Reasoning Log. No sprites; all procedural for crisp scaling.
 */
export function CoreCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const accent = getVar('--accent') || '#3dd6d0';
    const accent2 = getVar('--accent-2') || '#8b7bf0';

    const draw = () => {
      const { state } = useGame.getState();
      const reduced = state.settings.reducedMotion;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      t += reduced ? 0 : 0.016;

      ctx.clearRect(0, 0, w, h);

      const tier = state.modelTier;
      const halluc = state.context.hallucination;
      const baseR = Math.min(w, h) * (0.13 + tier * 0.012);
      const pulse = reduced ? 1 : 1 + Math.sin(t * 1.4) * 0.05;
      const r = baseR * pulse;

      // outer glow
      const glow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 2.4);
      glow.addColorStop(0, withAlpha(accent, 0.25));
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // neural web
      const nodes = 6 + tier;
      ctx.strokeStyle = withAlpha(accent2, 0.35);
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes; i++) {
        const a = (i / nodes) * Math.PI * 2 + (reduced ? 0 : t * 0.2);
        const nx = cx + Math.cos(a) * r;
        const ny = cy + Math.sin(a) * r;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // core
      const coreGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.4, accent);
      coreGrad.addColorStop(1, accent2);
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // hallucination vignette
      if (halluc > 0.02) {
        ctx.strokeStyle = withAlpha('#ff5c5c', halluc * 0.7);
        ctx.lineWidth = 2 + halluc * 6;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2);
        ctx.stroke();
      }

      // orbiting agents
      const agents = state.agents.length;
      for (let i = 0; i < agents; i++) {
        const a = (i / Math.max(agents, 1)) * Math.PI * 2 + (reduced ? 0 : t * 0.6);
        const orbit = r * 1.9;
        const ax = cx + Math.cos(a) * orbit;
        const ay = cy + Math.sin(a) * orbit;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(ax, ay, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}

function getVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
