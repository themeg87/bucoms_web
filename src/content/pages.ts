/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 서비스·지역·시공 사례 페이지 내용.
// 사실은 블로그 원고(사장님이 알려 준 내용)와 사이트에 이미 공개한 정보만 사용합니다.

import { BUSINESS } from '../constants/business';
import { ALL_POSTS, AREA_POSTS, CASE_POSTS, TOPIC_POSTS, type BlogPost } from './blogPosts';

export type { BlogPost };

export const SITE_URL = "https://www.bucoms.com";

export interface Faq { q: string; a: string }
export interface Photo { src: string; caption: string }

export interface CasePage {
  slug: string;
  area: string;
  category: string;
  title: string;
  summary: string;
  body: string[];
  tags: string[];
  photos: Photo[];
  service: string;
  blogUrl?: string;
}

export interface ServicePage {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  image?: Photo;
  listTitle: string;
  list: string[];
  points: { title: string; desc: string }[];
  prices?: { label: string; value: string; note: string }[];
  faqs: Faq[];
  cases: string[];
}

export interface AreaPage {
  slug: string;
  name: string;
  short: string;
  note?: string;
  cases: string[];
}

export const CASE_PAGES: CasePage[] = [
  {
    slug: "dongnae-board",
    area: "부산 동래",
    category: "전원 꺼짐 점검",
    title: "한 번씩 꺼지던 컴퓨터, 원인은 메인보드",
    summary: "고객님은 램이나 그래픽카드를 의심하셨지만, 부품을 케이스 밖으로 꺼내 누드 테스트부터 전체 점검을 했습니다. MemTest86(램)과 3DMark(그래픽카드)는 모두 정상이었고, 메인보드 문제를 확인해 B760M 보드로 교체했습니다.",
    body: [
      "\"컴퓨터가 한 번씩 그냥 꺼져요. 램이나 그래픽카드 문제 같아요.\" 부산 동래 고객님이 이렇게 말씀하시며 점검을 맡기셨습니다. 의심하신 부품만 보지 않고 전체 점검을 진행했습니다.",
      "먼저 부품을 케이스에서 꺼내 누드 테스트 상태로 연결했습니다. 케이스나 배선의 영향을 빼고 부품만 따로 보기 위해서입니다.",
      "램은 MemTest86으로 끝까지 검사했고, 16GB 두 개 모두 오류 0개로 통과했습니다. 그래픽카드(RTX 3060 Ti)는 3DMark Steel Nomad로 부하를 걸어 끝까지 정상으로 마쳤습니다(2,584점).",
      "램과 그래픽카드가 정상이라 나머지 부품을 이어서 점검했고, 메인보드 문제를 확인했습니다. 기존 CPU(i5-12400F)와 DDR4 램에 맞는 GIGABYTE B760M AORUS ELITE D4 보드로 교체했습니다.",
      "부컴은 점검을 맡기실 때와 수리 후 출고할 때 모두 메모리·3DMark·온도·과부하 테스트를 진행합니다. 한 번씩 꺼지는 증상은 잠깐 켜 봐서는 안 잡히는 경우가 많아, 부하를 걸어 끝까지 돌려 보는 게 중요합니다."
    ],
    tags: ["누드 테스트", "MemTest86", "3DMark", "메인보드 교체"],
    photos: [
      { src: "/cases/dongnae-board/1.jpg", caption: "케이스 밖에서 부품만 연결한 누드 테스트" },
      { src: "/cases/dongnae-board/2.jpg", caption: "MemTest86 램 테스트 PASS" },
      { src: "/cases/dongnae-board/3.jpg", caption: "3DMark Steel Nomad 부하 테스트" }
    ],
    service: "computer-repair"
  },
  {
    slug: "suyeong-cctv",
    area: "부산 수영구",
    category: "CCTV 설치",
    title: "씨메르 필로티 주차장·엘리베이터 홀 CCTV",
    summary: "필로티 주차장·출입구, 분리수거장, 계단실까지 사람과 차가 드나드는 동선을 따라 카메라 위치를 잡았습니다. 배선은 통신 단자함과 계단실 벽을 따라 정리하고, 엘리베이터 홀에 분할 모니터를 달아 오가며 바로 확인할 수 있게 했습니다.",
    body: [
      "부산 수영구 씨메르 건물의 필로티 주차장·출입구, 분리수거장, 계단실에 CCTV를 설치했습니다. 차량 출입구와 분리수거장이 한 공간에 있어서, 전체를 한눈에 담는 카메라 위치를 잡는 것이 핵심이었습니다.",
      "계단실은 사다리 작업으로 배선을 따라 올리고, 통신 단자함 안에서 선을 정리해 밖으로 지저분하게 드러나지 않도록 마감했습니다.",
      "필로티 천장에는 돔 카메라를 달아 도로 쪽 출입구 방향까지 한 화면에 담았습니다.",
      "녹화기 연결을 마친 뒤 엘리베이터 홀에 분할 모니터를 거치해, 주차장·출입구·분리수거장을 오가면서 바로 확인할 수 있게 했습니다."
    ],
    tags: ["CCTV 설치", "돔 카메라", "배선 정리", "분할 모니터"],
    photos: [
      { src: "/cases/suyeong-cctv/1.jpg", caption: "시공 전 필로티 주차장" },
      { src: "/cases/suyeong-cctv/2.jpg", caption: "필로티 천장 돔 카메라" },
      { src: "/cases/suyeong-cctv/3.jpg", caption: "통신 단자함 내부 배선 정리" },
      { src: "/cases/suyeong-cctv/4.jpg", caption: "엘리베이터 홀 분할 모니터" }
    ],
    service: "cctv",
    blogUrl: "https://blog.naver.com/bucom_/224416850340"
  },
  {
    slug: "ulsan-gpu-board",
    area: "울산 남구",
    category: "메인보드·그래픽카드 교체",
    title: "장착 중 손상된 보드와 그래픽카드 교체",
    summary: "그래픽카드를 끼우다 슬롯이 크게 꺾이면서 보드와 그래픽카드가 함께 고장 났습니다. 새 제품이 단종돼 같은 모델 보드(X470 AORUS ULTRA GAMING)와 RTX 2060을 리퍼 부품으로 구해 교체하고, 드라이버 정리와 테스트까지 마친 뒤 출고했습니다.",
    body: [
      "고객님이 그래픽카드를 메인보드 슬롯에 넣는 과정에서 카드를 좌우로 심하게 꺾으면서, 메인보드와 그래픽카드가 함께 고장 났습니다.",
      "울산 남구로 출장을 가서 부품을 수거해 진단했고, 고장 내용을 안내해 드리자 수리 대신 교체를 요청하셨습니다.",
      "메인보드는 기존과 같은 모델인 X470 AORUS ULTRA GAMING으로, 그래픽카드는 iGame RTX 2060 Ultra 대신 ASUS TUF RTX 2060 O6G GAMING으로 교체했습니다. 두 제품 모두 새 제품이 단종돼 리퍼 부품을 사용했습니다.",
      "교체 후 DDU로 기존 그래픽 드라이버를 깨끗이 정리하고 새로 설치한 뒤, 테스트를 마치고 출고했습니다."
    ],
    tags: ["출장 수거", "메인보드 교체", "RTX 2060", "드라이버 정리"],
    photos: [
      { src: "/cases/ulsan-gpu-board/1.jpg", caption: "교체한 X470 AORUS ULTRA GAMING 보드" },
      { src: "/cases/ulsan-gpu-board/2.jpg", caption: "교체 후 조립해 켜 본 모습" }
    ],
    service: "computer-repair"
  },
  {
    slug: "centum-cleaning",
    area: "해운대 센텀",
    category: "출장 컴퓨터 청소",
    title: "산 뒤로 한 번도 열지 않은 본체 청소",
    summary: "이사 후 컴퓨터 상태를 보고 놀라 블로그를 보고 연락 주신 고객님 댁으로 출장을 갔습니다. 팬과 쿨러를 떼어 하나씩 닦고, CPU 서멀구리스까지 새로 발랐습니다.",
    body: [
      "부산 센텀 고객님이 이사 후 컴퓨터를 보고 깜짝 놀라셨다고 합니다. 산 뒤로 한 번도 열어 본 적이 없는 본체였고, 우연히 컴퓨터 청소 블로그 글을 보고 연락을 주셨습니다.",
      "댁으로 출장을 가서 팬과 쿨러를 떼어 하나씩 따로 청소하고, CPU 서멀구리스를 새로 발랐습니다.",
      "부컴 컴퓨터 청소는 기본 55,000원입니다. 작업 난이도나 오염도에 따라 추가 비용이 생길 수 있고, 청소가 불가능할 만큼 오염이 심하면 케이스 교체를 안내해 드립니다."
    ],
    tags: ["출장 청소", "팬·쿨러 분리", "서멀구리스 재도포"],
    photos: [
      { src: "/cases/centum-cleaning/1.jpg", caption: "청소 전(왼쪽)과 후(오른쪽)" },
      { src: "/cases/centum-cleaning/2.jpg", caption: "청소 전 본체 내부" },
      { src: "/cases/centum-cleaning/3.jpg", caption: "청소 후 본체 내부" }
    ],
    service: "computer-cleaning"
  },
  {
    slug: "yeongdo-nas",
    area: "부산 영도구",
    category: "NAS 설치",
    title: "지역관리센터 시놀로지 NAS 설치",
    summary: "관급 계약으로 Synology DS925neo+와 시놀로지 정품 HAT3300 6TB 하드를 설치했습니다. 설치와 설정은 약 2시간 걸렸고, PC 탐색기에서 네트워크 드라이브로 바로 쓸 수 있게 연결했습니다.",
    body: [
      "관급 계약으로 부산 영도구 지역관리센터에 시놀로지 NAS를 설치했습니다. 장비는 Synology DS925neo+와 시놀로지 정품 HAT3300 6TB 하드디스크입니다.",
      "하드를 장착하고 DSM을 설정한 뒤, 직원분들 PC 탐색기에서 네트워크 드라이브로 바로 쓸 수 있게 연결했습니다. 설치와 설정에는 약 2시간이 걸렸습니다.",
      "보안을 위해 접속 주소·계정·폴더 구성 같은 정보는 공개하지 않습니다. 담당자분들이 친절하게 맞아 주셔서 감사했습니다."
    ],
    tags: ["DS925neo+", "HAT3300 6TB", "네트워크 드라이브"],
    photos: [
      { src: "/cases/yeongdo-nas/1.jpg", caption: "설치 전, 본체와 정품 하드 2개" },
      { src: "/cases/yeongdo-nas/2.jpg", caption: "설치 후 작동 중인 NAS" },
      { src: "/cases/yeongdo-nas/3.jpg", caption: "정품 스티커 확인" }
    ],
    service: "nas-network"
  },
  {
    slug: "power-supply",
    area: "부산",
    category: "파워 교체",
    title: "전원이 안 켜지던 PC, 파워 교체로 해결",
    summary: "전원이 안 켜진다는 연락을 받고 먼저 증상을 자세히 상담했습니다. 마이크로닉스 Classic II 600W 새 제품으로 파워를 교체하고, 그 자리에서 정상 작동을 확인했습니다.",
    body: [
      "컴퓨터 전원이 안 켜진다는 연락을 받고, 먼저 증상을 자세히 상담했습니다.",
      "파워(전원 공급 장치)를 마이크로닉스 Classic II 풀체인지 600W 80PLUS BRONZE 새 제품으로 교체했습니다.",
      "교체 후 바로 전원을 켜서 정상 작동하는 것을 확인했습니다. 파워를 바꿀 때는 용량뿐 아니라 그래픽카드 보조전원 등 필요한 커넥터가 다 있는지, 케이스에 들어가는 크기인지도 함께 확인합니다."
    ],
    tags: ["전원 불량", "파워 교체", "600W 80PLUS BRONZE"],
    photos: [
      { src: "/cases/power-supply/1.jpg", caption: "새 파워로 바꾸고 켜 본 모습" },
      { src: "/cases/power-supply/2.jpg", caption: "교체 후, 바닥에 둔 것이 기존 파워" },
      { src: "/cases/power-supply/3.jpg", caption: "교체해서 뺀 기존 파워" }
    ],
    service: "computer-repair"
  }
];

const COMMON_REPAIR_FAQS: Faq[] = [
  { q: "출장비는 얼마인가요?", a: `${BUSINESS.serviceArea} 출장비는 10,000원이며, 수리를 진행하시면 출장비는 받지 않습니다.` },
  { q: "수리비는 언제 알 수 있나요?", a: "점검으로 원인을 찾은 뒤 비용을 먼저 안내해 드리고, 동의하신 경우에만 수리를 진행합니다. 동의 없이 청구하는 비용은 없습니다." },
  { q: "수리 후 같은 증상이 다시 생기면요?", a: `수리 완료일로부터 ${BUSINESS.warrantyDays}일 이내 동일 부위에 같은 증상이 생기면 무상으로 다시 수리해 드립니다. (고객 과실·소모품 제외)` }
];

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "computer-repair",
    name: "컴퓨터 출장수리",
    title: "부산 컴퓨터수리 · 출장수리",
    description: "부산 컴퓨터수리·출장수리 부컴. 전원 불량·꺼짐·블루스크린·느려짐, 10년 경력 엔지니어가 직접 방문해 점검합니다.",
    h1: "부산 컴퓨터수리 · 출장수리",
    intro: [
      "컴퓨터가 안 켜지거나, 쓰다가 꺼지거나, 갑자기 느려졌다면 부컴이 직접 방문합니다.",
      "10년 경력 엔지니어가 본체를 열고 부품을 하나씩 점검해 원인을 찾고, 비용을 먼저 안내한 뒤 동의하신 경우에만 수리합니다."
    ],
    image: { src: "/hero/01-power.jpg", caption: "파워 교체 후 정상 작동" },
    listTitle: "이런 증상이면 연락 주세요",
    list: [
      "전원 버튼을 눌러도 반응이 없을 때",
      "쓰다가 갑자기 꺼지거나 재부팅될 때",
      "블루스크린, 부팅 중 멈춤, 검은 화면",
      "컴퓨터가 유난히 느려졌을 때",
      "본체가 뜨겁거나 소음이 커졌을 때",
      "모니터 화면 줄감·색 깨짐, 소리 안 남",
      "윈도우 설치·업데이트 오류, 정품 인증",
      "노트북 액정·키보드·배터리 문제"
    ],
    points: [
      { title: "부품을 하나씩 테스트", desc: "누드 테스트, MemTest86(램), 3DMark(그래픽카드)처럼 부품을 따로 검사해 원인을 좁혀 갑니다." },
      { title: "수리 전 비용 안내", desc: "원인과 비용을 먼저 말씀드리고, 동의하신 경우에만 부품 교체와 수리를 진행합니다." },
      { title: "출고 전 테스트", desc: "수리 후 메모리·그래픽·온도 테스트로 정상 작동을 확인하고 마무리합니다." }
    ],
    prices: [
      { label: "출장비", value: "10,000원", note: "수리 진행 시 면제" },
      { label: "간단한 수리", value: "55,000원", note: "점검 후 바로 해결되는 간단한 고장" },
      { label: "기본 공임비", value: "55,000원", note: "부품 교체·설치 등 기본 작업, 부품값 별도" },
      { label: "그 외 수리·부품 교체", value: "점검 후 안내", note: "비용 안내 후 동의 시에만 진행" }
    ],
    faqs: [
      ...COMMON_REPAIR_FAQS,
      { q: "꼭 방문해야 하나요?", a: "증상에 따라 출장 없이 원격으로 해결되는 경우도 있습니다. 먼저 전화나 카카오톡으로 증상을 알려 주세요." }
    ],
    cases: ["dongnae-board", "power-supply", "ulsan-gpu-board"]
  },
  {
    slug: "cctv",
    name: "CCTV 설치",
    title: "부산 CCTV 설치",
    description: "부산 CCTV 설치 부컴. 동선 기준 카메라 설계, 깔끔한 배선, 녹화기·모니터 세팅까지 한 번에 해 드립니다.",
    h1: "부산 CCTV 설치",
    intro: [
      "카메라만 달고 끝내지 않습니다. 현장을 직접 보고 사람과 차가 드나드는 길을 따라 위치를 잡습니다.",
      "배선은 단자함과 벽면을 따라 깔끔하게 정리하고, 녹화기 연결과 모니터 세팅까지 설치 당일 마무리합니다."
    ],
    image: { src: "/cases/suyeong-cctv/4.jpg", caption: "엘리베이터 홀 분할 모니터" },
    listTitle: "이런 곳에 설치합니다",
    list: ["빌라·공동주택 주차장과 출입구", "상가·매장", "사무실", "주차장·분리수거장", "계단실·엘리베이터 홀", "공장·창고"],
    points: [
      { title: "동선 기준 위치 설계", desc: "사람과 차가 드나드는 길을 따라 사각지대가 없도록 카메라 위치를 잡습니다." },
      { title: "깔끔한 배선 마감", desc: "통신 단자함과 벽면을 따라 선을 정리해 밖으로 지저분하게 드러나지 않게 마감합니다." },
      { title: "녹화기·모니터 세팅까지", desc: "녹화기 연결부터 분할 모니터 거치까지, 설치 당일 바로 화면을 확인할 수 있게 해 드립니다." }
    ],
    faqs: [
      { q: "설치 비용은 얼마인가요?", a: "카메라 대수, 설치 위치, 배선 거리에 따라 달라서 현장을 확인한 뒤 안내해 드립니다. 현장 사진을 카카오톡으로 보내 주시면 상담이 빨라집니다." },
      { q: "CCTV를 달면 안내판도 붙여야 하나요?", a: "매장·주차장처럼 여러 사람이 드나드는 곳에 CCTV를 설치하면 개인정보 보호법에 따라 촬영 목적·범위·관리자 연락처를 적은 안내판을 잘 보이는 곳에 붙여야 합니다." },
      { q: "기존 CCTV 점검도 되나요?", a: "네, 화면이 안 나오거나 녹화가 안 되는 경우 방문해 점검합니다. 증상을 먼저 알려 주세요." }
    ],
    cases: ["suyeong-cctv"]
  },
  {
    slug: "computer-cleaning",
    name: "컴퓨터 청소",
    title: "부산 컴퓨터 청소",
    description: "부산 컴퓨터 청소 부컴. 팬·쿨러 분리 청소와 서멀구리스 재도포, 기본 55,000원. 출장 청소 가능합니다.",
    h1: "부산 컴퓨터 청소",
    intro: [
      "옆판을 열어 보면 팬 날개, 케이블, 케이스 바닥까지 먼지가 덮인 경우가 많습니다. 이 상태면 바람이 제대로 통하지 않아 열이 빠지기 어렵고 소음도 커집니다.",
      "부컴 컴퓨터 청소는 팬과 쿨러를 떼어서 따로 청소하고, CPU 서멀구리스 재도포까지 진행합니다."
    ],
    image: { src: "/cases/centum-cleaning/1.jpg", caption: "청소 전(왼쪽)과 후(오른쪽)" },
    listTitle: "이럴 때 청소가 필요해요",
    list: ["본체 소음이 커졌을 때", "본체가 뜨겁거나 게임 중 느려질 때", "산 뒤로 한 번도 열어 본 적 없을 때", "이사 후 본체 안이 걱정될 때"],
    points: [
      { title: "팬·쿨러 분리 청소", desc: "겉만 불어 내지 않고 팬과 쿨러를 떼어 하나씩 닦습니다." },
      { title: "서멀구리스 재도포", desc: "CPU 서멀구리스를 새로 발라 열이 잘 빠지게 합니다." },
      { title: "사진으로 먼저 확인", desc: "사진 한두 장만 보내 주셔도 어느 정도 상태인지 먼저 봐 드립니다." }
    ],
    prices: [
      { label: "컴퓨터 청소", value: "기본 55,000원", note: "오염도·작업 난이도에 따라 추가 비용이 생길 수 있어요" },
      { label: "출장비", value: "10,000원", note: "수리·청소 진행 시 면제" }
    ],
    faqs: [
      { q: "비용이 더 나올 수도 있나요?", a: "기본 55,000원이며, 작업 난이도나 오염도에 따라 추가 비용이 생길 수 있습니다. 작업 전에 먼저 안내해 드립니다." },
      { q: "청소가 안 되는 경우도 있나요?", a: "먼지·오염이 너무 심해 청소가 불가능한 경우에는 케이스 교체로 이어질 수 있다는 점을 미리 알려 드립니다." },
      { q: "집으로 와서 청소해 주나요?", a: "네, 해운대 센텀 사례처럼 댁으로 출장을 가서 청소합니다." }
    ],
    cases: ["centum-cleaning"]
  },
  {
    slug: "data-recovery",
    name: "데이터 복구",
    title: "부산 데이터 복구",
    description: "부산 데이터 복구 부컴. 삭제된 파일, 인식 안 되는 외장하드·SSD 복구와 백업·데이터 이전까지 도와드립니다.",
    h1: "부산 데이터 복구",
    intro: [
      "파일이 갑자기 사라졌거나, 외장하드가 인식되지 않거나, 실수로 포맷했다면 더 쓰지 말고 먼저 연락 주세요.",
      "소중한 자료를 살리는 복구부터 백업, 새 저장장치로의 이전, 처분 전 완전 삭제까지 도와드립니다."
    ],
    listTitle: "이런 경우 도와드립니다",
    list: ["삭제된 파일·포맷된 하드", "인식되지 않는 외장하드·USB", "HDD·SSD 고장", "오래된 컴퓨터에서 자료만 살리기", "하드에서 SSD로 윈도우 그대로 옮기기", "처분 전 데이터 완전 삭제"],
    points: [
      { title: "상태부터 확인", desc: "저장장치 상태를 먼저 점검해 복구 가능성과 비용을 안내해 드립니다." },
      { title: "백업 방법 안내", desc: "복구 후에는 같은 일이 생기지 않도록 백업 장비와 방법을 함께 알려 드립니다." },
      { title: "데이터 이전·완전 삭제", desc: "새 컴퓨터로 자료를 옮기거나, 처분 전 자료를 복구할 수 없게 지워 드립니다." }
    ],
    faqs: [
      { q: "고장 난 저장장치는 어떻게 해야 하나요?", a: "계속 쓰거나 전원을 반복해서 켜면 복구가 더 어려워질 수 있습니다. 사용을 멈추고 먼저 연락 주세요." },
      { q: "복구가 안 되면 비용이 드나요?", a: "복구가 불가능한 경우에도 기본 점검비가 발생할 수 있으며, 점검 전에 미리 안내해 드립니다." }
    ],
    cases: []
  },
  {
    slug: "custom-pc",
    name: "조립PC·업그레이드",
    title: "부산 조립PC·업그레이드",
    description: "부산 조립PC 부컴. 사무용부터 게이밍 PC까지 용도에 맞춘 부품 선정·조립과 업그레이드를 상담해 드립니다.",
    h1: "부산 조립PC · 업그레이드",
    intro: [
      "사무용부터 하이엔드 게이밍 PC까지, 용도와 예산에 맞춰 부품을 고르고 조립해 드립니다.",
      "새로 사지 않고 필요한 부품만 바꾸는 업그레이드도 상담해 드립니다."
    ],
    image: { src: "/hero/02-nude-test.jpg", caption: "부품 테스트 중인 메인보드" },
    listTitle: "이런 작업을 합니다",
    list: ["사무용·게이밍·작업용 PC 견적과 조립", "메인보드·그래픽카드·램·SSD 교체", "사무용 PC 업그레이드", "새 PC 초기 세팅·드라이버 설치", "브랜드 PC·부품 AS 대행"],
    points: [
      { title: "용도에 맞는 부품 선정", desc: "쓰시는 프로그램과 예산을 듣고 필요한 만큼만 맞춥니다." },
      { title: "깔끔한 선 정리", desc: "바람길을 막지 않도록 선을 정리해 조립합니다." },
      { title: "성능 테스트", desc: "조립 후 테스트로 정상 작동을 확인하고 전해 드립니다." }
    ],
    faqs: [
      { q: "부품만 바꿔도 빨라질까요?", a: "용도에 따라 SSD나 램만 바꿔도 체감이 큰 경우가 있습니다. 지금 사양을 알려 주시면 필요한 부품부터 안내해 드립니다." },
      { q: "부품 정보는 어디서 보나요?", a: "부컴 블로그에 CPU·그래픽카드·램 등 부품 리뷰를 꾸준히 정리하고 있습니다. 아래 관련 글을 참고해 주세요." }
    ],
    cases: ["ulsan-gpu-board", "dongnae-board"]
  },
  {
    slug: "nas-network",
    name: "NAS·네트워크",
    title: "부산 NAS 설치·네트워크 구축",
    description: "부산 NAS 설치·네트워크 구축 부컴. 시놀로지 NAS, 사무실 랜공사, 프린터 공유, 와이파이 점검까지.",
    h1: "부산 NAS 설치 · 네트워크 구축",
    intro: [
      "사무실 자료를 한곳에 모아 함께 쓰고 싶거나, 인터넷·프린터 공유가 자꾸 말썽이라면 부컴이 방문해 세팅합니다.",
      "시놀로지 NAS 설치부터 사무실 랜공사, 프린터 공유, 와이파이 점검까지 도와드립니다."
    ],
    image: { src: "/hero/05-nas.jpg", caption: "시놀로지 NAS 설치" },
    listTitle: "이런 작업을 합니다",
    list: ["시놀로지 NAS 설치·설정", "PC에서 네트워크 드라이브 연결", "사무실 랜공사·랜선 정리", "프린터 공유 세팅", "와이파이 끊김·인터넷 느림 점검", "사무실 PC 여러 대 같은 환경으로 세팅"],
    points: [
      { title: "현장에 맞춘 설치", desc: "사용 인원과 자료 양에 맞춰 장비와 하드 구성을 안내해 드립니다." },
      { title: "바로 쓰게 연결", desc: "직원분들 PC 탐색기에서 네트워크 드라이브로 바로 쓸 수 있게 연결합니다." },
      { title: "보안 정보는 비공개", desc: "접속 주소·계정 같은 정보는 사례에도 공개하지 않습니다." }
    ],
    faqs: [
      { q: "NAS 설치는 얼마나 걸리나요?", a: "구성에 따라 다르며, 영도구 지역관리센터 사례(DS925neo+, 하드 2개)는 설치와 설정에 약 2시간이 걸렸습니다." },
      { q: "관공서나 기업도 가능한가요?", a: "네, 관급 계약으로 설치한 사례가 있습니다." }
    ],
    cases: ["yeongdo-nas"]
  }
];

export const AREA_PAGES: AreaPage[] = [
  { slug: "dongnae", name: "동래구", short: "동래", note: "부컴 사업장이 있는 동래구는 가장 빠르게 방문할 수 있는 지역입니다.", cases: ["dongnae-board"] },
  { slug: "haeundae", name: "해운대구", short: "해운대", cases: ["centum-cleaning"] },
  { slug: "suyeong", name: "수영구", short: "수영", cases: ["suyeong-cctv"] },
  { slug: "busanjin", name: "부산진구", short: "부산진·서면", cases: [] },
  { slug: "yeonje", name: "연제구", short: "연제", cases: [] },
  { slug: "nam-gu", name: "남구", short: "남구", cases: [] },
  { slug: "geumjeong", name: "금정구", short: "금정", cases: [] },
  { slug: "saha", name: "사하구", short: "사하", cases: [] },
  { slug: "sasang", name: "사상구", short: "사상", cases: [] },
  { slug: "buk-gu", name: "북구", short: "북구", cases: [] },
  { slug: "yeongdo", name: "영도구", short: "영도", cases: ["yeongdo-nas"] },
  { slug: "jung-gu", name: "중구", short: "중구", cases: [] },
  { slug: "dong-gu", name: "동구", short: "동구", cases: [] },
  { slug: "seo-gu", name: "서구", short: "서구", cases: [] },
  { slug: "gangseo", name: "강서구", short: "강서", cases: [] },
  { slug: "gijang", name: "기장군", short: "기장", cases: [] }
];

export const findCase = (slug: string) => CASE_PAGES.find(c => c.slug === slug);
export const findService = (slug: string) => SERVICE_PAGES.find(s => s.slug === slug);
export const areaPosts = (slug: string) => AREA_POSTS[slug] || { count: 0, dongs: [], posts: [] };
export const topicPosts = (slug: string): BlogPost[] => TOPIC_POSTS[slug] || [];
export const blogPostUrl = (id: string) => `${BUSINESS.blogUrl}/${id}`;
export const allPosts = (): BlogPost[] => ALL_POSTS;
// 사례의 원본 블로그 글: 직접 적은 주소 → 없으면 sync_blog_posts.py 가 제목으로 찾은 글
export const caseBlogUrl = (c: CasePage) => c.blogUrl || (CASE_POSTS[c.slug] ? blogPostUrl(CASE_POSTS[c.slug]) : undefined);

// 주소 → 화면 종류
export type Route =
  | { type: "home" }
  | { type: "service"; page: ServicePage }
  | { type: "area"; page: AreaPage }
  | { type: "case"; page: CasePage }
  | { type: "blog" };

export const servicePath = (slug: string) => `/services/${slug}/`;
export const areaPath = (slug: string) => `/area/${slug}/`;
export const casePath = (slug: string) => `/cases/${slug}/`;
export const BLOG_PATH = "/blog/";

export function resolveRoute(pathname: string): Route {
  const [kind, slug] = pathname.replace(/^\/+|\/+$/g, "").split("/");
  if (kind === "services") {
    const page = findService(slug);
    if (page) return { type: "service", page };
  }
  if (kind === "area") {
    const page = AREA_PAGES.find(a => a.slug === slug);
    if (page) return { type: "area", page };
  }
  if (kind === "blog" && !slug) return { type: "blog" };
  if (kind === "cases") {
    const page = findCase(slug);
    if (page) return { type: "case", page };
  }
  return { type: "home" };
}

export const ALL_PATHS = [
  "/",
  ...SERVICE_PAGES.map(s => servicePath(s.slug)),
  ...AREA_PAGES.map(a => areaPath(a.slug)),
  ...CASE_PAGES.map(c => casePath(c.slug)),
  BLOG_PATH
];

// 검색 결과 설명은 네이버 권장에 맞춰 80자 이내 (scripts/prerender.ts 에서 검사)
export const DESCRIPTION_MAX = 80;
export const HOME_DESCRIPTION = "부산 컴퓨터수리·출장수리·CCTV 설치 부컴. 10년 경력 엔지니어 직접 방문, 조립PC·데이터 복구·NAS까지. 출장비 10,000원.";

function caseDescription(c: CasePage) {
  const base = `${c.area} ${c.category} 사례: ${c.title}.`;
  const withSuffix = `${base} 부컴이 직접 다녀온 현장입니다.`;
  return withSuffix.length <= DESCRIPTION_MAX ? withSuffix : base;
}

// 서비스 페이지 검색엔진용 정보: 서비스(Service) + 자주 묻는 질문(FAQPage)
function serviceStructuredData(page: ServicePage) {
  const url = `${SITE_URL}${servicePath(page.slug)}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.title,
      serviceType: page.name,
      description: page.description,
      url,
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: ["부산광역시", "울산광역시", "경상남도 김해시", "경상남도 양산시"]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    }
  ];
}

// 페이지별 검색 제목·설명·이동 경로
export function pageMeta(pathname: string) {
  const route = resolveRoute(pathname);
  const home = { name: "홈", path: "/" };
  switch (route.type) {
    case "service":
      return {
        path: servicePath(route.page.slug),
        title: `${route.page.title} | 부컴 BUCOM`,
        description: route.page.description,
        image: route.page.image?.src,
        breadcrumbs: [home, { name: route.page.name, path: servicePath(route.page.slug) }],
        structuredData: serviceStructuredData(route.page)
      };
    case "area": {
      const a = route.page;
      return {
        path: areaPath(a.slug),
        title: `부산 ${a.name} 컴퓨터수리 · CCTV 설치 | 부컴 BUCOM`,
        description: `부산 ${a.name} 컴퓨터 출장수리·CCTV 설치 부컴. 10년 경력 엔지니어 직접 방문, 출장비 10,000원(수리 시 면제).`,
        image: undefined,
        breadcrumbs: [home, { name: `${a.name} 컴퓨터수리`, path: areaPath(a.slug) }]
      };
    }
    case "case":
      return {
        path: casePath(route.page.slug),
        title: `${route.page.area} ${route.page.category} 사례 - ${route.page.title} | 부컴`,
        description: caseDescription(route.page),
        image: route.page.photos[0]?.src,
        breadcrumbs: [home, { name: "시공 사례", path: "/#cases" }, { name: route.page.title, path: casePath(route.page.slug) }]
      };
    case "blog":
      return {
        path: BLOG_PATH,
        title: "블로그 글 전체 목록 | 부컴 BUCOM",
        description: "부컴 블로그 글 전체 목록. 부산 컴퓨터 출장수리·CCTV 설치 현장 이야기와 컴퓨터 정보를 모았습니다.",
        image: undefined,
        breadcrumbs: [home, { name: "블로그 글 목록", path: BLOG_PATH }]
      };
    default:
      return {
        path: "/",
        title: "부산 컴퓨터수리 · 출장수리 · CCTV 설치 | 부컴 BUCOM",
        description: HOME_DESCRIPTION,
        image: undefined,
        breadcrumbs: [home]
      };
  }
}
