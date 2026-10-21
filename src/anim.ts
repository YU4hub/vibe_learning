import {Easing, interpolate, spring} from 'remotion';

export const FPS = 30;

export const CLAMP = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

type PopConfig = {
  damping?: number;
  stiffness?: number;
  mass?: number;
  overshootClamping?: boolean;
};

/** 轻微回弹的 spring 入场 */
export const pop = (frame: number, delay = 0, config: PopConfig = {}) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps: FPS,
    config: {damping: 13, stiffness: 120, mass: 0.7, ...config},
  });

/** 无回弹的 spring（位移/透明度入场） */
export const smooth = (frame: number, delay = 0) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps: FPS,
    config: {damping: 200, stiffness: 120, mass: 1},
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const fadeIn = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], CLAMP);

export const fadeOut = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [1, 0], CLAMP);

export const easeInOut = Easing.inOut(Easing.cubic);

/** 苹果从 A 点落到 B 点：先轻微上提，再加速落下 */
export const fall = (
  frame: number,
  start: number,
  duration: number,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
) => {
  const t = interpolate(frame, [start, start + duration], [0, 1], CLAMP);
  const yEase = Easing.in(Easing.quad)(t);
  const xEase = Easing.inOut(Easing.quad)(Math.min(1, t * 1.15));
  return {
    t,
    x: lerp(fromX, toX, xEase),
    y: lerp(fromY, toY, yEase) - Math.sin(t * Math.PI) * 18,
  };
};
