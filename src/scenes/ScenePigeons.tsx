import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, easeInOut, fadeOut, lerp, pop, smooth} from '../anim';
import {At, Badge, Chip, Drawer, Hi, NestBack, NestBowl, Pigeon} from '../components/primitives';
import {FONT, shadow, theme} from '../theme';

/**
 * 第 3 章 · 鸽巢原理（本地帧 0-600）
 * 0-130    名片：抽屉 = 鸽巢
 * 125-160  电线上站着 6 只鸽子，5 个鸽巢弹入
 * 165-277  前 5 只依次飞进 5 个巢（一巢一只）
 * 290-427  第 6 只巡视一圈，没有空巢，挤进 3 号巢 → 亮橙 + "2"
 * 450-600  对比：6 只 > 5 个
 */

const N = {w: 250, h: 240, gap: 30, top: 470};
const startX = 960 - (5 * N.w + 4 * N.gap) / 2;
const ncx = (j: number) => startX + j * (N.w + N.gap) + N.w / 2;
const INSET = Math.max(8, Math.round(N.w * 0.065));
const FLOOR = N.top + N.h - INSET;
const PS = 142; // 鸽子尺寸
const restY = (scale: number) => FLOOR - 52 - 56 * scale; // 站在草窝上沿，身子露在拱门外
const OFF = 66;
const TWO = 132 / 142; // 挤进同一个巢的两只并排

const WIRE_Y = 300;
const px = (i: number) => 380 + i * 125;
const perchY = WIRE_Y - 44;
const SCANY = 360;
const BADGE_Y = N.top + N.h + 55;

const FLY_DUR = 32;
const flyStart = (i: number) => 165 + i * 20;
const SIX_UP = 290;
const SCAN_T = [310, 325, 340, 355, 370];
const SIX_BACK = 390;
const SIX_DIVE = 400;
const SIX_LAND = 425;

const arc = (t: number, x0: number, y0: number, x2: number, y2: number) => {
  const cxp = (x0 + x2) / 2;
  const cyp = Math.min(y0, y2) - 140;
  const u = 1 - t;
  return {
    x: u * u * x0 + 2 * u * t * cxp + t * t * x2,
    y: u * u * y0 + 2 * u * t * cyp + t * t * y2,
  };
};

const sixPos = (f: number) => {
  if (f < SIX_UP) return {x: px(5), y: perchY};
  if (f < SIX_DIVE) {
    const x = interpolate(f, [SIX_UP, ...SCAN_T, SIX_BACK], [px(5), ...SCAN_T.map((_, j) => ncx(j)), ncx(2)], {
      ...CLAMP,
      easing: easeInOut,
    });
    const y =
      interpolate(f, [SIX_UP, SCAN_T[0]], [perchY, SCANY], {...CLAMP, easing: easeInOut}) +
      Math.sin((f - SIX_UP) / 5) * 8 * interpolate(f, [SCAN_T[0], SCAN_T[0] + 8], [0, 1], CLAMP);
    return {x, y};
  }
  const t = interpolate(f, [SIX_DIVE, SIX_LAND], [0, 1], {...CLAMP, easing: easeInOut});
  return {x: lerp(ncx(2), ncx(2) + OFF, t), y: lerp(SCANY, restY(TWO), t)};
};

const MiniNest: React.FC<{w: number; h: number}> = ({w, h}) => (
  <div style={{position: 'relative', width: w, height: h + w * 0.2}}>
    <NestBack x={0} y={w * 0.2} w={w} h={h} />
    <NestBowl x={0} y={w * 0.2} w={w} h={h} />
  </div>
);

export const ScenePigeons: React.FC = () => {
  const f = useCurrentFrame();

  // 名片
  const card = Math.min(1, fadeOut(f, 110, 130));
  const c1 = pop(f, 8);
  const c2 = pop(f, 26);
  const c3 = pop(f, 44);

  // 电线与鸽巢
  const wire = Math.min(pop(f, 122, {damping: 20}), fadeOut(f, 430, 450));
  const shift = interpolate(f, [SIX_LAND - 14, SIX_LAND], [0, 1], {...CLAMP, easing: easeInOut});
  const hl = smooth(f, SIX_LAND + 2);
  const cmp1 = pop(f, 455);
  const cmp2 = pop(f, 475, {damping: 9});
  const cmp3 = pop(f, 495);
  const nestChip = pop(f, 200);

  const flap = Math.sin(f * 0.9) * 38;

  const pigeons = [0, 1, 2, 3, 4].map((i) => {
    const enter = pop(f, 128 + i * 6);
    const s0 = flyStart(i);
    const t = interpolate(f, [s0, s0 + FLY_DUR], [0, 1], {...CLAMP, easing: easeInOut});
    const flying = t > 0 && t < 1;
    const sc = i === 2 ? lerp(1, TWO, shift) : 1;
    let {x, y} = arc(t, px(i), perchY, ncx(i), restY(1));
    if (t >= 1) {
      x = ncx(i) - (i === 2 ? OFF * shift : 0);
      y = restY(sc);
    }
    const flip = ncx(i) < px(i) && flying;
    return (
      <At key={i} x={x} y={y} scale={enter * sc} opacity={Math.min(1, enter * 2)}>
        <Pigeon size={PS} flap={flying ? flap : 0} flip={flip} feet={t === 0} />
      </At>
    );
  });

  const six = sixPos(f);
  const sixEnter = pop(f, 128 + 5 * 6);
  const sixFlying = f >= SIX_UP && f < SIX_LAND;
  const sixFlip = sixFlying && sixPos(f + 1).x < six.x - 0.5;
  const sixScale = f < SIX_DIVE ? 1 : lerp(1, TWO, interpolate(f, [SIX_DIVE, SIX_LAND], [0, 1], CLAMP));
  const sixRing = interpolate(f, [SIX_UP - 6, SIX_UP + 6, SIX_LAND - 6, SIX_LAND + 4], [0, 1, 1, 0], CLAMP);

  const count = (j: number) => {
    const first = f >= flyStart(j) + FLY_DUR ? 1 : 0;
    return first + (j === 2 && f >= SIX_LAND ? 1 : 0);
  };
  const lastChange = (j: number) => (j === 2 && f >= SIX_LAND ? SIX_LAND : flyStart(j) + FLY_DUR);
  const scanPulse = (j: number) => interpolate(f, [SCAN_T[j] - 7, SCAN_T[j], SCAN_T[j] + 10], [0, 1, 0], CLAMP);

  return (
    <AbsoluteFill>
      {/* 名片：抽屉 = 鸽巢 */}
      {f < 135 && (
        <AbsoluteFill style={{opacity: card}}>
          <At x={680} y={470} scale={c1} opacity={c1}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
              <div style={{position: 'relative', width: 220, height: 190}}>
                <Drawer x={0} y={0} w={220} h={190} />
              </div>
              <Chip size={40}>抽屉原理</Chip>
            </div>
          </At>
          <At x={960} y={420} scale={c2} opacity={c2}>
            <div style={{fontFamily: FONT, fontSize: 150, fontWeight: 900, color: theme.accent}}>=</div>
          </At>
          <At x={1240} y={455} scale={c3} opacity={c3}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
              <MiniNest w={210} h={190} />
              <Chip size={40} tone="accent">
                鸽巢原理
              </Chip>
            </div>
          </At>
        </AbsoluteFill>
      )}

      {/* 电线 */}
      <div style={{position: 'absolute', inset: 0, opacity: wire}}>
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: WIRE_Y - 4,
            width: 800,
            height: 9,
            borderRadius: 999,
            background: theme.woodDark,
            transform: `scaleX(${wire})`,
            transformOrigin: '0 50%',
          }}
        />
        {[300, 1100].map((x) => (
          <div
            key={x}
            style={{
              position: 'absolute',
              left: x - 11,
              top: WIRE_Y - 30,
              width: 22,
              height: 60,
              borderRadius: 11,
              background: theme.wood,
              boxShadow: shadow.soft,
            }}
          />
        ))}
        <At x={1340} y={WIRE_Y - 20} scale={wire}>
          <Chip>
            <Hi>6</Hi> 只鸽子
          </Chip>
        </At>
      </div>

      {/* 鸽巢（背板） */}
      {[0, 1, 2, 3, 4].map((j) => {
        const s = pop(f, 132 + j * 7);
        return (
          <NestBack
            key={j}
            x={ncx(j) - N.w / 2}
            y={N.top}
            w={N.w}
            h={N.h}
            scale={(0.6 + s * 0.4) * (1 + scanPulse(j) * 0.04)}
            opacity={Math.min(1, s * 1.5)}
            highlight={j === 2 ? hl : 0}
          />
        );
      })}

      {pigeons}

      {/* 第 6 只 */}
      <At x={six.x} y={six.y} opacity={sixRing}>
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: 999,
            border: `5px dashed ${theme.accent}`,
            transform: `rotate(${f * 2}deg)`,
          }}
        />
      </At>
      <At x={six.x} y={six.y} scale={sixEnter * sixScale} opacity={Math.min(1, sixEnter * 2)}>
        <Pigeon size={PS} flap={sixFlying ? flap : 0} flip={sixFlip} feet={f < SIX_UP} />
      </At>

      {/* 草窝（在鸽子前面） */}
      {[0, 1, 2, 3, 4].map((j) => {
        const s = pop(f, 132 + j * 7);
        return (
          <NestBowl
            key={j}
            x={ncx(j) - N.w / 2}
            y={N.top}
            w={N.w}
            h={N.h}
            scale={(0.6 + s * 0.4) * (1 + scanPulse(j) * 0.04)}
            opacity={Math.min(1, s * 1.5)}
          />
        );
      })}

      {/* 计数 */}
      {[0, 1, 2, 3, 4].map((j) => {
        const appear = pop(f, 140 + j * 6);
        const c = count(j);
        const bounce = c > 0 ? interpolate(pop(f, lastChange(j), {damping: 8}), [0, 1], [1.45, 1]) : 1;
        return (
          <At key={j} x={ncx(j)} y={BADGE_Y} scale={appear * bounce * (1 + scanPulse(j) * 0.25)} opacity={appear}>
            <Badge value={c} hot={c >= 2} ghost={c === 0} size={62} />
          </At>
        );
      })}
      <At x={960} y={BADGE_Y + 78} scale={nestChip} opacity={nestChip}>
        <Chip size={30}>
          <Hi>5</Hi> 个鸽巢
        </Chip>
      </At>

      {/* 对比：6 > 5 */}
      <At x={640} y={265} scale={cmp1} opacity={cmp1}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{fontFamily: FONT, fontSize: 110, fontWeight: 900, color: theme.ink}}>6</div>
          <Pigeon size={130} />
        </div>
      </At>
      <At x={960} y={258} scale={cmp2} opacity={cmp2}>
        <div style={{fontFamily: FONT, fontSize: 150, fontWeight: 900, color: theme.accent}}>&gt;</div>
      </At>
      <At x={1280} y={255} scale={cmp3} opacity={cmp3}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{fontFamily: FONT, fontSize: 110, fontWeight: 900, color: theme.ink}}>5</div>
          <MiniNest w={110} h={100} />
        </div>
      </At>
    </AbsoluteFill>
  );
};
