import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT } from '../../../design';
import { Bloom } from './Bloom';
import { DepthField } from './DepthField';
import { LightStream } from './LightStream';
import { ServiceFacet } from './ServiceFacet';

// The cinematic "behind the scenes": your question becomes light in deep space,
// splits into parallel beams that search every signal, and reconverges into the
// answer. The REAL pipeline (bff-chat → agent → 4 parallel tool calls →
// interaction/pattern/product/knowledge services), shown as light, not a diagram.
const ACCENT = '#8b5cf6';
const ACCENT_LIGHT = '#c4b5fd';
const MONO = "'JetBrains Mono', monospace";

const ORB = { x: 720, y: 560 };
const ENTRY = { x: 150, y: 560 };
const FACETS = [
  { key: 'interactions', x: 1392, y: 286, depth: 1.0, bend: 70, label: 'Interactions', sub: 'web · CCTV · social', count: '1,284 found', tool: 'search_interactions' },
  { key: 'patterns', x: 1512, y: 470, depth: 0.82, bend: 34, label: 'Patterns', sub: 'behaviour', count: '37 found', tool: 'search_patterns' },
  { key: 'products', x: 1452, y: 664, depth: 0.92, bend: -34, label: 'Products', sub: 'catalog', count: '12 found', tool: 'search_products' },
  { key: 'knowledge', x: 1326, y: 836, depth: 0.74, bend: -86, label: 'Knowledge', sub: 'org context', count: '8 found', tool: 'search_org_context' },
];

const FAN_BASE = 52;
const FAN_DUR = 48;
const RET_BASE = 150;
const RET_DUR = 44;

function ramp(f: number, a: number, b: number): number {
  return interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}
function pulse(f: number, a: number, peak: number, b: number): number {
  return interpolate(f, [a, peak, b], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

const Caption: React.FC<{ x: number; y: number; label: string; sub?: string; opacity: number; align?: 'center' }> = ({ x, y, label, sub, opacity, align = 'center' }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', textAlign: align, opacity, pointerEvents: 'none' }}>
    <div style={{ fontFamily: FONT.family, fontSize: 17, fontWeight: 600, color: '#f5f5f7', letterSpacing: 0.3 }}>{label}</div>
    {sub && <div style={{ fontFamily: MONO, fontSize: 12.5, color: '#7c7c8a', marginTop: 3 }}>{sub}</div>}
  </div>
);

export const CinematicDataFlow: React.FC = () => {
  const f = useCurrentFrame();

  // query comet → agent
  const cometT = ramp(f, 0, 30);
  const cometX = ENTRY.x + (ORB.x - ENTRY.x) * (cometT * cometT * (3 - 2 * cometT));
  const orbActive = ramp(f, 24, 44);
  const orbReturn = ramp(f, RET_BASE + 10, RET_BASE + RET_DUR);
  const orbBright = Math.max(orbActive * 0.7, orbReturn);
  const orbScale = 1 + Math.sin(f * 0.16) * 0.04 * orbActive + orbReturn * 0.25;
  const bloomProg = ramp(f, RET_BASE + RET_DUR - 6, RET_BASE + RET_DUR + 34);

  const eyebrowOp = pulse(f, 6, 40, 220) * 0.9;
  const bffCap = pulse(f, 16, 30, 46);
  const agentCap = ramp(f, 44, 58) * (1 - ramp(f, RET_BASE, RET_BASE + 20));
  const toolsCap = pulse(f, 50, 70, 150);

  return (
    <AbsoluteFill>
      <DepthField />

      {/* faint context eyebrow */}
      <div style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center', opacity: eyebrowOp }}>
        <span style={{ fontFamily: FONT.family, fontSize: 18, fontWeight: 600, letterSpacing: 7, color: '#6f6f7e', textTransform: 'uppercase' }}>Behind the scenes</span>
      </div>

      {/* fan-out + return light streams */}
      {FACETS.map((s, i) => (
        <React.Fragment key={s.key}>
          <LightStream from={ORB} to={{ x: s.x, y: s.y }} bend={s.bend} start={FAN_BASE + i * 6} dur={FAN_DUR} frame={f} depth={s.depth} />
          {f >= RET_BASE && <LightStream from={ORB} to={{ x: s.x, y: s.y }} bend={s.bend} start={RET_BASE + i * 5} dur={RET_DUR} frame={f} depth={s.depth} color={ACCENT} reverse />}
        </React.Fragment>
      ))}

      {/* query comet */}
      {cometT < 1 && (
        <div style={{ position: 'absolute', left: cometX, top: ORB.y, width: 13, height: 13, marginLeft: -6, marginTop: -6, borderRadius: '50%', background: '#fff', boxShadow: `0 0 14px ${ACCENT_LIGHT}, 0 0 30px ${ACCENT_LIGHT}, 0 0 60px ${ACCENT}aa`, opacity: ramp(f, 0, 8) }} />
      )}

      {/* the agent orb */}
      <div style={{ position: 'absolute', left: ORB.x, top: ORB.y, width: 96, height: 96, marginLeft: -48, marginTop: -48, transform: `scale(${orbScale})`, borderRadius: '50%', background: `radial-gradient(circle, #ffffff ${8 + orbBright * 10}%, ${ACCENT_LIGHT} ${28 + orbBright * 8}%, ${ACCENT} 52%, transparent 72%)`, opacity: Math.max(orbActive, 0.0), boxShadow: `0 0 ${50 + orbBright * 70}px ${ACCENT}cc, 0 0 ${120 + orbBright * 120}px ${ACCENT}66` }} />

      {/* service facets */}
      {FACETS.map((s, i) => {
        const arrive = FAN_BASE + i * 6 + FAN_DUR - 6;
        const active = ramp(f, arrive, arrive + 20) * (1 - ramp(f, RET_BASE + 30, RET_BASE + 56) * 0.45);
        return <ServiceFacet key={s.key} x={s.x} y={s.y} depth={s.depth} label={s.label} sub={s.sub} count={s.count} active={active} />;
      })}

      {/* tool-call captions mid-stream */}
      {FACETS.map((s, i) => {
        const mx = (ORB.x + s.x) / 2 - (s.bend * (s.y < ORB.y ? 0.5 : -0.5)) * 0.3;
        const my = (ORB.y + s.y) / 2 - 18;
        const op = pulse(f, FAN_BASE + i * 6 + 6, FAN_BASE + i * 6 + 24, FAN_BASE + i * 6 + 50) * 0.7;
        return (
          <div key={s.key} style={{ position: 'absolute', left: mx, top: my, transform: 'translate(-50%, -50%)', opacity: op, pointerEvents: 'none' }}>
            <span style={{ fontFamily: MONO, fontSize: 12, color: '#7a7a88' }}>{s.tool}()</span>
          </div>
        );
      })}

      {/* orchestrator / agent captions near the orb */}
      <Caption x={ORB.x} y={ORB.y - 92} label="bff-chat" sub="orchestrator" opacity={bffCap} />
      <Caption x={ORB.x} y={ORB.y - 92} label="CROW Agent" sub="Llama 3.3 · reasoning" opacity={agentCap} />
      <div style={{ position: 'absolute', left: ORB.x, top: ORB.y + 86, transform: 'translate(-50%, -50%)', opacity: toolsCap, pointerEvents: 'none' }}>
        <span style={{ fontFamily: MONO, fontSize: 13, color: ACCENT_LIGHT, letterSpacing: 1 }}>4 parallel tool calls</span>
      </div>

      {/* reconvergence bloom → hands off to the answer */}
      <Bloom x={ORB.x} y={ORB.y} progress={bloomProg} size={1600} peak={0.95} />
    </AbsoluteFill>
  );
};
