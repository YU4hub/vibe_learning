import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, pop, smooth} from '../anim';
import {Apple, At, Badge, Chip, Drawer, Hi} from '../components/primitives';
import {FONT, shadow, theme} from '../theme';

/**
 * 第 1 章 · 开场钩子（本地帧 0-300）
 * 0-60    5 个苹果逐个弹入，计数
 * 50-110  4 个抽屉的柜子弹入
 * 140-200 第 2 个抽屉亮橙描边 + "≥2?" 徽标
 * 205-300 大问号气泡弹出，苹果轻跳
 */
const D = {w: 230, h: 200, gap: 36, top: 520};
const startX = 960 - (4 * D.w + 3 * D.gap) / 2;
const cx = (j: number) => startX + j * (D.w + D.gap) + D.w / 2;

export const SceneHook: React.FC = () => {
  const f = useCurrentFrame();

  const appleChip = pop(f, 62);
  const cabinet = pop(f, 50, {damping: 15});
  const drawerChip = pop(f, 110);
  const hl = smooth(f, 140);
  const qBadge = pop(f, 150, {damping: 9});
  const bubble = pop(f, 210, {damping: 9});
  const hop = f >= 215 ? Math.abs(Math.sin(((f - 215) / 30) * Math.PI)) * interpolate(f, [215, 290], [1, 0], CLAMP) : 0;

  return (
    <AbsoluteFill>
      {/* 5 个苹果 */}
      {Array.from({length: 5}).map((_, i) => {
        const s = pop(f, 12 + i * 9);
        const num = pop(f, 20 + i * 9);
        const x = 960 + (i - 2) * 150;
        return (
          <React.Fragment key={i}>
            <At x={x} y={270 - hop * 26 * (i % 2 === 0 ? 1 : 0.7)} scale={s} opacity={Math.min(1, s * 2)}>
              <Apple size={120} />
            </At>
            <At x={x + 44} y={225} scale={num} opacity={num}>
              <Badge value={i + 1} size={42} />
            </At>
          </React.Fragment>
        );
      })}
      <At x={960} y={385} scale={appleChip} opacity={appleChip}>
        <Chip>
          <Hi>5</Hi> 个苹果
        </Chip>
      </At>

      {/* 柜子 */}
      <div
        style={{
          position: 'absolute',
          left: startX - 30,
          top: D.top - 30,
          width: 4 * D.w + 3 * D.gap + 60,
          height: D.h + 60,
          borderRadius: 30,
          background: theme.woodDark,
          boxShadow: shadow.card,
          opacity: cabinet,
          transform: `scale(${0.85 + cabinet * 0.15})`,
          transformOrigin: '50% 100%',
        }}
      />
      {Array.from({length: 4}).map((_, j) => {
        const s = pop(f, 60 + j * 7);
        return (
          <Drawer
            key={j}
            x={cx(j) - D.w / 2}
            y={D.top}
            w={D.w}
            h={D.h}
            scale={0.6 + s * 0.4}
            opacity={Math.min(1, s * 1.5)}
            highlight={j === 1 ? hl : 0}
          />
        );
      })}
      <At x={960} y={830} scale={drawerChip} opacity={drawerChip}>
        <Chip>
          <Hi>4</Hi> 个抽屉
        </Chip>
      </At>

      {/* ≥2 ? 徽标 */}
      <At x={cx(1)} y={D.top - 8} scale={qBadge} opacity={qBadge} rotate={(1 - qBadge) * -20}>
        <div
          style={{
            padding: '10px 24px',
            borderRadius: 999,
            background: theme.accent,
            color: '#fff',
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 40,
            boxShadow: shadow.float,
          }}
        >
          ≥ 2 ?
        </div>
      </At>

      {/* 大问号 */}
      <At x={1660} y={560} scale={bubble} opacity={bubble} rotate={Math.sin(f / 9) * 4 * bubble}>
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: 999,
            background: '#FFFFFF',
            border: `8px solid ${theme.accent}`,
            boxShadow: shadow.card,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT,
            fontSize: 130,
            fontWeight: 900,
            color: theme.accent,
          }}
        >
          ?
        </div>
      </At>
    </AbsoluteFill>
  );
};
