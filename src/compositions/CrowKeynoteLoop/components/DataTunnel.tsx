import React from 'react';
import { AbsoluteFill, random } from 'remotion';

// A perspective tunnel of streaming data — numbers, letters, and real query
// fragments flying toward (dir=1, "into the backend") or away from (dir=-1,
// "back to the chat") a central vanishing point. Premium warp, not Matrix rain.
const CENTER = { x: 960, y: 540 };
const MAXR = 1280;
const WORDS = ['footfall', 'Tuesday', 'social', '2,300', 'spike', 'interactions', 'pattern', 'store', 'CCTV', 'web', 'agent', 'query', 'vector', '0.94', '1,284', 'GET', 'POST', 'search', 'llama', 'tool', '+22%', 'visit', 'queue', 'sentiment', '0x8b5c', 'org', 'context', '=>', '#37', 'session', 'reason', 'embed'];
const CHARS = '0123456789ABCDEFabcdef</>{}=+*';

interface Tok {
  angle: number;
  token: string;
  speed: number;
  phase: number;
  bright: boolean;
  size: number;
}

function buildField(seed: string, n: number): Tok[] {
  return Array.from({ length: n }, (_, i) => {
    const useWord = random(`${seed}w${i}`) > 0.42;
    const token = useWord
      ? WORDS[Math.floor(random(`${seed}t${i}`) * WORDS.length)]!
      : CHARS[Math.floor(random(`${seed}c${i}`) * CHARS.length)]!;
    return {
      angle: random(`${seed}a${i}`) * Math.PI * 2,
      token,
      speed: random(`${seed}s${i}`) * 0.010 + 0.0055,
      phase: random(`${seed}p${i}`),
      bright: random(`${seed}b${i}`) > 0.72,
      size: random(`${seed}z${i}`) * 12 + 15,
    };
  });
}

const cache = new Map<string, Tok[]>();
function field(seed: string, n: number): Tok[] {
  let f = cache.get(seed);
  if (!f) {
    f = buildField(seed, n);
    cache.set(seed, f);
  }
  return f;
}

function sstep(e0: number, e1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

export const DataTunnel: React.FC<{ frame: number; dir?: number; intensity: number; seed?: string }> = ({ frame, dir = 1, intensity, seed = 'tun' }) => {
  if (intensity <= 0.001) return null;
  const toks = field(seed, 80);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', backgroundColor: 'transparent' }}>
      {/* the destination portal glow at the vanishing point */}
      <div style={{ position: 'absolute', left: CENTER.x, top: CENTER.y, width: 560, height: 560, marginLeft: -280, marginTop: -280, borderRadius: '50%', background: `radial-gradient(circle, rgba(196,181,253,${0.24 * intensity}), rgba(139,92,246,${0.1 * intensity}) 42%, transparent 68%)`, filter: 'blur(10px)' }} />

      {/* perspective rings */}
      {Array.from({ length: 7 }, (_, i) => {
        const t = (((i / 7 + frame * 0.006 * dir) % 1) + 1) % 1;
        const r = (1 - t) * MAXR * 0.92;
        const op = sstep(0.02, 0.12, t) * (1 - sstep(0.82, 1, t)) * 0.12 * intensity;
        return <div key={`r${i}`} style={{ position: 'absolute', left: CENTER.x, top: CENTER.y, width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r, borderRadius: '50%', border: `1px solid rgba(196,181,253,${op})` }} />;
      })}

      {/* streaming tokens */}
      {toks.map((tk, i) => {
        const t = (((tk.phase + frame * tk.speed * dir) % 1) + 1) % 1;
        const r = (1 - t) * MAXR;
        const x = CENTER.x + Math.cos(tk.angle) * r;
        const y = CENTER.y + Math.sin(tk.angle) * r;
        const scale = 0.15 + (1 - t) * 1.5;
        const op = sstep(0.04, 0.14, t) * (1 - sstep(0.82, 0.98, t)) * intensity * (tk.bright ? 1 : 0.5);
        if (op <= 0.012) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: tk.size,
              fontWeight: tk.bright ? 600 : 400,
              color: tk.bright ? '#f5f5f7' : '#9b8fd6',
              opacity: op,
              textShadow: tk.bright ? '0 0 9px #c4b5fd' : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {tk.token}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
