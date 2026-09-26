# 부컴 홈페이지 작업 기록 (WORKLOG)

> 작업을 시작할 때 이 파일을 먼저 읽고, 작업이 끝나면 맨 아래 "작업 이력"에 한 줄 이상 추가하고 "현재 상태·남은 일"을 갱신한다.
> (커밋이 이 파일보다 새로우면 Stop 훅이 갱신을 요구함 — `/home/pi5/share/.claude/hooks/worklog_check.py`)

## 1. 한눈에 보기

| 항목 | 내용 |
|---|---|
| 사이트 | https://www.bucoms.com (bucoms.com·http → www 로 308 이동) |
| 저장소 | GitHub `themeg87/bucoms_web` (현재 Public — 사장님이 Private 로 돌릴 예정) · 로컬 `/home/pi5/share/bucoms_web` |
| 배포 | `main` 에 push → Vercel 자동 배포 (vercel.json: `@vercel/static-build` + `server.ts` API) |
| 구조 | React 19 + Vite + Tailwind 4 · 빌드 때 30페이지 프리렌더 · Express `server.ts`(문의 API → 텔레그램 + 구글 시트) |
| 사업자 | 부컴 · 대표 최영중 · 427-50-01058 · 부산시 동래구 동래로 117 · 010-2222-0170 · c870120@naver.com |
| 운영 | 연중무휴 09:00-22:00 · 출장 부산·울산·김해·양산 · 출장비 10,000원(수리 시 면제) · 30일 무상 A/S |
| 통계 | GA4 `G-BWZLZS95V8` (`src/analytics.ts`) — click_phone·click_kakao·click_blog·open_inquiry_form·submit_inquiry |
| 검색 등록 | 구글 서치콘솔(URL 접두어 https://www.bucoms.com/) · 네이버 서치어드바이저 — 둘 다 사이트맵 제출 완료 |

## 2. 파일 지도

- `src/App.tsx` — 공통 틀(메뉴·상단 띠·푸터·문의 창·떠 있는 버튼) + 홈 화면 섹션. `App({ path })` 가 주소에 따라 홈/하위 페이지.
- `src/pages/SubPage.tsx` — 서비스·지역·시공 사례 페이지 화면.
- `src/content/pages.ts` — 서비스 6 · 지역 16 · 사례 6 페이지 내용, 주소 목록(`ALL_PATHS`), 페이지별 제목·설명(`pageMeta`, 설명 80자 이내).
- `src/content/blogPosts.ts` — 블로그 글 목록에서 생성(직접 수정 금지): 지역·주제별 글, 사례 원본 글(`CASE_POSTS`), 전체 글(`ALL_POSTS` → `/blog/` 페이지). 갱신: `python3 scripts/sync_blog_posts.py` → 빌드·배포.
- `src/constants/business.ts` — 사업자·연락처·운영시간·지역 (사이트 전체가 사용). `legal.ts` — 약관·개인정보처리방침.
- `scripts/prerender.ts` — 빌드 때 페이지마다 HTML·메타·breadcrumb JSON-LD·sitemap 생성, 설명 80자 초과 시 빌드 실패.
- `index.html` — 기본 메타, LocalBusiness JSON-LD, 네이버·구글 소유확인 태그, 글꼴(Pretendard CDN).
- `public/` — hero(슬라이드 5장), cases/<사례>/, cctv/, steps/, og-image.jpg, 아이콘, robots.txt.
- 사진 출처: `/home/pi5/share/blog_computer/posts/NN_*/_src/`, `/home/pi5/share/blog_cctv/output/씨메르/` (얼굴 나온 사진은 쓰지 않음).

## 3. 자주 쓰는 명령

```bash
cd /home/pi5/share/bucoms_web
npx tsc --noEmit && npm run build            # 타입 검사 + 30페이지 빌드
PORT=3977 NODE_ENV=production npx tsx server.ts   # 로컬 확인 (3000번은 ComDoctor 가 사용 중!)
python3 scripts/sync_blog_posts.py           # 블로그 새 글 반영
git push "https://themeg87:<토큰>@github.com/themeg87/bucoms_web.git" main   # 토큰은 파일에 저장 불가(권한 설정), 매번 URL 로
```
- 테스트 서버 끌 때 `pkill -f "tsx server.ts"` 금지(내 셸까지 죽음) → `ss -ltnp | grep :3977` 로 PID 찾아 kill.
- 화면 확인: headless chromium 또는 Playwright(`/home/pi5/share/blog_cctv/naver_auto/.venv/bin/python`). GA 요청은 route.abort 로 막고 테스트.

## 4. 원칙 (사장님 요청)

- 과장 실적·가짜 후기·근거 없는 No.1 금지. 문구는 블로그 원고의 "사실" 부분과 사장님 말씀에서만.
- 사람 얼굴(뒷모습 포함 메인 사진도) 나온 사진 쓰지 않음.
- 문의 폼에 개인정보 동의 체크 두지 않음(거리감) — 처리방침에 근거(개인정보 보호법 제15조 제1항 제4호) 명시로 대체.
- 검색 설명 80자 이내(네이버 권장). 주소는 `https://www.bucoms.com` 으로 통일.
- 지역 페이지는 그 지역 블로그 글·사례가 있을 때만 만든다(도어웨이 페이지 방지). 울산·김해·양산은 아직 없음.

## 5. 현재 상태 · 남은 일

- [x] 사장님: 실제 문의 → 텔레그램 도착 확인 (2026-09-26)
- [ ] 사장님: 구글 비즈니스 프로필 등록 → 이후 리뷰 요청 QR 카드 제작
- [ ] 사장님: 네이버 스마트플레이스 홈페이지 칸에 https://www.bucoms.com
- [ ] 사장님: GitHub 토큰 폐기, 저장소 Private 전환 (작업이 한동안 없을 때)
- [x] 사장님: 서치콘솔 `/blog/` 색인 요청·정상 등록 (2026-09-26)
- [ ] 사장님: 대화에 붙여 넣은 GitHub 토큰은 작업 끝나면 폐기
- [ ] 사례 원본 글 연결: 현재 수영 CCTV 1/6만. 동래·울산·센텀·영도·파워 글 발행 뒤 `sync_blog_posts.py` 재실행→배포 (패턴은 스크립트 `CASES`)
- [ ] 다음 새 블로그 글에서 bucoms.com 링크 카드(oglink)가 실제로 만들어지는지 확인
- [ ] (선택) 기존 인기·시공 사례 블로그 글 일부에 홈페이지 링크 추가, 네이버 RSS, 울산·김해·양산 페이지(글이 생기면)

## 6. 작업 이력

- 2026-09-25 23:54 `a6dee60` 점검 1~10: 가짜 실시간 현황·과장 수치·"공식 파트너" 제거, 후기 → 블로그 실제 사례(사진), 사업자 정보, 문의 API 검증·봇 차단·IP 제한·시트 RAW·오류 비노출, .env.example 로드 제거, Gemini 코드 삭제.
- 2026-09-26 00:06 `fbf52b4` 문의 폼 개인정보 동의 체크 제거(사장님 요청), 처리방침 근거 명시.
- 00:15 `2fdedfe` 검색 노출: 프리렌더, lang=ko, 메타·OG 이미지·파비콘, LocalBusiness JSON-LD, robots/sitemap, 한국어 h1.
- 00:20 `6696be5` 네이버·구글 소유확인 태그. 도메인 bucoms.com 연결 확인.
- 00:26 `1dbcaeb` CCTV 섹션(씨메르 사례 사진). 00:31 `5f1a686` 스톡 사진 → 현장 사진, 이용 절차 실제 흐름, 비용 안내(출장비·청소 55,000원).
- 00:35 `cf7201f` Pretendard, CCTV 얼굴 사진 교체. 00:40 `f04deaf` 버튼 문구·ESC·접근성·GA 준비. 00:47 `cc59104` GA4 연결, 처리방침 쿠키 항목.
- 00:58 `54bd5b7` 메인 사진(사람 없는 수리 PC). 01:03 `97939f5` 메인 슬라이드쇼 5장.
- 01:29 `6c4fc58` 서비스 6·지역 16·사례 6 페이지 추가(총 29), sitemap 자동 생성, 블로그 글 동기화 스크립트. 01:32 `46de66d` 안 쓰는 사진 삭제.
- 01:52 `0b28392` 검색 설명 80자 이내(네이버 SEO 경고 해결), 빌드 검사 추가. 사장님이 Vercel 에서 bucoms.com → www 를 308 로 변경(확인함).
- 2026-09-26 블로그 쪽(저장소 밖): `blog_computer/tools/template/homepage.py`(주제별 홈페이지 링크·서명 WEB 줄), `check_post.py` [홈페이지] 경고, `blog_computer/CLAUDE.md`·스킬 post_format.md 규칙, `bucom_brand/brand.json` contact.website.
- 2026-09-26 작업 기록 체계: 이 WORKLOG.md + 프로젝트 CLAUDE.md(자동 로드) + Stop 훅(기록 누락 시 갱신 요구).
- 2026-09-26 02:50 `4d78146` 네이버 블로그 글 구글 색인 돕기: `/blog/` 전체 글 목록 페이지(488개 링크, sitemap 포함), 푸터·관련 글 섹션에서 `/blog/` 링크, 사례 페이지 원본 글 자동 연결(`CASE_POSTS`). 배포 확인(실서버 488개 링크·sitemap).
- 2026-09-26 (저장소 밖) 당근 비즈프로필 자동 게시(`/home/pi5/share/daangn_biz`, 화·금 11:00) 시작, 프로필 정보(공지·소개·영업시간·링크·가격·로고)를 부컴 기준으로 수정, 이름 변경 검수 중.
