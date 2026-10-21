# 抽屉原理（鸽巢原理）· 90 秒科普动画

一个完整可运行的 Remotion 工程：1920×1080 / 30fps / 2700 帧（90 秒），四章结构，中文字幕全程跟随。

## 快速开始

```bash
npm install
```

**方式一：直接在浏览器里看（最省事）**

```bash
npm run preview
```

脚本会先打包出单文件 HTML（`out/preview.html`），再起一个静态服务。打开 <http://localhost:4173> 即可播放；也可以直接双击 `out/preview.html`——它不依赖任何外部资源，离线可用。

**方式二：Remotion Studio（可逐帧调试、拖动时间轴）**

```bash
npm run studio
```

**方式三：渲染成视频文件**

```bash
npm run render
```

输出 `out/drawer-principle.mp4`。首次渲染会自动下载 Chrome Headless Shell（约 100MB，之后走缓存）。

导出单帧静帧：

```bash
npm run still
```

## 工程结构

```
src/
├─ index.ts                 # registerRoot 入口
├─ Root.tsx                 # Composition 注册：DrawerPrinciple, 1920×1080, 30fps, 2700 帧
├─ Video.tsx                # 总装：四个 <Sequence> + 场景转场 + 章节条 + 字幕
├─ timeline.ts              # 分镜表（章节起止帧）与字幕表（每条 ≥ 3 秒）
├─ theme.ts                 # 配色 / 字体 / 阴影，全部视觉变量集中在此
├─ anim.ts                  # spring / interpolate 工具：pop、smooth、fall、fadeIn/Out
├─ components/
│  ├─ primitives.tsx        # Apple、Pigeon、Drawer、NestBack/NestBowl、Cup、Badge、Chip…
│  └─ Overlay.tsx           # 底部安全区字幕、顶部章节进度条
├─ scenes/
│  ├─ SceneHook.tsx         # 第 1 章 开场钩子       0–10s
│  ├─ SceneApples.tsx       # 第 2 章 苹果与抽屉     10–40s
│  ├─ ScenePigeons.tsx      # 第 3 章 鸽巢原理       40–60s
│  └─ SceneSummary.tsx      # 第 4 章 一句话总结     60–90s
└─ preview/main.tsx         # @remotion/player 独立预览页
scripts/
├─ build-preview.mjs        # esbuild 打成单文件 out/preview.html
└─ serve-preview.mjs        # 本地静态服务（默认 4173 端口）
```

## 分镜节奏

所有动画由 `useCurrentFrame()` + `interpolate()` / `spring()` 驱动，帧号写在 `src/timeline.ts` 与各场景文件顶部的常量里。

| 章节 | 时间 | 画面动作 |
| --- | --- | --- |
| 1 开场钩子 | 0–10s | 5 个苹果逐个弹入并带编号 → 4 抽屉柜子弹入 → 第 2 个抽屉亮橙描边 +「≥2?」徽标 → 大问号弹出 |
| 2 苹果与抽屉 A | 10–25s | 苹果一个一个落下，前 4 个各进一个抽屉；第 5 个苹果上提到头顶、依次巡视 4 个抽屉（无空位，虚线绕圈），最后落进 3 号抽屉 → 该抽屉亮橙、计数变「2」、「2 个！」浮标 |
| 2 苹果与抽屉 B | 25–33s | 三块小面板并行演示三种放法（2-1-1-1 / 3-0-2-0 / 0-0-5-0），每种都自动高亮「≥2」的抽屉 |
| 2 苹果与抽屉 C | 33–40s | 每抽屉先放 1 个（「4 个抽屉最多装 4 个」），第 5 个苹果在上方悬停，四条箭头指向 4 个抽屉并弹出「2」——所以必须落进其中一个；盖「必然」印章 |
| 3 鸽巢原理 | 40–60s | 名片「抽屉 = 鸽巢」→ 电线上 6 只鸽子 → 前 5 只沿弧线飞进 5 个巢（一巢一只）→ 第 6 只找不到空巢，飞一圈后挤进 3 号巢，并排两只 + 亮橙 +「2」→ 对比「6 > 5」 |
| 4 一句话总结 A | 60–68s | 苹果/鸽子 → 圆点（物体）；抽屉/鸽巢 → 杯子（容器） |
| 4 一句话总结 B | 68–79s | 6 个杯子上方 7 个圆点逐个落入，第 7 个挤进 3 号杯 → 图形公式「n+1 个物体 > n 个容器 ⟹ 至少一个容器 ≥ 2」 |
| 4 一句话总结 C | 79–90s | 结论卡片定格：「只要物体比容器多，至少有一个容器要装下两个」+ 两行视觉等式；约 11 秒阅读时间 |

场景之间用淡入 12 帧 / 淡出 14 帧过渡；所有元素入场为 spring 弹入、退场为淡出；无粒子与炫光。

## 字幕

共 17 条，均写在 `src/timeline.ts` 的 `SUBTITLES` 里，格式为 `[起始帧, 结束帧, 文本]`。每条停留 ≥ 90 帧（3 秒），固定显示在画面底部 64px 的安全区，以半透明深色圆角条衬底。改字幕就改这张表，时间轴会跟着走。

## 修改建议

- **配色/圆角/阴影**：只动 `src/theme.ts`。
- **节拍**：改 `src/timeline.ts` 的 `SCENES`，并把同一数值反映到各场景文件顶部的帧常量（每个场景内的帧号都是「本地帧」，即从该章开始算）。
- **物体**：`primitives.tsx` 里的 `Apple` / `Pigeon` / `Drawer` / `NestBack` 都是无依赖的 SVG + div，可直接替换尺寸与颜色。
