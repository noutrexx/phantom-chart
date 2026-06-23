// Lightweight sound + haptic feedback. Zero assets - synthesized via Web Audio.
// Respects a persisted mute flag and prefers-reduced-motion.

const MUTE_KEY = "pc.muted";

let ctx: AudioContext | null = null;
let muted = readMuted();

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(v: boolean): void {
  muted = v;
  try {
    localStorage.setItem(MUTE_KEY, v ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function reducedMotion(): boolean {
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ensureCtx(): AudioContext | null {
  if (muted) return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function blip(freq: number, dur: number, type: OscillatorType = "sine", gain = 0.05, delay = 0): void {
  const ac = ensureCtx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export function vibrate(pattern: number | number[]): void {
  if (muted || reducedMotion()) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}

// --- Semantic events ---
export const feedback = {
  tap() {
    blip(420, 0.05, "triangle", 0.03);
    vibrate(6);
  },
  add() {
    blip(540, 0.06, "triangle", 0.045);
    blip(720, 0.07, "triangle", 0.04, 0.05);
    vibrate(10);
  },
  success() {
    blip(523, 0.1, "sine", 0.05);
    blip(659, 0.1, "sine", 0.05, 0.09);
    blip(784, 0.16, "sine", 0.05, 0.18);
    vibrate([12, 30, 18]);
  },
  arrive() {
    blip(880, 0.18, "sine", 0.045);
    blip(1175, 0.3, "sine", 0.04, 0.12);
    vibrate([10, 40, 10, 40, 25]);
  },
  surprise() {
    blip(660, 0.08, "square", 0.035);
    blip(990, 0.08, "square", 0.035, 0.07);
    blip(1320, 0.14, "square", 0.03, 0.14);
    vibrate([8, 20, 8, 20, 8]);
  },
};
