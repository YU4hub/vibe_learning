// 极简静态服务器：http://localhost:4173
import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const file = resolve(dirname(fileURLToPath(import.meta.url)), '../out/preview.html');
const port = Number(process.env.PORT || 4173);
createServer((_, res) => {
  res.writeHead(200, {'content-type': 'text/html; charset=utf-8'});
  res.end(readFileSync(file));
}).listen(port, () => console.log(`▶ 预览地址：http://localhost:${port}`));
