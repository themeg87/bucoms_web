// vite build 결과(dist/index.html)의 <div id="root"> 안에 앱 HTML을 미리 채워 넣는다.
// 검색엔진(특히 네이버)이 자바스크립트를 실행하지 않아도 본문을 읽을 수 있게 하기 위함.
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const dist = path.resolve("dist");
const ssrEntry = path.resolve("dist-ssr/entry-server.js");

const { render } = await import(pathToFileURL(ssrEntry).href);
const appHtml: string = render();

const indexPath = path.join(dist, "index.html");
const template = fs.readFileSync(indexPath, "utf-8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  throw new Error(`dist/index.html 에 ${marker} 가 없습니다.`);
}
fs.writeFileSync(indexPath, template.replace(marker, `<div id="root">${appHtml}</div>`));
fs.rmSync(path.resolve("dist-ssr"), { recursive: true, force: true });

console.log(`✓ prerendered dist/index.html (${Math.round(appHtml.length / 1024)} KB of HTML)`);
