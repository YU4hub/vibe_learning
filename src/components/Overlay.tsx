import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CLAMP} from '../anim';
import {FONT, theme} from '../theme';
import {CHAPTERS, SUBTITLES} from '../timeline';

/** 底部安全区字幕：固定位置，淡入淡出 */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const current = SUBTITLES.find(([from, to]) => frame >= from && frame < to);
  if (!current) return null;
  const [from, to, text] = current;
  const isLast = to >= SUBTITLES[SUBTITLES.length - 1][1];
  const opacity = Math.min(
    interpolate(frame, [from, from + 6], [0, 1], CLAMP),
    isLast ? 1 : interpolate(frame, [to - 6, to], [1, 0], CLAMP),
  );
  const lift = interpolate(frame, [from, from + 8], [10, 0], CLAMP);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 64, // 底部安全区（≈6%）
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${lift}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1560,
          padding: '18px 44px',
          borderRadius: 24,
          background: 'rgba(46, 42, 38, 0.86)',
          color: '#FFFFFF',
          fontFamily: FONT,
          fontSize: 46,
          fontWeight: 600,
          letterSpacing: 1,
          lineHeight: 1.3,
          textAlign: 'center',
          boxShadow: '0 10px 24px rgba(46,42,38,0.18)',
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** 顶部章节进度条 */
export const ChapterBar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 18,
        fontFamily: FONT,
      }}
    >
      {CHAPTERS.map((c, i) => {
        const progress = interpolate(frame, [c.from, c.from + c.duration], [0, 1], CLAMP);
        const active = frame >= c.from && frame < c.from + c.duration;
        const done = frame >= c.from + c.duration;
        return (
          <div
            key={c.name}
            style={{
              position: 'relative',
              overflow: 'hidden',
              padding: '10px 26px',
              borderRadius: 999,
              fontSize: 26,
              fontWeight: 700,
              color: active ? '#FFFFFF' : done ? theme.accentDeep : theme.inkFaint,
              background: active ? theme.accent : done ? theme.accentSoft : 'rgba(255,255,255,0.7)',
              border: `2px solid ${active ? theme.accent : done ? theme.accentSoft : theme.panelLine}`,
            }}
          >
            {i + 1} · {c.name}
            {active && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  height: 5,
                  width: `${progress * 100}%`,
                  background: 'rgba(255,255,255,0.85)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
