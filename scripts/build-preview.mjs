// 把 Remotion 组合 + @remotion/player 打包成一个单文件 HTML，双击即可预览
import {build} from 'esbuild';
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = resolve(root, 'out/preview.html');

const result = await build({
  entryPoints: [resolve(root, 'src/preview/main.tsx')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2020',
  jsx: 'automatic',
  write: false,
  define: {'process.env.NODE_ENV': '"production"'},
  logLevel: 'warning',
});

const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\/script');
const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>抽屉原理（鸽巢原理）· 90 秒科普动画</title>
<style>
  html,body{margin:0;height:100%;background:#2E2A26;}
  body{display:flex;align-items:center;justify-content:center;font-family:"PingFang SC","Microsoft YaHei",sans-serif;}
  #wrap{width:min(96vw, calc(92vh * 16 / 9));}
  #hint{color:#A79C8D;font-size:14px;text-align:center;margin-top:12px;}
</style>
</head>
<body>
<div id="wrap"><div id="root"></div><div id="hint">1920×1080 · 30fps · 90 秒 · 空格键播放/暂停 · 双击全屏</div></div>
<script>${js}</script>
</body>
</html>`;

mkdirSync(dirname(outFile), {recursive: true});
writeFileSync(outFile, html);
console.log(`✔ 预览已生成：${outFile}（${(html.length / 1024).toFixed(0)} KB）`);
