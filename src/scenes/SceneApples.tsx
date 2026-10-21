import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, easeInOut, fadeIn, fadeOut, fall, pop, smooth} from '../anim';
import {Apple, At, Badge, Chip, Drawer, drawerStrip, Hi, slot} from '../components/primitives';
import {FONT, shadow, theme} from '../theme';

/**
 * 第 2 章 · 苹果与抽屉（本地帧 0-900）
 * A 段 0-445   一个一个放：前 4 个各进一个抽屉；第 5 个巡视一圈后落入抽屉 3
 * B 段 430-680 换三种放法：三个小柜子，每个都至少有一个抽屉亮橙
 * C 段 680-900 必然性：每抽屉 1 个只能放 4 个，第 5 个无论去哪都会凑成 2
 */

/* ---------- 大柜子几何 ---------- */
const D = {w: 300, h: 260, gap: 44, top: 440};
const STRIP = drawerStrip(D.h);
const startX = 960 - (4 * D.w + 3 * D.gap) / 2;
const cx = (j: number) => startX + j * (D.w + D.gap) + D.w / 2;
const floorY = D.top + D.h - STRIP;
const AS = 110;
const restY = floorY - AS / 2 + 2;
const OFF = AS * 0.53;
const QY = 230;
const qx = (i: number) => 960 + (i - 2) * 140;
const HOVER = 325;
const BADGE_Y = D.top + D.h + 62;

const FALL_DUR = 26;
const START = [45, 81, 117, 153]; // 前 4 个苹果开始下落的帧
const LAND = START.map((s) => s + FALL_DUR);
const SCAN = [215, 245, 275, 305]; // 第 5 个苹果经过每个抽屉的帧
const FIFTH_DROP = 330;
const FIFTH_LAND = FIFTH_DROP + FALL_DUR;

const Cabinet: React.FC<{opacity: number; scale: number; highlight: number[]}> = ({opacity, scale, highlight}) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: startX - 32,
        top: D.top - 32,
        width: 4 * D.w + 3 * D.gap + 64,
        height: D.h + 64,
        borderRadius: 34,
        background: theme.woodDark,
        boxShadow: shadow.card,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '50% 100%',
      }}
    />
    {[0, 1, 2, 3].map((j) => (
      <Drawer
        key={j}
        x={cx(j) - D.w / 2}
        y={D.top}
        w={D.w}
        h={D.h}
        opacity={opacity}
        scale={scale}
        highlight={highlight[j] ?? 0}
      />
    ))}
  </>
);

/* ---------- A 段 ---------- */
const PartA: React.FC<{f: number}> = ({f}) => {
  const out = fadeOut(f, 420, 442);
  const cab = pop(f, 0, {damping: 16});
  const shift = interpolate(f, [FIFTH_LAND - 10, FIFTH_LAND + 4], [0, 1], {...CLAMP, easing: easeInOut});
  const hl2 = smooth(f, FIFTH_LAND + 2);
  const shelf = Math.min(pop(f, 0), fadeOut(f, 190, 215));
  const twoTag = pop(f, FIFTH_LAND + 10, {damping: 9});

  const pulse = (j: number) => interpolate(f, [SCAN[j] - 8, SCAN[j], SCAN[j] + 14], [0, 1, 0], CLAMP);

  const apples = [0, 1, 2, 3].map((i) => {
    const enter = pop(f, 5 + i * 6);
    let x = qx(i);
    let y = QY;
    let sx = 1;
    let sy = 1;
    if (f >= START[i]) {
      const p = fall(f, START[i], FALL_DUR, qx(i), QY, cx(i), restY);
      x = p.x;
      y = p.y;
      if (f >= LAND[i]) {
        const k = pop(f, LAND[i], {damping: 7, stiffness: 220});
        sy = interpolate(k, [0, 1], [0.78, 1]);
        sx = 2 - sy;
      }
    }
    if (i === 2) x -= OFF * shift;
    const pl = 1 + pulse(i) * 0.12;
    return (
      <At key={i} x={x} y={y + ((1 - sy) * AS) / 2} scale={enter * pl} scaleX={sx} scaleY={sy} opacity={Math.min(1, enter * 2)}>
        <Apple size={AS} />
      </At>
    );
  });

  // 第 5 个苹果：上提 → 巡视 4 个抽屉 → 回到抽屉 3 落下
  const enter5 = pop(f, 29);
  let x5: number;
  let y5: number;
  if (f < FIFTH_DROP) {
    x5 = interpolate(f, [190, ...SCAN, 325], [qx(4), cx(0), cx(1), cx(2), cx(3), cx(2)], {...CLAMP, easing: easeInOut});
    const bob = Math.sin((f - 212) / 6) * 7 * interpolate(f, [212, 222, 318, 328], [0, 1, 1, 0], CLAMP);
    y5 = interpolate(f, [190, 212], [QY, HOVER], {...CLAMP, easing: easeInOut}) + bob;
  } else {
    const p = fall(f, FIFTH_DROP, FALL_DUR, cx(2), HOVER, cx(2) + OFF, restY);
    x5 = p.x;
    y5 = p.y;
  }
  const ring5 = interpolate(f, [186, 200, 322, 332], [0, 1, 1, 0], CLAMP);

  const count = (j: number) => (f >= LAND[j] ? 1 : 0) + (j === 2 && f >= FIFTH_LAND ? 1 : 0);
  const lastChange = (j: number) => (j === 2 && f >= FIFTH_LAND ? FIFTH_LAND : LAND[j]);

  return (
    <AbsoluteFill style={{opacity: out}}>
      {/* 待放区托盘 */}
      <div
        style={{
          position: 'absolute',
          left: 960 - 380,
          top: QY + 60,
          width: 760,
          height: 18,
          borderRadius: 999,
          background: theme.panelLine,
          opacity: shelf,
        }}
      />
      <Cabinet opacity={Math.min(1, cab * 1.4)} scale={0.88 + cab * 0.12} highlight={[0, 0, hl2, 0]} />
      {apples}
      {/* 第 5 个苹果的亮橙虚线圈 */}
      <At x={x5} y={y5} opacity={ring5}>
        <div
          style={{
            width: AS + 44,
            height: AS + 44,
            borderRadius: 999,
            border: `5px dashed ${theme.accent}`,
            transform: `rotate(${f * 2}deg)`,
          }}
        />
      </At>
      <At x={x5} y={y5} scale={enter5} opacity={Math.min(1, enter5 * 2)}>
        <Apple size={AS} />
      </At>

      {/* 计数徽标 */}
      {[0, 1, 2, 3].map((j) => {
        const appear = pop(f, 14 + j * 5);
        const c = count(j);
        const bounce = c > 0 && f >= lastChange(j) ? interpolate(pop(f, lastChange(j), {damping: 8}), [0, 1], [1.45, 1]) : 1;
        return (
          <At key={j} x={cx(j)} y={BADGE_Y} scale={appear * bounce * (1 + pulse(j) * 0.25)} opacity={appear}>
            <Badge value={c} hot={c >= 2} ghost={c === 0} size={64} />
          </At>
        );
      })}

      <At x={cx(2)} y={D.top - 50} scale={twoTag} opacity={twoTag}>
        <Chip tone="accent" size={38}>
          2 个！
        </Chip>
      </At>
    </AbsoluteFill>
  );
};

/* ---------- B 段：三种放法 ---------- */
const P = {w: 520, h: 440, gap: 50, top: 290};
const pStart = 960 - (3 * P.w + 2 * P.gap) / 2;
const DISTS = [
  [2, 1, 1, 1],
  [3, 0, 2, 0],
  [0, 0, 5, 0],
];
const M = {w: 100, h: 170, gap: 14, top: 112};
const MSTRIP = drawerStrip(M.h);
const MAS = 40;
const mcx = (j: number) => (P.w - (4 * M.w + 3 * M.gap)) / 2 + j * (M.w + M.gap) + M.w / 2;
const mRestY = M.top + M.h - MSTRIP - MAS / 2 + 1;

const MiniPanel: React.FC<{f: number; p: number}> = ({f, p}) => {
  const pd = 440 + p * 60;
  const s = pop(f, pd, {damping: 14});
  const out = fadeOut(f, 660, 680);
  const dist = DISTS[p];
  const hlT = pd + 16 + 5 * 7 + 10;

  const items: Array<{j: number; k: number; total: number; start: number}> = [];
  let n = 0;
  dist.forEach((total, j) => {
    for (let k = 0; k < total; k++) {
      items.push({j, k, total, start: pd + 16 + n * 7});
      n++;
    }
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: pStart + p * (P.w + P.gap),
        top: P.top,
        width: P.w,
        height: P.h,
        borderRadius: 34,
        background: theme.panel,
        border: `3px solid ${theme.panelLine}`,
        boxShadow: shadow.card,
        opacity: Math.min(1, s * 1.5) * out,
        transform: `scale(${0.7 + s * 0.3})`,
      }}
    >
      <At x={P.w / 2} y={54}>
        <Chip size={30} tone="ink">
          放法 {p + 1}
        </Chip>
      </At>
      {dist.map((_, j) => (
        <Drawer
          key={j}
          x={mcx(j) - M.w / 2}
          y={M.top}
          w={M.w}
          h={M.h}
          highlight={dist[j] >= 2 ? smooth(f, hlT) : 0}
        />
      ))}
      {items.map(({j, k, total, start}, idx) => {
        const {dx, dy} = slot(k, total, MAS);
        const pt = fall(f, start, 14, mcx(j) + dx, 128, mcx(j) + dx, mRestY + dy);
        return (
          <At key={idx} x={pt.x} y={pt.y} opacity={fadeIn(f, start, start + 4)}>
            <Apple size={MAS} />
          </At>
        );
      })}
      {dist.map((total, j) => {
        const landed = items.filter((it) => it.j === j && f >= it.start + 14).length;
        const hot = total >= 2 && f >= hlT;
        const b = hot ? interpolate(pop(f, hlT, {damping: 8}), [0, 1], [1.4, 1]) : 1;
        return (
          <At key={j} x={mcx(j)} y={M.top + M.h + 52} scale={b}>
            <Badge value={landed} hot={hot} ghost={landed === 0} size={50} />
          </At>
        );
      })}
    </div>
  );
};

/* ---------- C 段：必然性 ---------- */
const PartC: React.FC<{f: number}> = ({f}) => {
  if (f < 676) return null;
  const cab = fadeIn(f, 680, 700);
  const cabS = pop(f, 680, {damping: 16});
  const fifth = pop(f, 730, {damping: 10});
  const plus = pop(f, 748);
  const stamp = pop(f, 830, {damping: 9});
  const FX = 960;
  const FY = 255;

  return (
    <AbsoluteFill>
      <Cabinet opacity={cab} scale={0.9 + cabS * 0.1} highlight={[0, 0, 0, 0]} />
      {[0, 1, 2, 3].map((j) => {
        const s = pop(f, 692 + j * 8);
        return (
          <At key={j} x={cx(j)} y={restY} scale={s} opacity={Math.min(1, s * 2)}>
            <Apple size={AS} />
          </At>
        );
      })}
      {[0, 1, 2, 3].map((j) => {
        const s = pop(f, 702 + j * 8);
        return (
          <At key={j} x={cx(j)} y={BADGE_Y} scale={s} opacity={s}>
            <Badge value={1} size={64} />
          </At>
        );
      })}

      {/* 第 5 个苹果指向每一个抽屉 */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {[0, 1, 2, 3].map((j) => {
          const p = interpolate(f, [760 + j * 7, 790 + j * 7], [0, 1], {...CLAMP, easing: easeInOut});
          const x1 = FX;
          const y1 = FY + 70;
          const x2 = cx(j);
          const y2 = D.top - 24;
          const mx = (x1 + x2) / 2;
          const my = y1 + 10;
          const ang = Math.atan2(y2 - my, x2 - mx);
          const ah = 18;
          return (
            <g key={j}>
              <path
                d={`M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                fill="none"
                stroke={theme.accent}
                strokeWidth={7}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
              />
              <path
                d={`M${x2} ${y2} L${x2 - ah * Math.cos(ang - 0.5)} ${y2 - ah * Math.sin(ang - 0.5)} L${x2 - ah * Math.cos(ang + 0.5)} ${y2 - ah * Math.sin(ang + 0.5)} Z`}
                fill={theme.accent}
                stroke={theme.accent}
                strokeWidth={4}
                strokeLinejoin="round"
                opacity={p > 0.92 ? 1 : 0}
              />
            </g>
          );
        })}
      </svg>

      <At x={FX} y={FY} opacity={fifth}>
        <div
          style={{
            width: AS + 50,
            height: AS + 50,
            borderRadius: 999,
            border: `5px dashed ${theme.accent}`,
            transform: `rotate(${f * 2}deg)`,
          }}
        />
      </At>
      <At x={FX} y={FY + Math.sin(f / 8) * 5} scale={fifth}>
        <Apple size={AS} />
      </At>
      <At x={FX + 130} y={FY - 40} scale={plus} opacity={plus}>
        <Chip tone="accent" size={36}>
          第 5 个
        </Chip>
      </At>

      {/* 无论去哪个抽屉，都会变成 2 */}
      {[0, 1, 2, 3].map((j) => {
        const s = pop(f, 800 + j * 8, {damping: 9});
        return (
          <At key={j} x={cx(j) + D.w / 2 - 18} y={D.top + 14} scale={s} opacity={s}>
            <Badge value={2} hot size={60} />
          </At>
        );
      })}

      <At x={1580} y={FY} scale={stamp} opacity={stamp} rotate={-8}>
        <div
          style={{
            padding: '14px 34px',
            borderRadius: 22,
            border: `6px solid ${theme.accent}`,
            color: theme.accent,
            background: '#FFFFFF',
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 56,
            letterSpacing: 6,
            boxShadow: shadow.float,
          }}
        >
          必然
        </div>
      </At>
      <At x={340} y={FY} scale={stamp} opacity={stamp}>
        <Chip size={34}>
          <Hi>5</Hi> &gt; <Hi>4</Hi>
        </Chip>
      </At>
    </AbsoluteFill>
  );
};

export const SceneApples: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {f < 450 && <PartA f={f} />}
      {f >= 430 && f < 685 && [0, 1, 2].map((p) => <MiniPanel key={p} f={f} p={p} />)}
      <PartC f={f} />
    </AbsoluteFill>
  );
};
