import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { EASE, FONT } from '../../../design';

// The "behind the scenes" data-flow — the REAL CROW chat pipeline, lit and calm:
// question → bff-chat (orchestrator) → CROW Agent (LLM + tools) → 4 PARALLEL
// tool-calls → interaction / pattern / product / knowledge services → results
// return → the agent synthesises the answer. Travelling light pulses show flow.
// Driven by its own local frame (mount inside a <Sequence>).

const ACCENT = '#8b5cf6';
const ACCENT_LIGHT = '#c4b5fd';
const MONO = "'JetBrains Mono', monospace";

interface Node {
  x: number;
  y: number;
  label: string;
  sub?: string;
  count?: string;
}

const N: Record<string, Node> = {
  q: { x: 296, y: 540, label: 'Your question', sub: 'footfall · Tuesday' },
  bff: { x: 612, y: 540, label: 'bff-chat', sub: 'orchestrator' },
  agent: { x: 952, y: 540, label: 'CROW Agent', sub: 'Llama 3.3 · tools' },
  interactions: { x: 1392, y: 300, label: 'Interactions', sub: 'web · CCTV · social', count: '1,284' },
  patterns: { x: 1392, y: 460, label: 'Patterns', sub: 'behaviour', count: '37' },
  products: { x: 1392, y: 620, label: 'Products', sub: 'catalog', count: '12' },
  knowledge: { x: 1392, y: 780, label: 'Knowledge', sub: 'org context', count: '8' },
};
const SERVICES = ['interactions', 'patterns', 'products', 'knowledge'] as const;
const TOOL_NAMES: Record<string, string> = {
  interactions: 'search_interactions',
  patterns: 'search_patterns',
  products: 'search_products',
  knowledge: 'search_org_context',
};

// phase windows (local frames)
const P = {
  qToBff: [6, 26] as const,
  bffToAgent: [26, 48] as const,
  fanBase: 56, // + i*5 .. 96
  fanEnd: 98,
  retBase: 104, // + i*5 .. 142
  retEnd: 144,
  bloom: [144, 168] as const,
};

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

function rampAt(frame: number, a: number, b: number): number {
  return interpolate(frame, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

const Edge: React.FC<{ from: Node; to: Node; active: number }> = ({ from, to, active }) => (
  <line
    x1={from.x}
    y1={from.y}
    x2={to.x}
    y2={to.y}
    stroke={`rgba(196,181,253,${0.06 + active * 0.4})`}
    strokeWidth={1 + active * 0.6}
  />
);

const Pulse: React.FC<{ from: Node; to: Node; start: number; dur: number; frame: number; color?: string }> = ({ from, to, start, dur, frame, color = ACCENT_LIGHT }) => {
  if (frame < start || frame > start + dur) return null;
  const t = smooth(interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t;
  const fade = interpolate(t, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 10, height: 10, marginLeft: -5, marginTop: -5, borderRadius: '50%', background: '#fff', boxShadow: `0 0 10px ${color}, 0 0 22px ${color}, 0 0 36px ${color}88`, opacity: fade }} />
  );
};

const NodeChip: React.FC<{ node: Node; active: number; showCount?: boolean }> = ({ node, active, showCount }) => (
  <div style={{ position: 'absolute', left: node.x, top: node.y, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
    <div
      style={{
        padding: '11px 18px',
        minWidth: 124,
        borderRadius: 14,
        background: `rgba(255,255,255,${0.025 + active * 0.045})`,
        border: `1px solid rgba(255,255,255,${0.08 + active * 0.28})`,
        boxShadow: active > 0.02
          ? `0 0 ${34 * active}px ${ACCENT}55, inset 0 1px 0 rgba(255,255,255,0.06), 0 14px 36px -16px #000`
          : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 14px 36px -18px #000',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: active > 0.4 ? ACCENT_LIGHT : '#4b4b55', boxShadow: active > 0.4 ? `0 0 9px ${ACCENT_LIGHT}` : 'none' }} />
        <span style={{ color: '#f5f5f7', fontSize: 18, fontWeight: 600, fontFamily: FONT.family }}>{node.label}</span>
      </div>
      {node.sub && <div style={{ color: '#7c7c88', fontSize: 12, marginTop: 3, fontFamily: MONO }}>{node.sub}</div>}
      {showCount && node.count && (
        <div style={{ color: ACCENT_LIGHT, fontSize: 13, fontWeight: 700, marginTop: 5, fontFamily: FONT.family }}>{node.count} found</div>
      )}
    </div>
  </div>
);

export const ServiceGraph: React.FC = () => {
  const frame = useCurrentFrame();

  const bffActive = rampAt(frame, P.qToBff[1] - 4, P.qToBff[1] + 6);
  const agentActive = rampAt(frame, P.bffToAgent[1] - 4, P.bffToAgent[1] + 6);
  const bloom = rampAt(frame, P.bloom[0], P.bloom[1]);

  const eyebrowOp = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const toolLabelOp = interpolate(frame, [P.fanBase - 4, P.fanBase + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#050507' }}>
      {/* soft ambient key light from upper-left */}
      <AbsoluteFill style={{ background: `radial-gradient(60% 50% at 38% 28%, ${ACCENT}12, transparent 62%)` }} />

      {/* eyebrow */}
      <div style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center', opacity: eyebrowOp }}>
        <span style={{ fontFamily: FONT.family, fontSize: 19, fontWeight: 600, letterSpacing: 7, color: '#7c7c88', textTransform: 'uppercase' }}>Behind the scenes</span>
      </div>

      {/* edges + tool labels */}
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        <Edge from={N.q} to={N.bff} active={rampAt(frame, P.qToBff[0], P.qToBff[1])} />
        <Edge from={N.bff} to={N.agent} active={rampAt(frame, P.bffToAgent[0], P.bffToAgent[1])} />
        {SERVICES.map((s, i) => {
          const fanStart = P.fanBase + i * 5;
          const a = Math.max(rampAt(frame, fanStart, P.fanEnd), rampAt(frame, P.retBase + i * 5, P.retEnd));
          return <Edge key={s} from={N.agent} to={N[s]} active={a} />;
        })}
      </svg>

      {/* tool-call labels along the fan-out edges */}
      {SERVICES.map((s, i) => {
        const mx = (N.agent.x + N[s].x) / 2;
        const my = (N.agent.y + N[s].y) / 2 - 14;
        return (
          <div key={s} style={{ position: 'absolute', left: mx, top: my, transform: 'translate(-50%, -50%)', opacity: toolLabelOp * 0.8 }}>
            <span style={{ fontFamily: MONO, fontSize: 12, color: '#6f6f7c' }}>{TOOL_NAMES[s]}()</span>
          </div>
        );
      })}

      {/* travelling pulses */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <Pulse from={N.q} to={N.bff} start={P.qToBff[0]} dur={P.qToBff[1] - P.qToBff[0]} frame={frame} />
        <Pulse from={N.bff} to={N.agent} start={P.bffToAgent[0]} dur={P.bffToAgent[1] - P.bffToAgent[0]} frame={frame} />
        {SERVICES.map((s, i) => (
          <React.Fragment key={s}>
            <Pulse from={N.agent} to={N[s]} start={P.fanBase + i * 5} dur={P.fanEnd - (P.fanBase + i * 5)} frame={frame} />
            <Pulse from={N[s]} to={N.agent} start={P.retBase + i * 5} dur={P.retEnd - (P.retBase + i * 5)} frame={frame} color={ACCENT} />
          </React.Fragment>
        ))}
      </AbsoluteFill>

      {/* nodes */}
      <NodeChip node={N.q} active={1} />
      <NodeChip node={N.bff} active={bffActive} />
      <NodeChip node={N.agent} active={Math.max(agentActive, bloom)} />
      {SERVICES.map((s, i) => {
        const act = Math.max(rampAt(frame, P.fanEnd - 8 + i * 2, P.fanEnd + 6), rampAt(frame, P.retBase, P.retBase + 8));
        const showCount = frame > P.fanEnd - 6;
        return <NodeChip key={s} node={N[s]} active={act} showCount={showCount} />;
      })}

      {/* the answer forms at the agent */}
      {bloom > 0.01 && (
        <div style={{ position: 'absolute', left: N.agent.x, top: N.agent.y + 92, transform: 'translate(-50%, -50%)', opacity: bloom, textAlign: 'center' }}>
          <div style={{ fontFamily: FONT.family, fontSize: 15, color: ACCENT_LIGHT, fontWeight: 700, letterSpacing: 1 }}>answer synthesised</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
