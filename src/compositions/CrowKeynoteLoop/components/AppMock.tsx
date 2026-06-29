import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { FONT } from '../../../design';

// A faithful, premium mock of the real CROW dashboard "Ask CROW" screen
// (near-black #030005 + violet, Sora, 280px sidebar, glass input). The demo
// drives `typed` / `caret` / `sendActive` and, after the answer, `mode='answer'`.
const APP = {
  bg: '#030005',
  panel: 'rgba(255,255,255,0.022)',
  surface: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.08)',
  borderSoft: 'rgba(255,255,255,0.05)',
  text: '#f5f5f7',
  textDim: '#9CA3AF',
  textFaint: '#6b7280',
  accent: '#8B5CF6',
  accentLight: '#C4B5FD',
} as const;

const NAV: { label: string; icon: string; active?: boolean }[] = [
  { label: 'Overview', icon: 'grid' },
  { label: 'Ask CROW', icon: 'chat', active: true },
  { label: 'Interactions', icon: 'pulse' },
  { label: 'Patterns', icon: 'spark' },
  { label: 'Analytics', icon: 'bars' },
  { label: 'Products', icon: 'bag' },
  { label: 'Integrations', icon: 'plug' },
];

const NavIcon: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  const p = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg width={19} height={19} viewBox="0 0 24 24">
      {name === 'grid' && <g {...p}><rect x="3" y="3" width="7" height="7" rx="1.6" /><rect x="14" y="3" width="7" height="7" rx="1.6" /><rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="14" width="7" height="7" rx="1.6" /></g>}
      {name === 'chat' && <path {...p} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
      {name === 'pulse' && <path {...p} d="M3 12h4l3 8 4-16 3 8h4" />}
      {name === 'spark' && <path {...p} d="M12 3v3M12 18v3M3 12h3M18 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M17.7 6.3l-2.1 2.1M8.4 15.6l-2.1 2.1" />}
      {name === 'bars' && <path {...p} d="M4 20V11M10 20V4M16 20v-9M22 20V7" />}
      {name === 'bag' && <g {...p}><path d="M6 8h12l1 12H5z" /><path d="M9 8a3 3 0 0 1 6 0" /></g>}
      {name === 'plug' && <g {...p}><path d="M9 7V3M15 7V3" /><path d="M7 7h10v4a5 5 0 0 1-10 0z" /><path d="M12 16v5" /></g>}
    </svg>
  );
};

interface AppMockProps {
  typed?: string;
  caret?: boolean;
  sendActive?: boolean;
  mode?: 'landing' | 'answer';
  answerReveal?: number; // 0..1 fade-in of the answer content
}

export const AppMock: React.FC<AppMockProps> = ({ typed = '', caret = false, sendActive = false, mode = 'landing', answerReveal = 1 }) => {
  const hasText = typed.length > 0;
  const isAnswer = mode === 'answer';
  return (
    <AbsoluteFill style={{ backgroundColor: APP.bg, fontFamily: FONT.family }}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 0%, ${APP.accent}14, transparent 60%)` }} />

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 280, background: APP.panel, borderRight: `1px solid ${APP.borderSoft}`, display: 'flex', flexDirection: 'column', padding: '26px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '4px 10px 22px' }}>
          <Img src={staticFile('logo.png')} style={{ width: 26, height: 26, objectFit: 'contain' }} />
          <span style={{ color: APP.text, fontSize: 19, fontWeight: 700, letterSpacing: 1 }}>CROW</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 12px', borderRadius: 11, background: item.active ? `${APP.accent}1f` : 'transparent', border: item.active ? `1px solid ${APP.accent}33` : '1px solid transparent' }}>
              <NavIcon name={item.icon} color={item.active ? APP.accentLight : APP.textFaint} />
              <span style={{ color: item.active ? APP.text : APP.textDim, fontSize: 15, fontWeight: item.active ? 600 : 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 11, padding: '12px 10px', borderTop: `1px solid ${APP.borderSoft}` }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${APP.accent}, #5b3bb0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>B3</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: APP.text, fontSize: 13, fontWeight: 600 }}>B3 Retail</span>
            <span style={{ color: APP.textFaint, fontSize: 11 }}>team@crowai.dev</span>
          </div>
        </div>
      </div>

      {/* ── Header ────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', left: 280, right: 0, top: 0, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 34px' }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${APP.border}`, background: APP.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', color: APP.textDim, fontSize: 12, fontWeight: 700 }}>RA</div>
      </div>

      {/* ── Main ──────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', left: 280, right: 0, top: 64, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {!isAnswer && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 15px', borderRadius: 999, border: `1px solid ${APP.accent}33`, background: `${APP.accent}12`, marginBottom: 30 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: APP.accentLight, boxShadow: `0 0 10px ${APP.accentLight}` }} />
              <span style={{ color: APP.accentLight, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>System Active</span>
            </div>
            <div style={{ fontSize: 58, fontWeight: 700, letterSpacing: -1.5, color: APP.text, marginBottom: 14 }}>
              CROW
              {' '}
              <span style={{ background: 'linear-gradient(120deg, #6a3df0, #b98bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ENGINE</span>
            </div>
            <div style={{ fontSize: 18, color: APP.textDim, marginBottom: 46, fontWeight: 400 }}>
              Ask anything about your customers, products, and behaviour.
            </div>
          </>
        )}

        {isAnswer && (
          <div style={{ width: 980, maxWidth: '78%', marginBottom: 34, opacity: answerReveal }}>
            {/* user question */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
              <div style={{ background: APP.surface, border: `1px solid ${APP.border}`, borderRadius: 16, padding: '12px 20px', color: APP.text, fontSize: 18 }}>
                Why did footfall spike on Tuesday?
              </div>
            </div>
            {/* assistant answer */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${APP.border}`, borderRadius: 18, padding: '20px 24px', maxWidth: 720 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                <Img src={staticFile('logo.png')} style={{ width: 20, height: 20, objectFit: 'contain' }} />
                <span style={{ color: APP.accentLight, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>CROW</span>
              </div>
              <div style={{ color: APP.text, fontSize: 22, fontWeight: 500, lineHeight: 1.5 }}>
                A social mention drove
                {' '}
                <span style={{ color: APP.accentLight, fontWeight: 700 }}>2,300</span>
                {' '}
                store visits on Tuesday.
              </div>
              <div style={{ marginTop: 14, color: APP.textFaint, fontSize: 13 }}>
                Sources: Interactions
                {' '}
                <sup style={{ color: APP.accent }}>[1]</sup>
                {' '}· Patterns
                {' '}
                <sup style={{ color: APP.accent }}>[2]</sup>
              </div>
            </div>
          </div>
        )}

        {/* input bar — the demo's focal element (kept in both modes) */}
        <div
          data-crow-input
          style={{
            width: 980,
            maxWidth: '78%',
            height: 70,
            borderRadius: 18,
            background: 'rgba(255,255,255,0.045)',
            border: `1px solid ${sendActive ? `${APP.accent}66` : APP.border}`,
            boxShadow: sendActive ? `0 0 0 4px ${APP.accent}1a, 0 18px 50px -24px rgba(0,0,0,0.7)` : '0 18px 50px -28px rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px 0 22px',
            gap: 14,
          }}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={APP.textFaint} strokeWidth={1.7} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          <div style={{ flex: 1, fontSize: 21, color: hasText ? APP.text : APP.textFaint, fontStyle: hasText ? 'normal' : 'italic', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {hasText ? typed : isAnswer ? 'Continue the conversation…' : 'Ask CROW anything…'}
            {caret && <span style={{ display: 'inline-block', width: 2, height: 24, background: APP.accentLight, marginLeft: 2, transform: 'translateY(4px)' }} />}
          </div>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: hasText || sendActive ? APP.accent : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: sendActive ? `0 0 22px ${APP.accent}aa` : 'none' }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={hasText || sendActive ? '#fff' : APP.textFaint} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </div>
        </div>

        {!isAnswer && (
          <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
            {['Why did footfall spike on Tuesday?', 'Top products this week', 'Compare store performance'].map((s, i) => (
              <div key={s} style={{ padding: '10px 18px', borderRadius: 999, border: `1px solid ${APP.borderSoft}`, background: APP.panel, color: i === 0 ? APP.accentLight : APP.textDim, fontSize: 14 }}>{s}</div>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
