"""네이버 블로그 글 목록(bucom_글목록.json)에서 지역·주제별 관련 글을 골라 src/content/blogPosts.ts 로 저장.

실행: python3 scripts/sync_blog_posts.py [글목록.json 경로]
블로그 글이 늘어나면 다시 실행하고 빌드·배포하면 페이지의 '관련 블로그 글'이 갱신됩니다.
"""
import json
import re
import sys
from pathlib import Path

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/pi5/share/blog_computer/posts/bucom_글목록.json")
OUT = Path(__file__).resolve().parent.parent / "src/content/blogPosts.ts"
CATEGORIES = {"부컴_컴퓨터정보", "부컴_CCTV", "긴급_컴퓨터정보", "컴퓨터부품", "원격제어", "파일찾기"}
PER_PAGE = 8

# 지역 페이지 slug → 제목에서 찾을 패턴
AREAS = {
    "dongnae": r"동래",
    "haeundae": r"해운대|센텀",
    "suyeong": r"수영구|수영 |광안|민락|남천",
    "busanjin": r"부산진|서면",
    "yeonje": r"연제|연산",
    "nam-gu": r"부산 남구|대연|용당|문현",
    "geumjeong": r"금정|구서|장전",
    "saha": r"사하|하단|다대",
    "sasang": r"사상|감전|주례",
    "buk-gu": r"부산 북구|덕천|만덕|화명",
    "yeongdo": r"영도",
    "jung-gu": r"부산 중구|남포|광복",
    "dong-gu": r"부산 동구|초량|범일",
    "seo-gu": r"부산 서구|(?<!강)서구",
    "gangseo": r"강서|명지",
    "gijang": r"기장|정관",
}
TOPICS = {
    "computer-repair": r"컴퓨터수리|수리|안켜짐|꺼짐|블루스크린|부팅",
    "cctv": r"CCTV|cctv",
    "computer-cleaning": r"청소|먼지|클리닉|서멀",
    "data-recovery": r"데이터|복구|백업|자료|파일이|SSD로",
    "custom-pc": r"조립|견적|게이밍|리뷰|RTX|라이젠|메인보드|램 ",
    "nas-network": r"NAS|나스|네트워크|와이파이|인터넷|공유기|프린터|랜",
}
DONG_STOP = {"작동", "오작동", "자동", "이동", "연동", "활동", "변동", "행동", "구동", "진동", "동동"}
EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-➿⬀-⯿️‍⃣]")


def clean(title: str) -> str:
    return re.sub(r"\s{2,}", " ", EMOJI.sub("", title)).strip(" -—|")


def dongs(title: str) -> list[str]:
    found = re.findall(r"(?:^|[(·\s,])([가-힣]{1,3}[0-9]?(?:동|읍))(?=[·)\s,]|$)", title)
    return [d for d in found if d not in DONG_STOP and len(d) >= 2]


posts = [p for p in json.loads(SRC.read_text(encoding="utf-8")) if p["카테고리"] in CATEGORIES]
posts.sort(key=lambda p: p["발행"], reverse=True)


def pick(pattern: str) -> list[dict]:
    return [
        {"id": str(p["logNo"]), "title": clean(p["제목"]), "date": p["발행"][:10]}
        for p in posts if re.search(pattern, p["제목"])
    ][:PER_PAGE]


areas = {}
for slug, pattern in AREAS.items():
    matched = [p for p in posts if re.search(pattern, p["제목"])]
    names: list[str] = []
    for p in matched:
        for d in dongs(p["제목"]):
            if d not in names:
                names.append(d)
    areas[slug] = {"count": len(matched), "dongs": names[:12], "posts": pick(pattern)}

topics = {slug: pick(pattern) for slug, pattern in TOPICS.items()}

OUT.write_text(
    "// scripts/sync_blog_posts.py 로 생성한 파일입니다. 직접 고치지 마세요.\n"
    "export interface BlogPost { id: string; title: string; date: string }\n\n"
    f"export const AREA_POSTS: Record<string, {{ count: number; dongs: string[]; posts: BlogPost[] }}> = {json.dumps(areas, ensure_ascii=False, indent=2)};\n\n"
    f"export const TOPIC_POSTS: Record<string, BlogPost[]> = {json.dumps(topics, ensure_ascii=False, indent=2)};\n",
    encoding="utf-8",
)
for slug, a in areas.items():
    print(f"{slug:10} 글 {a['count']:3}  동네: {' '.join(a['dongs'])}")
for slug, t in topics.items():
    print(f"{slug:18} {len(t)}  예) {t[0]['title'][:40] if t else '-'}")
