import React from 'react';

// A macOS-style pointer with a soft shadow, a press dip, and a violet click
// ripple. The arrow TIP is the hotspot — position (x, y) is the tip.
interface CursorProps {
  x: number;
  y: number;
  press?: number; // 0..1 click-press amount (dips + shrinks slightly)
  ripple?: number; // 0..1 click ripple progress (0 = none)
  opacity?: number;
}

export const Cursor: React.FC<CursorProps> = ({ x, y, press = 0, ripple = 0, opacity = 1 }) => {
  const scale = 1 - press * 0.14;
  return (
    <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', opacity }}>
      {ripple > 0.001 && ripple < 1 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 64,
            height: 64,
            marginLeft: -32,
            marginTop: -30,
            borderRadius: '50%',
            border: '2px solid #C4B5FD',
            opacity: (1 - ripple) * 0.7,
            transform: `scale(${0.25 + ripple * 1.2})`,
          }}
        />
      )}
      {/* arrow — tip at top-left, offset so the tip sits on (x,y) */}
      <div style={{ transform: `translate(-4px, -3px) scale(${scale})`, transformOrigin: '0 0' }}>
        <svg width={30} height={30} viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.55))' }}>
          <path
            d="M5 2.5 L5 19.5 L9.6 15.2 L12.7 21.6 L15.2 20.5 L12.1 14.2 L18.3 14.2 Z"
            fill="#ffffff"
            stroke="#1d1d1f"
            strokeWidth={1.1}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
