import React from 'react';
import {createRoot} from 'react-dom/client';
import {Player, PlayerRef} from '@remotion/player';
import {Video} from '../Video';
import {TOTAL_FRAMES} from '../timeline';

/** 独立 HTML 预览：用 @remotion/player 播放同一个 <Video /> 组合 */
const App: React.FC = () => {
  const ref = React.useRef<PlayerRef>(null);
  React.useEffect(() => {
    // 便于调试：在控制台用 __player.seekTo(帧号) 跳帧
    (window as unknown as {__player?: PlayerRef | null}).__player = ref.current;
  }, []);
  return (
    <Player
      ref={ref}
      component={Video}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      compositionWidth={1920}
      compositionHeight={1080}
      controls
      autoPlay
      loop
      clickToPlay
      doubleClickToFullscreen
      initiallyMuted
      style={{width: '100%', aspectRatio: '16 / 9', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.25)'}}
    />
  );
};

createRoot(document.getElementById('root')!).render(<App />);
