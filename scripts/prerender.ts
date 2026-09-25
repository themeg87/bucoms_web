// vite build 결과(dist/index.html)를 틀로 삼아, 모든 페이지의 HTML을 미리 만든다.
// - 페이지마다 <div id="root"> 안에 앱 HTML, 검색 제목·설명·대표 주소·공유 미리보기 정보를 넣는다
// - 하위 페이지는 dist/<경로>/index.html 로 저장하고, sitemap.xml 도 새로 만든다
// 검색엔진(특히 네이버)이 자바스크립트를 실행하지 않아도 본문을 읽을 수 있게 하기 위함.
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const dist = path.resolve("dist");
const ssrEntry = path.resolve("dist-ssr/entry-server.js");
const { render, ALL_PATHS, SITE_URL, pageMeta, DESCRIPTION_MAX } = await import(pathToFileURL(ssrEntry).href);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf-8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error(`dist/index.html 에 ${marker} 가 없습니다.`);

const escapeAttr = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const setMeta = (html: string, pattern: RegExp, value: string) => {
  if (!pattern.test(html)) throw new Error(`틀에서 ${pattern} 를 찾지 못했습니다.`);
  return html.replace(pattern, (_m, before, _old, after) => `${before}${escapeAttr(value)}${after}`);
};

const today = new Date().toISOString().slice(0, 10);
for (const pagePath of ALL_PATHS as string[]) {
  const meta = pageMeta(pagePath);
  if ([...meta.description].length > DESCRIPTION_MAX) {
    throw new Error(`${pagePath} 설명이 ${[...meta.description].length}자입니다. ${DESCRIPTION_MAX}자 이내로 줄여 주세요: ${meta.description}`);
  }
  const url = SITE_URL + meta.path;
  let html = template.replace(marker, `<div id="root">${render(pagePath)}</div>`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(meta.title)}</title>`);
  html = setMeta(html, /(<meta name="description" content=")([^"]*)(")/, meta.description);
  html = setMeta(html, /(<link rel="canonical" href=")([^"]*)(")/, url);
  html = setMeta(html, /(<meta property="og:url" content=")([^"]*)(")/, url);
  html = setMeta(html, /(<meta property="og:title" content=")([^"]*)(")/, meta.title);
  html = setMeta(html, /(<meta property="og:description" content=")([^"]*)(")/, meta.description);
  if (meta.image) html = setMeta(html, /(<meta property="og:image" content=")([^"]*)(")/, SITE_URL + meta.image);

  if (meta.breadcrumbs.length > 1) {
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: meta.breadcrumbs.map((b: { name: string; path: string }, i: number) => ({
        "@type": "ListItem", position: i + 1, name: b.name, item: SITE_URL + b.path,
      })),
    };
    html = html.replace("</head>", `  <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>\n  </head>`);
  }

  const out = path.join(dist, pagePath, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${(ALL_PATHS as string[]).map(p => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod><priority>${p === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
fs.rmSync(path.resolve("dist-ssr"), { recursive: true, force: true });

console.log(`✓ prerendered ${ALL_PATHS.length} pages + sitemap.xml`);
