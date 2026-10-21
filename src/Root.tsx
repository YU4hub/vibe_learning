import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {TOTAL_FRAMES} from './timeline';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="DrawerPrinciple"
    component={Video}
    durationInFrames={TOTAL_FRAMES} // 90 秒
    fps={30}
    width={1920}
    height={1080}
  />
);
