import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, easeInOut, fadeOut, fall, pop, smooth} from '../anim';
import {Apple, At, Badge, Chip, Cup, Drawer, Hi, NestBack, NestBowl, Pigeon, Token} from '../components/primitives';
import {FONT, shadow, theme} from '../theme';

/**
 * 第 4 章 · 一句话总结（本地帧 0-900）
 * A1 0-148    苹果/鸽子 → 物体；抽屉/鸽巢 → 容器
 * A2 145-345  n 个容器 + n+1 个物体：逐个落入，最后一个凑成 2
 * B  345-565  图形公式：物体数 > 容器数 ⟹ 至少一个容器 ≥ 2
 * C  560-900  结论卡片定格（≈11 秒阅读时间）
 */

const Card: React.FC<{w: number; h: number; children: React.ReactNode; accent?: boolean}> = ({w, h, children, accent}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 36,
      background: theme.panel,
      border: `4px solid ${accent ? theme.accent : theme.panelLine}`,
      boxShadow: shadow.card,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 26,
      position: 'relative',
    }}
  >
    {children}
  </div>
);

const Box: React.FC<{w: number; h: number; children: React.ReactNode}> = ({w, h, children}) => (
  <div style={{position: 'relative', width: w, height: h}}>{children}</div>
);

const Arrow: React.FC<{w?: number; color?: string}> = ({w = 90, color = theme.inkFaint}) => (
  <svg width={w} height={40} viewBox="0 0 90 40">
    <path d="M6 20 H70" stroke={color} strokeWidth={8} strokeLinecap="round" />
    <path d="M60 6 L82 20 L60 34" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MiniNest: React.FC<{w: number; h: number}> = ({w, h}) => (
  <Box w={w} h={h + w * 0.2}>
    <NestBack x={0} y={w * 0.2} w={w} h={h} />
    <NestBowl x={0} y={w * 0.2} w={w} h={h} />
  </Box>
);

/* ---------- A1：换成任何东西 ---------- */
const PartA1: React.FC<{f: number}> = ({f}) => {
  const out = fadeOut(f, 128, 148);
  const s = (d: number) => pop(f, d);
  const item = (d: number): React.CSSProperties => ({transform: `scale(${s(d)})`, opacity: Math.min(1, s(d) * 2)});
  return (
    <AbsoluteFill style={{opacity: out}}>
      <At x={560} y={450} scale={s(8)} opacity={s(8)}>
        <Card w={680} h={400}>
          <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
            <div style={item(20)}>
              <Apple size={100} />
            </div>
            <div style={item(30)}>
              <Pigeon size={115} />
            </div>
            <div style={item(52)}>
              <Arrow />
            </div>
            <div style={item(64)}>
              <Token size={96} />
            </div>
          </div>
          <div style={item(76)}>
            <Chip tone="accent" size={40}>
              物体
            </Chip>
          </div>
        </Card>
      </At>
      <At x={1360} y={450} scale={s(22)} opacity={s(22)}>
        <Card w={680} h={400}>
          <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
            <div style={item(34)}>
              <Box w={120} h={104}>
                <Drawer x={0} y={0} w={120} h={104} />
              </Box>
            </div>
            <div style={item(44)}>
              <MiniNest w={104} h={96} />
            </div>
            <div style={item(66)}>
              <Arrow />
            </div>
            <div style={item(78)}>
              <Box w={110} h={96}>
                <Cup x={0} y={0} w={110} h={96} />
              </Box>
            </div>
          </div>
          <div style={item(90)}>
            <Chip tone="ink" size={40}>
              容器
            </Chip>
          </div>
        </Card>
      </At>
    </AbsoluteFill>
  );
};

/* ---------- A2：n 个容器，n+1 个物体 ---------- */
const C = {w: 170, h: 150, gap: 40, top: 500};
const cStart = 960 - (6 * C.w + 5 * C.gap) / 2;
const ccx = (j: number) => cStart + j * (C.w + C.gap) + C.w / 2;
const TS = 74;
const cRest = C.top + C.h - Math.max(8, Math.round(C.w * 0.08)) - TS / 2 - 2;
const TOFF = 40;
const TY = 310;
const tx = (i: number) => 960 + (i - 3) * 120;
const tStart = (i: number) => (i < 6 ? 190 + i * 13 : 290);
const T_DUR = 20;
const LAST_LAND = 290 + 22;

const PartA2: React.FC<{f: number}> = ({f}) => {
  if (f < 140 || f > 350) return null;
  const out = fadeOut(f, 325, 345);
  const topChip = pop(f, 165);
  const botChip = pop(f, 178);
  const shift = interpolate(f, [LAST_LAND - 12, LAST_LAND], [0, 1], {...CLAMP, easing: easeInOut});
  const hl = smooth(f, LAST_LAND + 1);
  const two = pop(f, LAST_LAND + 4, {damping: 9});

  return (
    <AbsoluteFill style={{opacity: out}}>
      <At x={960} y={205} scale={topChip} opacity={topChip}>
        <Chip>
          <Hi>n + 1</Hi> 个物体
        </Chip>
      </At>
      {[0, 1, 2, 3, 4, 5].map((j) => {
        const s = pop(f, 152 + j * 5);
        return (
          <Cup
            key={j}
            x={ccx(j) - C.w / 2}
            y={C.top}
            w={C.w}
            h={C.h}
            scale={0.6 + s * 0.4}
            opacity={Math.min(1, s * 1.5)}
            highlight={j === 3 ? hl : 0}
          />
        );
      })}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const enter = pop(f, 150 + i * 5);
        const target = i < 6 ? ccx(i) : ccx(3) + TOFF;
        const p = fall(f, tStart(i), i < 6 ? T_DUR : 22, tx(i), TY, target, cRest);
        const x = p.x - (i === 3 ? TOFF * shift : 0);
        return (
          <At key={i} x={x} y={p.y} scale={enter} opacity={Math.min(1, enter * 2)}>
            <Token size={TS} />
          </At>
        );
      })}
      <At x={ccx(3)} y={C.top - 56} scale={two} opacity={two}>
        <Badge value={2} hot size={70} />
      </At>
      <At x={960} y={760} scale={botChip} opacity={botChip}>
        <Chip>
          <Hi>n</Hi> 个容器
        </Chip>
      </At>
    </AbsoluteFill>
  );
};

/* ---------- B：图形公式 ---------- */
const PartB: React.FC<{f: number}> = ({f}) => {
  if (f < 340 || f > 570) return null;
  const out = fadeOut(f, 545, 565);
  const s = (d: number, damping = 13) => pop(f, d, {damping});
  return (
    <AbsoluteFill style={{opacity: out}}>
      <At x={360} y={470} scale={s(355)} opacity={s(355)}>
        <Card w={280} h={300}>
          <Box w={180} h={130}>
            {[
              [45, 85],
              [135, 85],
              [90, 30],
            ].map(([x, y], k) => (
              <At key={k} x={x} y={y}>
                <Token size={78} />
              </At>
            ))}
          </Box>
          <Chip size={30}>
            物体 <Hi>n+1</Hi>
          </Chip>
        </Card>
      </At>
      <At x={640} y={462} scale={s(380, 9)} opacity={s(380)}>
        <div style={{fontFamily: FONT, fontSize: 150, fontWeight: 900, color: theme.accent}}>&gt;</div>
      </At>
      <At x={900} y={470} scale={s(400)} opacity={s(400)}>
        <Card w={280} h={300}>
          <Box w={150} h={130}>
            <Cup x={10} y={10} w={130} h={115} />
          </Box>
          <Chip size={30}>
            容器 <Hi>n</Hi>
          </Chip>
        </Card>
      </At>
      <At x={1170} y={470} scale={s(435)} opacity={s(435)}>
        <Arrow w={130} color={theme.accent} />
      </At>
      <At x={1500} y={470} scale={s(465, 10)} opacity={s(465)}>
        <Card w={380} h={300} accent>
          <Box w={170} h={140}>
            <Cup x={10} y={10} w={150} h={125} highlight={smooth(f, 480)} />
            <At x={85 - 34} y={135 - 12 - 31}>
              <Token size={62} />
            </At>
            <At x={85 + 34} y={135 - 12 - 31}>
              <Token size={62} />
            </At>
          </Box>
          <Chip size={30} tone="accent">
            至少 1 个容器装 2 个
          </Chip>
        </Card>
      </At>
    </AbsoluteFill>
  );
};

/* ---------- C：结论卡片 ---------- */
const PartC: React.FC<{f: number}> = ({f}) => {
  if (f < 558) return null;
  const card = pop(f, 565, {damping: 16});
  const rise = (d: number): React.CSSProperties => {
    const k = pop(f, d, {damping: 200});
    return {opacity: k, transform: `translateY(${(1 - k) * 30}px)`};
  };
  const ex = (d: number): React.CSSProperties => {
    const k = pop(f, d);
    return {opacity: Math.min(1, k * 2), transform: `scale(${k})`, display: 'flex', alignItems: 'center', gap: 18};
  };
  const num: React.CSSProperties = {fontFamily: FONT, fontSize: 52, fontWeight: 900, color: theme.ink};

  return (
    <AbsoluteFill>
      <At x={960} y={472} scale={0.9 + card * 0.1} opacity={Math.min(1, card * 1.5)}>
        <div
          style={{
            width: 1360,
            height: 580,
            borderRadius: 48,
            background: theme.panel,
            border: `4px solid ${theme.panelLine}`,
            boxShadow: shadow.card,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT,
          }}
        >
          <div style={rise(585)}>
            <Chip tone="accent" size={34}>
              抽屉原理 · 鸽巢原理
            </Chip>
          </div>
          <div style={{height: 46}} />
          <div style={{...rise(605), fontSize: 80, fontWeight: 900, color: theme.ink, lineHeight: 1.25}}>
            只要物体比容器<Hi>多</Hi>，
          </div>
          <div style={{...rise(625), fontSize: 80, fontWeight: 900, color: theme.ink, lineHeight: 1.25}}>
            至少有一个容器要装下<Hi>两个</Hi>
          </div>
          <div style={{...rise(650), width: 980, height: 4, borderRadius: 2, background: theme.panelLine, margin: '44px 0 36px'}} />
          <div style={{display: 'flex', alignItems: 'center', gap: 120}}>
            <div style={ex(665)}>
              <Apple size={70} />
              <span style={num}>5</span>
              <Arrow w={70} />
              <Box w={80} h={70}>
                <Drawer x={0} y={0} w={80} h={70} />
              </Box>
              <span style={num}>4</span>
            </div>
            <div style={ex(685)}>
              <Pigeon size={84} />
              <span style={num}>6</span>
              <Arrow w={70} />
              <MiniNest w={72} h={66} />
              <span style={num}>5</span>
            </div>
          </div>
        </div>
      </At>
    </AbsoluteFill>
  );
};

export const SceneSummary: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {f < 150 && <PartA1 f={f} />}
      <PartA2 f={f} />
      <PartB f={f} />
      <PartC f={f} />
    </AbsoluteFill>
  );
};
