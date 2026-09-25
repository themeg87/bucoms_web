/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 구글 애널리틱스(GA4) 측정 ID (예: "G-XXXXXXXXXX"). 비어 있으면 통계를 수집하지 않습니다.
export const GA_MEASUREMENT_ID = "G-BWZLZS95V8";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Record<string, string> = {}) {
  window.gtag?.("event", event, params);
}

// 전화·카카오톡·블로그 링크 클릭은 페이지 전체에서 한 번에 집계
function trackLinkClicks(e: MouseEvent) {
  const link = (e.target as Element | null)?.closest?.("a");
  if (!link) return;
  const href = link.getAttribute("href") || "";
  // 버튼 위치: 섹션 id(hero·cctv·guarantee 등) / nav / footer / 화면에 떠 있는 버튼(floating)
  const area = link.closest("section[id], nav, footer");
  const location = area ? area.id || area.tagName.toLowerCase() : "floating";
  if (href.startsWith("tel:")) track("click_phone", { location });
  else if (href.includes("pf.kakao.com")) track("click_kakao", { location });
  else if (href.includes("blog.naver.com")) track("click_blog", { location });
}

export function initAnalytics() {
  if (!GA_MEASUREMENT_ID) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js 는 arguments 객체 그대로를 받아야 함
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);

  document.addEventListener("click", trackLinkClicks, { capture: true });
}
