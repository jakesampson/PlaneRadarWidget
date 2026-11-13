/**
 * Canvas renderer for the military-style sweeping radar.
 *
 * The sweep angle is derived from wall-clock time. Blip brightness is a
 * stateless function of the angular distance behind the sweep, and newly
 * polled positions are held back until the beam crosses the aircraft's
 * bearing — so contacts appear to be "painted" one at a time by the sweep
 * rather than every blip jumping at once.
 */

import type { Aircraft, DistanceUnit } from './types';
import { formatDistance } from './geo';

export interface RadarOptions {
  rangeNm: number;
  rings: number;
  sweepDurationSec: number;
  distanceUnit: DistanceUnit;
  showLabels: boolean;
  selectedId: string | null;
  /** Seconds of historical track to draw behind each aircraft. 0 disables. */
  trailSeconds: number;
}

const PHOSPHOR = '#2bffa0';
const PHOSPHOR_BRIGHT = '#8affce';
const PHOSPHOR_DIM = 'rgba(43, 255, 160, 0.28)';
const PHOSPHOR_FAINT = 'rgba(43, 255, 160, 0.12)';
const TRAIL_DEG = 78; // how far behind the beam the phosphor "afterglow" reaches

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

const MAX_TRAIL_POINTS = 240;

interface Layout {
  cx: number;
  cy: number;
  radius: number; // outer rim radius in CSS px
}

/** One sampled position of an aircraft, in polar coordinates around the radar. */
interface TrackPoint {
  /** performance.now() timestamp of the sample. */
  t: number;
  distanceNm: number;
  bearingDeg: number;
}

interface PolarPosition {
  distanceNm: number;
  bearingDeg: number;
}

/**
 * Per-aircraft radar state.
 *
 * New ADS-B data is held as `pending` and only painted onto the scope when the
 * sweep passes the aircraft's bearing — so contacts update one at a time as
 * the beam reveals them, rather than every blip jumping at once.
 */
interface BlipState {
  /** Position currently drawn on the scope. */
  display: PolarPosition;
  /** Heading currently used to rotate the plane glyph. */
  headingDeg: number | null;
  /** Latest reported position, waiting for the sweep to reach `revealDeg`. */
  pending: (PolarPosition & { headingDeg: number | null }) | null;
  /** Sweep angle (degrees) at which the pending position is painted. */
  revealDeg: number;
  /** False until the sweep has first revealed this contact. */
  visible: boolean;
}

/** True when two polar positions are close enough to be considered identical. */
function samePosition(a: PolarPosition, b: PolarPosition): boolean {
  return (
    Math.abs(a.distanceNm - b.distanceNm) <= 0.005 &&
    Math.abs(a.bearingDeg - b.bearingDeg) <= 0.05
  );
}

export class RadarRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private aircraft: Aircraft[] = [];
  private options: RadarOptions = {
    rangeNm: 50,
    rings: 4,
    sweepDurationSec: 6,
    distanceUnit: 'nm',
    showLabels: true,
    selectedId: null,
    trailSeconds: 60,
  };
  private raf = 0;
  private layout: Layout = { cx: 0, cy: 0, radius: 0 };
  private resizeObserver: ResizeObserver;
  private trails = new Map<string, TrackPoint[]>();
  private states = new Map<string, BlipState>();
  private lastSweepDeg: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    this.ctx = ctx;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }

  destroy(): void {
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.trails.clear();
    this.states.clear();
  }

  setAircraft(list: Aircraft[]): void {
    this.aircraft = list;
    const reported = new Set<string>();

    for (const ac of list) {
      reported.add(ac.id);
      const state = this.states.get(ac.id);
      if (!state) {
        // New contact: hold it until the sweep first reaches its bearing.
        this.states.set(ac.id, {
          display: { distanceNm: ac.distanceNm, bearingDeg: ac.bearingDeg },
          headingDeg: ac.headingDeg,
          pending: {
            distanceNm: ac.distanceNm,
            bearingDeg: ac.bearingDeg,
            headingDeg: ac.headingDeg,
          },
          revealDeg: ac.bearingDeg,
          visible: false,
        });
        continue;
      }

      const target = state.pending ?? state.display;
      if (!samePosition(target, ac)) {
        state.pending = {
          distanceNm: ac.distanceNm,
          bearingDeg: ac.bearingDeg,
          headingDeg: ac.headingDeg,
        };
        state.revealDeg = ac.bearingDeg;
      }
    }

    // Drop contacts that are no longer reported by the API.
    for (const id of this.states.keys()) {
      if (!reported.has(id)) this.states.delete(id);
    }

    this.pruneTrails(performance.now());
  }

  setOptions(options: Partial<RadarOptions>): void {
    const previousTrail = this.options.trailSeconds;
    this.options = { ...this.options, ...options };
    if (options.trailSeconds !== undefined && options.trailSeconds !== previousTrail) {
      this.pruneTrails(performance.now());
    }
  }

  /**
   * Forget all tracks and contact states (e.g. the radar centre moved or the
   * card reloaded). The next data update starts a clean scope.
   */
  clearHistory(): void {
    this.trails.clear();
    this.states.clear();
    this.lastSweepDeg = null;
  }

  getLayout(): Layout {
    return this.layout;
  }

  start(): void {
    const tick = () => {
      this.draw();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  /** Hit-test in CSS pixel coordinates relative to the canvas. */
  hitTest(x: number, y: number): Aircraft | null {
    const { cx, cy, radius } = this.layout;
    if (radius <= 0) return null;
    const { rangeNm } = this.options;
    let best: Aircraft | null = null;
    let bestDist = Infinity;
    for (const ac of this.aircraft) {
      const state = this.states.get(ac.id);
      if (!state || !state.visible || state.display.distanceNm > rangeNm) continue;
      const pos = this.projectPolar(
        state.display.distanceNm,
        state.display.bearingDeg,
        cx,
        cy,
        radius,
      );
      const d = Math.hypot(pos.x - x, pos.y - y);
      const threshold = Math.max(16, radius * 0.045);
      if (d < threshold && d < bestDist) {
        best = ac;
        bestDist = d;
      }
    }
    return best;
  }

  private projectPolar(
    distanceNm: number,
    bearingDeg: number,
    cx: number,
    cy: number,
    radius: number,
  ): { x: number; y: number } {
    const r = (distanceNm / this.options.rangeNm) * radius;
    const angle = (bearingDeg - 90) * DEG; // 0° bearing = up
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  /**
   * Paint pending contact updates when the sweep crosses their bearing. This
   * keeps every blip in step with the rotating beam instead of having the
   * whole scope jump at once when a poll completes.
   */
  private applyPendingReveals(sweepDeg: number, now: number): void {
    const previous = this.lastSweepDeg;
    this.lastSweepDeg = sweepDeg;
    if (previous === null) return;

    // Degrees the beam travelled this frame (clockwise, wrapping at 360).
    const delta = (sweepDeg - previous + 360) % 360;
    if (delta <= 0) return;

    for (const [id, state] of this.states) {
      if (!state.pending) continue;
      // How far ahead the reveal bearing is from where the beam was.
      const target = (state.revealDeg - previous + 360) % 360;
      if (target > delta) continue;

      state.display = {
        distanceNm: state.pending.distanceNm,
        bearingDeg: state.pending.bearingDeg,
      };
      state.headingDeg = state.pending.headingDeg;
      state.pending = null;
      state.visible = true;
      this.pushTrackPoint(id, state.display.distanceNm, state.display.bearingDeg, now);
    }
  }

  /** Append a revealed position to an aircraft's historical track. */
  private pushTrackPoint(id: string, distanceNm: number, bearingDeg: number, now: number): void {
    const seconds = this.options.trailSeconds;
    if (seconds <= 0) return;

    const maxAge = seconds * 1000;
    const trail = this.trails.get(id) ?? [];
    const last = trail[trail.length - 1];

    // Avoid storing duplicate samples when the contact has not moved.
    if (
      !last ||
      Math.abs(last.distanceNm - distanceNm) > 0.005 ||
      Math.abs(last.bearingDeg - bearingDeg) > 0.05
    ) {
      trail.push({ t: now, distanceNm, bearingDeg });
    }

    while (trail.length > 0 && now - trail[0].t > maxAge) trail.shift();
    if (trail.length > MAX_TRAIL_POINTS) trail.splice(0, trail.length - MAX_TRAIL_POINTS);
    this.trails.set(id, trail);
  }

  /** Remove expired historical track samples. */
  private pruneTrails(now: number): void {
    const seconds = this.options.trailSeconds;
    if (seconds <= 0) {
      this.trails.clear();
      return;
    }

    const maxAge = seconds * 1000;
    for (const [id, trail] of this.trails) {
      const fresh = trail.filter((point) => now - point.t <= maxAge);
      if (fresh.length === 0) this.trails.delete(id);
      else if (fresh.length !== trail.length) this.trails.set(id, fresh);
    }
  }

  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (this.canvas.width !== w * dpr || this.canvas.height !== h * dpr) {
      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
    }
  }

  private draw(): void {
    const { ctx, canvas } = this;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    if (w < 10 || h < 10) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2 - 26; // leave room for rim labels
    this.layout = { cx, cy, radius };

    const now = performance.now();
    const sweepDeg = ((now / 1000 / this.options.sweepDurationSec) * 360) % 360;

    // Reveal contacts whose bearing the beam crossed this frame before drawing.
    this.applyPendingReveals(sweepDeg, now);

    this.drawBackground(cx, cy, radius);
    this.drawGrid(cx, cy, radius);
    this.drawRim(cx, cy, radius);
    this.drawSweep(cx, cy, radius, sweepDeg, now);
    this.drawTrails(cx, cy, radius, now);
    this.drawBlips(cx, cy, radius, sweepDeg, now);
    this.drawHome(cx, cy);
  }

  private drawBackground(cx: number, cy: number, radius: number): void {
    const { ctx } = this;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, '#04281a');
    grad.addColorStop(0.75, '#02180f');
    grad.addColorStop(1, '#010f09');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.fill();
  }

  private drawGrid(cx: number, cy: number, radius: number): void {
    const { ctx, options } = this;

    // Diagonal spokes every 30 degrees
    ctx.save();
    ctx.strokeStyle = PHOSPHOR_FAINT;
    ctx.lineWidth = 1;
    for (let deg = 0; deg < 360; deg += 30) {
      const a = (deg - 90) * DEG;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(a), cy + radius * Math.sin(a));
      ctx.stroke();
    }

    // Cardinal crosshair, slightly brighter
    ctx.strokeStyle = PHOSPHOR_DIM;
    ctx.beginPath();
    ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy);
    ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius);
    ctx.stroke();

    // Range rings
    const rings = Math.max(1, Math.round(options.rings));
    for (let i = 1; i <= rings; i++) {
      ctx.strokeStyle = i === rings ? PHOSPHOR_DIM : PHOSPHOR_FAINT;
      ctx.lineWidth = i === rings ? 2 : 1;
      ctx.beginPath();
      ctx.arc(cx, cy, (radius * i) / rings, 0, TAU);
      ctx.stroke();
    }

    // Ring range labels along the NE (45°) diagonal
    ctx.fillStyle = 'rgba(43, 255, 160, 0.55)';
    ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.textAlign = 'left';
    const labelAngle = (45 - 90) * DEG;
    for (let i = 1; i <= rings; i++) {
      const r = (radius * i) / rings;
      const lx = cx + r * Math.cos(labelAngle) + 4;
      const ly = cy + r * Math.sin(labelAngle) - 2;
      ctx.fillText(formatDistance((options.rangeNm * i) / rings, options.distanceUnit), lx, ly);
    }
    ctx.restore();
  }

  private drawRim(cx: number, cy: number, radius: number): void {
    const { ctx } = this;

    // Rim ring with glow
    ctx.save();
    ctx.strokeStyle = PHOSPHOR;
    ctx.lineWidth = 2;
    ctx.shadowColor = PHOSPHOR;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.stroke();
    ctx.restore();

    // Tick marks + degree labels
    ctx.save();
    ctx.strokeStyle = PHOSPHOR;
    ctx.fillStyle = PHOSPHOR;
    ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let deg = 0; deg < 360; deg += 5) {
      const major = deg % 30 === 0;
      const cardinal = deg % 90 === 0;
      const a = (deg - 90) * DEG;
      const inner = radius + (major ? 12 : 6);
      const outer = radius + (major ? 22 : 11);
      ctx.lineWidth = major ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + inner * Math.cos(a), cy + inner * Math.sin(a));
      ctx.lineTo(cx + outer * Math.cos(a), cy + outer * Math.sin(a));
      ctx.stroke();

      if (major) {
        const tr = radius + 22;
        const tx = cx + tr * Math.cos(a);
        const ty = cy + tr * Math.sin(a);
        if (cardinal) {
          ctx.font = 'bold 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
          ctx.fillStyle = PHOSPHOR_BRIGHT;
          ctx.fillText(['N', 'E', 'S', 'W'][deg / 90], tx, ty);
          ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        } else {
          ctx.fillStyle = 'rgba(43, 255, 160, 0.75)';
          ctx.fillText(String(deg).padStart(3, '0'), tx, ty);
        }
      }
    }
    ctx.restore();
  }

  private drawSweep(cx: number, cy: number, radius: number, sweepDeg: number, now: number): void {
    const { ctx } = this;
    const leadAngle = (sweepDeg - 90) * DEG;
    const trailAngle = ((sweepDeg - TRAIL_DEG) - 90) * DEG;

    // Afterglow wedge using a conic gradient
    const trailFraction = TRAIL_DEG / 360;
    const conic = ctx.createConicGradient(trailAngle, cx, cy);
    conic.addColorStop(0, 'rgba(43, 255, 160, 0)');
    conic.addColorStop(trailFraction * 0.55, 'rgba(43, 255, 160, 0.10)');
    conic.addColorStop(trailFraction * 0.85, 'rgba(43, 255, 160, 0.22)');
    conic.addColorStop(trailFraction, 'rgba(120, 255, 200, 0.55)');
    conic.addColorStop(Math.min(1, trailFraction + 0.002), 'rgba(43, 255, 160, 0)');
    conic.addColorStop(1, 'rgba(43, 255, 160, 0)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, trailAngle, leadAngle);
    ctx.closePath();
    ctx.fillStyle = conic;
    ctx.fill();

    // Expanding "ping" ring once per revolution
    const phase = ((now / 1000 / this.options.sweepDurationSec) % 1 + 1) % 1;
    ctx.strokeStyle = `rgba(43, 255, 160, ${(0.16 * (1 - phase)).toFixed(3)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, phase * radius, 0, TAU);
    ctx.stroke();

    // Leading edge beam
    ctx.strokeStyle = PHOSPHOR_BRIGHT;
    ctx.shadowColor = PHOSPHOR;
    ctx.shadowBlur = 14;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(leadAngle), cy + radius * Math.sin(leadAngle));
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Historical track: a fading phosphor line through the last
   * `trailSeconds` of sampled positions (default one minute).
   */
  private drawTrails(cx: number, cy: number, radius: number, now: number): void {
    const { ctx, options } = this;
    const seconds = options.trailSeconds;
    if (seconds <= 0 || this.trails.size === 0) return;

    const maxAge = seconds * 1000;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.clip();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = PHOSPHOR;

    for (const [id, trail] of this.trails) {
      if (trail.length < 2) continue;
      const selected = options.selectedId === id;
      const baseAlpha = selected ? 0.62 : 0.34;
      ctx.lineWidth = selected ? 1.8 : 1.2;

      for (let i = 1; i < trail.length; i++) {
        const from = trail[i - 1];
        const to = trail[i];
        const age = now - to.t;
        if (age > maxAge) continue;
        const fade = Math.max(0, 1 - age / maxAge);
        if (fade <= 0) continue;

        const a = this.projectPolar(from.distanceNm, from.bearingDeg, cx, cy, radius);
        const b = this.projectPolar(to.distanceNm, to.bearingDeg, cx, cy, radius);
        ctx.globalAlpha = baseAlpha * fade;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  private drawBlips(cx: number, cy: number, radius: number, sweepDeg: number, now: number): void {
    const { ctx, options } = this;
    const blipSize = Math.max(6, Math.min(10, radius * 0.032));
    ctx.save();
    ctx.textBaseline = 'middle';

    for (const ac of this.aircraft) {
      const state = this.states.get(ac.id);
      // Contacts only appear once the sweep has revealed them.
      if (!state || !state.visible) continue;
      const { distanceNm, bearingDeg } = state.display;
      if (distanceNm > options.rangeNm) continue;
      const { x, y } = this.projectPolar(distanceNm, bearingDeg, cx, cy, radius);

      // Angular distance behind the beam, 0 when the beam is exactly on the blip.
      const since = (sweepDeg - bearingDeg + 360) % 360;
      const proximity = Math.max(0, 1 - since / TRAIL_DEG);
      const glow = Math.pow(proximity, 1.7);
      const alpha = 0.2 + 0.8 * glow;
      const selected = options.selectedId === ac.id;

      if (ac.onGround) {
        // Ground traffic: hollow square, never as bright
        ctx.strokeStyle = `rgba(255, 210, 110, ${(0.35 + 0.5 * glow).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        const s = blipSize * 0.75;
        ctx.strokeRect(x - s / 2, y - s / 2, s, s);
      } else {
        // Glow halo
        const halo = ctx.createRadialGradient(x, y, 0, x, y, blipSize * 2.6);
        halo.addColorStop(0, `rgba(120, 255, 200, ${(0.75 * alpha).toFixed(3)})`);
        halo.addColorStop(1, 'rgba(43, 255, 160, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, blipSize * 2.6, 0, TAU);
        ctx.fill();

        // Plane glyph rotated to its track (falls back to bearing from receiver)
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((state.headingDeg ?? bearingDeg) * DEG);
        ctx.fillStyle = `rgba(140, 255, 205, ${alpha.toFixed(3)})`;
        ctx.shadowColor = PHOSPHOR;
        ctx.shadowBlur = selected ? 16 : 6 + 10 * glow;
        this.tracePlane(blipSize);
        ctx.fill();
        ctx.restore();

        // Selection brackets
        if (selected) {
          const s = blipSize + 7 + Math.sin(now / 300) * 1.5;
          ctx.strokeStyle = PHOSPHOR_BRIGHT;
          ctx.lineWidth = 1.6;
          ctx.setLineDash([5, 4]);
          ctx.lineDashOffset = -now / 40;
          ctx.beginPath();
          ctx.arc(x, y, s, 0, TAU);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Callsign labels stay on screen permanently (while the aircraft is in
      // range) rather than fading with the sweep afterglow.
      if (options.showLabels) {
        const onRightHalf = x >= cx;
        const offset = blipSize + 4;
        ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        ctx.textAlign = onRightHalf ? 'right' : 'left';
        ctx.fillStyle = selected ? '#d7ffeb' : 'rgba(160, 255, 210, 0.88)';
        ctx.shadowColor = PHOSPHOR;
        ctx.shadowBlur = selected ? 8 : 4;
        ctx.fillText(ac.callsign, x + (onRightHalf ? -offset : offset), y);
        ctx.shadowBlur = 0;
      }
    }
    ctx.restore();
  }

  /** Simple top-view plane silhouette, nose pointing up (north), centered on origin. */
  private tracePlane(size: number): void {
    const { ctx } = this;
    const s = size / 10;
    ctx.beginPath();
    ctx.moveTo(0, -9 * s);          // nose
    ctx.lineTo(1.6 * s, -4 * s);
    ctx.lineTo(7.5 * s, 2.5 * s);   // right main wing
    ctx.lineTo(7.5 * s, 4.5 * s);
    ctx.lineTo(1.9 * s, 3.2 * s);
    ctx.lineTo(1.4 * s, 6.5 * s);   // right tailplane
    ctx.lineTo(3.6 * s, 8.8 * s);
    ctx.lineTo(3.6 * s, 10 * s);
    ctx.lineTo(0, 9 * s);
    ctx.lineTo(-3.6 * s, 10 * s);
    ctx.lineTo(-3.6 * s, 8.8 * s);
    ctx.lineTo(-1.4 * s, 6.5 * s);  // left tailplane
    ctx.lineTo(-1.9 * s, 3.2 * s);
    ctx.lineTo(-7.5 * s, 4.5 * s);  // left main wing
    ctx.lineTo(-7.5 * s, 2.5 * s);
    ctx.lineTo(-1.6 * s, -4 * s);
    ctx.closePath();
  }

  /** Simple house silhouette for the radar centre (home location). */
  private traceHouse(size: number): void {
    const { ctx } = this;
    const s = size / 10;
    ctx.beginPath();
    ctx.moveTo(-9 * s, -1 * s);   // left eave
    ctx.lineTo(0, -9 * s);        // roof apex
    ctx.lineTo(9 * s, -1 * s);    // right eave
    ctx.lineTo(7 * s, -1 * s);    // body top right
    ctx.lineTo(7 * s, 9 * s);     // body bottom right
    ctx.lineTo(2.5 * s, 9 * s);   // door right
    ctx.lineTo(2.5 * s, 3 * s);   // door top right
    ctx.lineTo(-2.5 * s, 3 * s);  // door top left
    ctx.lineTo(-2.5 * s, 9 * s);  // door left
    ctx.lineTo(-7 * s, 9 * s);    // body bottom left
    ctx.lineTo(-7 * s, -1 * s);   // body top left
    ctx.closePath();
  }

  private drawHome(cx: number, cy: number): void {
    const { ctx } = this;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = PHOSPHOR_BRIGHT;
    ctx.lineWidth = 1.6;
    ctx.lineJoin = 'round';
    ctx.shadowColor = PHOSPHOR;
    ctx.shadowBlur = 8;
    this.traceHouse(8);
    ctx.stroke();
    ctx.restore();
  }
}
