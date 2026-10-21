import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {fadeIn, fadeOut} from './anim';
import {ChapterBar, Subtitles} from './components/Overlay';
import {SceneApples} from './scenes/SceneApples';
import {SceneHook} from './scenes/SceneHook';
import {ScenePigeons} from './scenes/ScenePigeons';
import {SceneSummary} from './scenes/SceneSummary';
import {FONT, theme} from './theme';
import {SCENES} from './timeline';

/** 场景间转场：入场淡入 12 帧，退场淡出 14 帧 */
const SceneFade: React.FC<{duration: number; noIn?: boolean; noOut?: boolean; children: React.ReactNode}> = ({
  duration,
  noIn,
  noOut,
  children,
}) => {
  const f = useCurrentFrame();
  const opacity = (noIn ? 1 : fadeIn(f, 0, 12)) * (noOut ? 1 : fadeOut(f, duration - 14, duration));
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{background: theme.bg, fontFamily: FONT, overflow: 'hidden'}}>
    <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.duration} name="1 开场钩子">
      <SceneFade duration={SCENES.hook.duration} noIn>
        <SceneHook />
      </SceneFade>
    </Sequence>
    <Sequence from={SCENES.apples.from} durationInFrames={SCENES.apples.duration} name="2 苹果与抽屉">
      <SceneFade duration={SCENES.apples.duration}>
        <SceneApples />
      </SceneFade>
    </Sequence>
    <Sequence from={SCENES.pigeons.from} durationInFrames={SCENES.pigeons.duration} name="3 鸽巢原理">
      <SceneFade duration={SCENES.pigeons.duration}>
        <ScenePigeons />
      </SceneFade>
    </Sequence>
    <Sequence from={SCENES.summary.from} durationInFrames={SCENES.summary.duration} name="4 一句话总结">
      <SceneFade duration={SCENES.summary.duration} noOut>
        <SceneSummary />
      </SceneFade>
    </Sequence>

    <ChapterBar />
    <Subtitles />
  </AbsoluteFill>
);
