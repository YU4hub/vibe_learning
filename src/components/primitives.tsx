import React, {CSSProperties} from 'react';
import {FONT, shadow, theme} from '../theme';

const dropShadow = 'drop-shadow(0 6px 6px rgba(74, 51, 36, 0.22))';

/** 以 (x, y) 为中心放置子元素 */
export const At: React.FC<{
  x: number;
  y: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  opacity?: number;
  z?: number;
  children: React.ReactNode;
}> = ({x, y, scale = 1, scaleX = 1, scaleY = 1, rotate = 0, opacity = 1, z, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale * scaleX}, ${scale * scaleY})`,
      opacity,
      zIndex: z,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </div>
);

/* ---------------- 苹果 ---------------- */
export const Apple: React.FC<{size?: number; style?: CSSProperties}> = ({size = 100, style}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{overflow: 'visible', filter: dropShadow, display: 'block', ...style}}
  >
    <path d="M50 26 Q 47 14 53 5" stroke={theme.stem} strokeWidth={6} strokeLinecap="round" fill="none" />
    <path d="M54 15 C 62 3, 78 5, 83 11 C 75 20, 61 21, 54 15 Z" fill={theme.leaf} />
    <path
      d="M50 29 C 34 17, 8 24, 8 52 C 8 78, 28 98, 42 96 C 46 95.5, 48 94, 50 94 C 52 94, 54 95.5, 58 96 C 72 98, 92 78, 92 52 C 92 24, 66 17, 50 29 Z"
      fill={theme.apple}
    />
    <ellipse cx="29" cy="50" rx="7" ry="13" fill={theme.appleLight} opacity={0.6} transform="rotate(20 29 50)" />
  </svg>
);

/* ---------------- 鸽子（侧面，默认朝右） ---------------- */
export const Pigeon: React.FC<{
  size?: number;
  flap?: number; // 翅膀角度
  flip?: boolean; // 朝左
  feet?: boolean;
}> = ({size = 120, flap = 0, flip = false, feet = true}) => (
  <svg
    width={size}
    height={(size * 100) / 120}
    viewBox="0 0 120 100"
    style={{overflow: 'visible', filter: dropShadow, display: 'block', transform: flip ? 'scaleX(-1)' : undefined}}
  >
    {feet && (
      <g stroke="#E39A45" strokeWidth={4} strokeLinecap="round">
        <line x1="50" y1="80" x2="47" y2="94" />
        <line x1="62" y1="80" x2="65" y2="94" />
      </g>
    )}
    <path d="M30 54 L3 44 Q 0 58 7 71 Z" fill={theme.pigeonDark} />
    <ellipse cx="56" cy="60" rx="36" ry="25" fill={theme.pigeon} />
    <path d="M72 52 Q 76 30 88 24 Q 102 22 103 36 Q 103 46 93 52 Q 86 64 72 66 Z" fill={theme.pigeon} />
    <circle cx="90" cy="34" r="13" fill={theme.pigeon} />
    <path d="M79 49 Q 87 52 95 46" stroke="#7FA393" strokeWidth={4} fill="none" strokeLinecap="round" />
    <circle cx="93" cy="31" r="4.2" fill="#FFFFFF" />
    <circle cx="94.2" cy="31" r="2.2" fill="#1E1E1E" />
    <path d="M102 32 L114 37 L102 41 Z" fill="#E39A45" />
    <g transform={`rotate(${-flap} 52 54)`}>
      <path d="M26 56 Q 46 26 80 50 Q 58 70 26 56 Z" fill={theme.pigeonLight} />
      <path d="M34 57 Q 52 49 72 54" stroke={theme.pigeonDark} strokeWidth={3} fill="none" opacity={0.55} />
    </g>
  </svg>
);

/* ---------------- 抽屉（拉开的抽屉，正面视角） ---------------- */
export const drawerStrip = (h: number) => Math.round(h * 0.26);

export const Drawer: React.FC<{
  x: number; // 左上角
  y: number;
  w: number;
  h: number;
  highlight?: number; // 0..1 亮橙描边
  scale?: number;
  opacity?: number;
}> = ({x, y, w, h, highlight = 0, scale = 1, opacity = 1}) => {
  const strip = drawerStrip(h);
  const inset = Math.max(8, Math.round(w * 0.05));
  const r = Math.max(10, Math.round(w * 0.075));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '50% 100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -Math.round(inset * 0.9),
          borderRadius: r + 8,
          border: `${Math.max(4, Math.round(w * 0.02))}px solid ${theme.accent}`,
          opacity: highlight,
          transform: `scale(${0.96 + highlight * 0.04})`,
        }}
      />
      <div style={{position: 'absolute', inset: 0, borderRadius: r, background: theme.wood, boxShadow: shadow.soft}} />
      <div
        style={{
          position: 'absolute',
          left: inset,
          right: inset,
          top: inset,
          bottom: strip,
          borderRadius: `${r * 0.6}px ${r * 0.6}px 0 0`,
          background: '#4E3523',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: strip,
          borderRadius: `0 0 ${r}px ${r}px`,
          background: theme.woodLight,
          borderTop: `${Math.max(3, Math.round(h * 0.015))}px solid ${theme.woodDark}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: w * 0.3,
            height: Math.max(6, strip * 0.2),
            borderRadius: 999,
            background: theme.cream,
            boxShadow: '0 2px 0 rgba(0,0,0,0.18)',
          }}
        />
      </div>
    </div>
  );
};

/** 抽屉里第 k 个物体（共 total 个）相对抽屉中心底部的偏移 */
export const slot = (k: number, total: number, size: number) => {
  if (total <= 1) return {dx: 0, dy: 0};
  const row = Math.floor(k / 2);
  const lastOdd = total % 2 === 1 && k === total - 1;
  const dx = lastOdd ? 0 : (k % 2 === 0 ? -1 : 1) * size * 0.53;
  return {dx, dy: -row * size * 0.88};
};

/* ---------------- 鸽巢（小木屋 + 拱形入口） ---------------- */
export const NestBack: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  highlight?: number;
  scale?: number;
  opacity?: number;
}> = ({x, y, w, h, highlight = 0, scale = 1, opacity = 1}) => {
  const inset = Math.max(8, Math.round(w * 0.065));
  const roofH = Math.round(w * 0.2);
  const sw = Math.max(6, Math.round(w * 0.05));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '50% 100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -Math.round(inset * 0.9),
          top: -roofH - inset,
          borderRadius: 26,
          border: `${Math.max(4, Math.round(w * 0.02))}px solid ${theme.accent}`,
          opacity: highlight,
        }}
      />
      <svg
        width={w + sw * 2}
        height={roofH + sw}
        style={{position: 'absolute', left: -sw, top: -roofH + 4, overflow: 'visible'}}
      >
        <path
          d={`M${sw} ${roofH} L${w / 2 + sw} ${sw / 2} L${w + sw} ${roofH} Z`}
          fill={theme.nestDark}
          stroke={theme.nestDark}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: Math.round(w * 0.07),
          background: theme.nest,
          boxShadow: shadow.soft,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: inset,
          right: inset,
          top: inset + h * 0.04,
          bottom: inset,
          borderRadius: `${w * 0.4}px ${w * 0.4}px ${w * 0.04}px ${w * 0.04}px`,
          background: '#F3E6CF',
        }}
      />
    </div>
  );
};

/** 鸽巢底部的草窝，画在鸽子前面 */
export const NestBowl: React.FC<{x: number; y: number; w: number; h: number; opacity?: number; scale?: number}> = ({
  x,
  y,
  w,
  h,
  opacity = 1,
  scale = 1,
}) => {
  const inset = Math.max(8, Math.round(w * 0.065));
  const bw = w - inset * 2;
  const bh = Math.round(w * 0.19);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '50% 100%',
        pointerEvents: 'none',
      }}
    >
      <svg width={bw} height={bh} viewBox={`0 0 ${bw} ${bh}`} style={{position: 'absolute', left: inset, bottom: inset}}>
        <path d={`M0 ${bh * 0.2} Q ${bw / 2} ${-bh * 0.15} ${bw} ${bh * 0.2} L ${bw} ${bh} L 0 ${bh} Z`} fill="#C9A066" />
        <g stroke="#9C7536" strokeWidth={Math.max(2, bw * 0.012)} strokeLinecap="round" opacity={0.8}>
          <line x1={bw * 0.1} y1={bh * 0.45} x2={bw * 0.32} y2={bh * 0.38} />
          <line x1={bw * 0.4} y1={bh * 0.55} x2={bw * 0.62} y2={bh * 0.42} />
          <line x1={bw * 0.66} y1={bh * 0.5} x2={bw * 0.9} y2={bh * 0.6} />
          <line x1={bw * 0.2} y1={bh * 0.78} x2={bw * 0.46} y2={bh * 0.72} />
          <line x1={bw * 0.55} y1={bh * 0.8} x2={bw * 0.8} y2={bh * 0.74} />
        </g>
      </svg>
    </div>
  );
};

/* ---------------- 通用物体 / 容器（总结章） ---------------- */
export const Token: React.FC<{size?: number}> = ({size = 80}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', filter: dropShadow, display: 'block'}}>
    <circle cx="50" cy="50" r="44" fill={theme.apple} />
    <ellipse cx="34" cy="34" rx="10" ry="14" fill={theme.appleLight} opacity={0.55} transform="rotate(35 34 34)" />
  </svg>
);

export const BLUE_GRAY = '#5B6B7C';

export const Cup: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  highlight?: number;
  scale?: number;
  opacity?: number;
}> = ({x, y, w, h, highlight = 0, scale = 1, opacity = 1}) => {
  const bw = Math.max(8, Math.round(w * 0.08));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '50% 100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -12,
          borderRadius: `16px 16px ${w * 0.26}px ${w * 0.26}px`,
          border: `6px solid ${theme.accent}`,
          opacity: highlight,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `${bw}px solid ${BLUE_GRAY}`,
          borderTop: 'none',
          borderRadius: `6px 6px ${w * 0.22}px ${w * 0.22}px`,
          background: 'rgba(91,107,124,0.10)',
          boxShadow: shadow.soft,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -bw * 0.6,
          right: -bw * 0.6,
          top: -bw * 0.5,
          height: bw,
          borderRadius: 999,
          background: '#6F8193',
        }}
      />
    </div>
  );
};

/* ---------------- 数字徽标 ---------------- */
export const Badge: React.FC<{value: React.ReactNode; hot?: boolean; size?: number; ghost?: boolean}> = ({
  value,
  hot = false,
  size = 60,
  ghost = false,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      background: hot ? theme.accent : ghost ? 'transparent' : '#FFFFFF',
      color: hot ? '#FFFFFF' : ghost ? theme.inkFaint : theme.ink,
      border: ghost ? `3px dashed ${theme.inkFaint}` : hot ? 'none' : `3px solid ${theme.panelLine}`,
      boxShadow: ghost ? 'none' : shadow.soft,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size * 0.52,
      boxSizing: 'border-box',
    }}
  >
    {value}
  </div>
);

/* ---------------- 小标签 ---------------- */
export const Chip: React.FC<{children: React.ReactNode; tone?: 'light' | 'accent' | 'ink'; size?: number}> = ({
  children,
  tone = 'light',
  size = 34,
}) => {
  const bg = tone === 'accent' ? theme.accent : tone === 'ink' ? theme.ink : '#FFFFFF';
  const fg = tone === 'light' ? theme.ink : '#FFFFFF';
  return (
    <div
      style={{
        padding: `${size * 0.32}px ${size * 0.8}px`,
        borderRadius: 999,
        background: bg,
        color: fg,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        boxShadow: shadow.soft,
        display: 'flex',
        alignItems: 'center',
        gap: size * 0.3,
      }}
    >
      {children}
    </div>
  );
};

/** 强调色文字 */
export const Hi: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{color: theme.accent}}>{children}</span>
);
