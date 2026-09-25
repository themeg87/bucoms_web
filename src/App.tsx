/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Monitor, 
  Cpu, 
  ShieldCheck, 
  Wrench, 
  ChevronRight, 
  Menu, 
  X,
  CheckCircle2,
  Star,
  Laptop,
  Database,
  Wifi,
  Settings,
  Zap,
  Award,
  Users,
  MessageSquare,
  ArrowUpRight,
  ArrowRight,
  ClipboardCheck,
  Banknote,
  History,
  Cctv,
  Cable,
  MonitorPlay,
  Route,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from './constants/legal';
import { BUSINESS } from './constants/business';
import { track } from './analytics';
import { KakaoIcon } from './components/KakaoIcon';
import { CaseCard } from './components/CaseCard';
import { SubPage } from './pages/SubPage';
import { AREA_PAGES, BLOG_PATH, CASE_PAGES, SERVICE_PAGES, areaPath, casePath, resolveRoute, servicePath } from './content/pages';
import Markdown from 'react-markdown';

const SERVICES = [
  {
    icon: <Monitor className="w-6 h-6" />,
    title: "데스크탑 판매",
    href: servicePath("custom-pc"),
    description: "사무용부터 하이엔드 게이밍 PC까지, 용도에 맞는 최적의 데스크탑 판매 및 맞춤 상담.",
    tags: ["사무용", "게이밍", "워크스테이션"]
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "조립",
    href: servicePath("custom-pc"),
    description: "부품 선정부터 깔끔한 선 정리까지, 전문가의 손길로 완성되는 고성능 커스텀 조립 PC.",
    tags: ["커스텀PC", "선정리", "성능테스트"]
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "AS대행/부품구매대행",
    href: servicePath("custom-pc"),
    description: "브랜드 PC 및 부품별 번거로운 AS 절차와 부품 구매를 부컴이 대신 빠르고 정확하게 처리해 드립니다.",
    tags: ["삼성/LG", "델/HP", "부품구매"]
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "데스크탑 전문 수리",
    href: servicePath("computer-repair"),
    description: "부팅 불량, 전원 고장, 블루스크린 등 모든 데스크탑 하드웨어 및 소프트웨어 고장 수리.",
    tags: ["메인보드", "그래픽카드", "파워교체"]
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "데이터 정밀 복구",
    href: servicePath("data-recovery"),
    description: "삭제된 파일, 포맷된 하드, 인식 불량 외장하드 등 소중한 데이터를 정밀 장비로 복원.",
    tags: ["HDD/SSD", "USB", "NAS복구"]
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "OS설치 및 최적화",
    href: servicePath("computer-repair"),
    description: "Windows 10/11 정품 설치, 드라이버 세팅 및 시스템 속도 향상을 위한 최적화 서비스.",
    tags: ["윈도우설치", "드라이버", "속도개선"]
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    title: "네트워크 및 NAS/CCTV 구축",
    href: servicePath("nas-network"),
    description: "사무실 랜공사, NAS 데이터 서버 구축, CCTV 보안 시스템 설치 및 기업용 네트워크 최적화 서비스.",
    tags: ["랜공사", "NAS설치", "CCTV설치", "기업보안"]
  },
  {
    icon: <Laptop className="w-6 h-6" />,
    title: "노트북 수리",
    href: servicePath("computer-repair"),
    description: "액정 파손, 키보드 교체, 배터리 수명 문제 및 노트북 내부 청소/서멀 재도포 서비스.",
    tags: ["액정교체", "배터리", "맥북수리"]
  }
];

const STEPS = [
  { 
    number: "01", 
    title: "전화·카톡 상담", 
    desc: "전화나 카카오톡으로 증상을 알려 주세요. 사진 한두 장만 보내 주셔도 어떤 상태인지 먼저 봐 드립니다.",
    image: "/steps/01-contact.jpg"
  },
  { 
    number: "02", 
    title: "방문 및 진단", 
    desc: "10년 경력 엔지니어가 직접 방문해 본체를 열고 부품을 하나씩 점검해 정확한 원인을 찾습니다.",
    image: "/steps/02-diagnosis.jpg"
  },
  { 
    number: "03", 
    title: "견적 안내 후 수리", 
    desc: "원인과 비용을 먼저 안내해 드리고, 동의하신 경우에만 부품 교체와 수리를 진행합니다.",
    image: "/steps/03-repair.jpg"
  },
  { 
    number: "04", 
    title: "테스트 후 마무리", 
    desc: "메모리·그래픽·온도 테스트로 정상 작동을 확인한 뒤 마무리합니다.",
    image: "/steps/04-test.jpg"
  }
];

// 상단 띠에 흐르는 주요 작업 분야 (실제 접수 내역이 아닌 서비스 안내)
const TICKER_ITEMS = [
  "노트북 배터리·액정 교체",
  "윈도우 11 설치 및 최적화",
  "블루스크린·부팅 불량 수리",
  "사무실 네트워크 구축",
  "외장하드·SSD 데이터 복구",
  "조립 PC 견적 및 조립",
  "컴퓨터 전원 불량 수리",
  "사무용 PC 업그레이드",
  "랜섬웨어 감염 복구 상담",
  "CCTV 설치 및 점검",
  "기업용 NAS 서버 구축",
  "포스기 연동 장애 해결",
  "그래픽카드 서멀 재도포",
  "무선 와이파이 증폭기 설치",
  "SSD 교체 및 데이터 이전"
];

// CCTV 섹션: 씨메르 시공 현장 사진과 작업 내용 (블로그 발행 글 기준)
const CCTV_POINTS = [
  { icon: <Route className="w-5 h-5" />, title: "동선 기준 위치 설계", desc: "사람과 차가 드나드는 길을 따라 사각지대가 없도록 카메라 위치를 잡습니다." },
  { icon: <Cable className="w-5 h-5" />, title: "깔끔한 배선 마감", desc: "통신 단자함과 벽면을 따라 선을 정리해 밖으로 지저분하게 드러나지 않게 마감합니다." },
  { icon: <MonitorPlay className="w-5 h-5" />, title: "녹화기·모니터 세팅까지", desc: "녹화기 연결부터 분할 모니터 거치까지, 설치 당일 바로 화면을 확인할 수 있게 해 드립니다." }
];
const CCTV_PHOTOS = [
  { src: "/cctv/survey.jpg", caption: "시공 전 현장 실측" },
  { src: "/cctv/dome-camera.jpg", caption: "필로티 천장 돔 카메라" },
  { src: "/cctv/cabinet.jpg", caption: "단자함 내부 배선 정리" },
  { src: "/cctv/monitor.jpg", caption: "엘리베이터 홀 분할 모니터" }
];
const CCTV_PLACES = ["빌라·공동주택", "상가·매장", "사무실", "주차장", "공장·창고"];

// 첫 화면 사진 슬라이드 (실제 수리 현장, 사람 없는 사진만)
const HERO_SLIDES = [
  { src: "/hero/01-power.jpg", caption: "파워 교체 후 정상 작동" },
  { src: "/hero/02-nude-test.jpg", caption: "전원 꺼짐 점검 · 누드 테스트" },
  { src: "/hero/03-cleaning.jpg", caption: "컴퓨터 청소 전 · 후" },
  { src: "/hero/04-board.jpg", caption: "메인보드 교체" },
  { src: "/hero/05-nas.jpg", caption: "시놀로지 NAS 설치" }
];
const HERO_SLIDE_MS = 4500;

// 수리·취급 가능 브랜드 (제휴 관계를 뜻하지 않음)
const BRANDS = [
  "SAMSUNG", "LG", "APPLE", "MICROSOFT", "INTEL", "AMD", "NVIDIA", "ASUS",
  "MSI", "LENOVO", "DELL", "HP", "ACER", "GIGABYTE", "RAZER", "LOGITECH"
];


// website: 봇 차단용 숨김 필드(사람은 비워 둠)
const EMPTY_FORM = { name: "", phone: "", address: "", description: "", website: "" };

const LegalModal = ({ isOpen, onClose, title, content }: { isOpen: boolean, onClose: () => void, title: string, content: string }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <button 
              aria-label="닫기"
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
          <div className="p-8 overflow-y-auto prose prose-slate max-w-none">
            <div className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm">
              <Markdown>{content}</Markdown>
            </div>
          </div>
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
            >
              확인
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Logo = ({ size = "text-2xl", className = "" }: { size?: string, className?: string }) => (
  <div className={`flex items-center tracking-tighter font-sans ${className}`}>
    <span className={`font-light text-slate-900 ${size}`}>BU</span>
    <span className={`ml-1 px-1.5 py-0.5 font-bold bg-slate-900 text-white ${size}`}>COM_</span>
  </div>
);

const HeroSlideshow = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // 움직임 줄이기 설정을 켠 사용자에게는 자동으로 넘기지 않음
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setIndex(i => (i + 1) % HERO_SLIDES.length), HERO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-3xl bg-slate-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {HERO_SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={`부컴 실제 수리 현장 - ${slide.caption}`}
          width={800}
          height={1000}
          fetchPriority={i === 0 ? "high" : "low"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== index}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
      <div className="absolute left-4 right-4 bottom-4">
        <div className="inline-block px-4 py-2 rounded-xl bg-slate-900/80 text-white text-xs font-bold backdrop-blur" aria-live="polite">
          실제 수리 현장 · {HERO_SLIDES[index].caption}
        </div>
      </div>
      {/* 오른쪽 아래는 떠 있는 상담 버튼과 겹쳐서 점은 오른쪽 위에 둠 */}
      <div className="absolute top-4 right-4 px-3 py-2 rounded-full bg-slate-900/40 backdrop-blur">
        <div className="flex gap-1.5">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`${i + 1}번째 사진 보기: ${slide.caption}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ServiceTicker = ({ scrolled }: { scrolled: boolean }) => (
  <div className={`fixed left-0 w-full z-[50] transition-all duration-500 overflow-hidden border-b border-slate-100 bg-white/95 backdrop-blur-md ${scrolled ? 'top-[64px]' : 'top-[88px]'}`}>
    <div className="flex items-center h-10">
      <div className="bg-slate-900 text-white px-5 h-full flex items-center text-xs font-black uppercase tracking-widest shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.15)]">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2.5" />
        주요 출장 서비스
      </div>
      <div className="flex gap-16 animate-marquee-left whitespace-nowrap items-center px-8">
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="text-[11px] font-extrabold text-slate-900">{item}</span>
            <div className="w-px h-3 bg-slate-100" />
            <span className="text-[11px] font-bold text-slate-500">{BUSINESS.serviceArea} 출장</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function App({ path = "/" }: { path?: string }) {
  const route = resolveRoute(path);
  const isHome = route.type === "home";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 메뉴 링크(/#services 등): 홈에서는 부드럽게 스크롤, 다른 페이지에서는 홈으로 이동
  const goToSection = (e: React.MouseEvent, id: string) => {
    setIsMenuOpen(false);
    const element = isHome ? document.getElementById(id) : null;
    if (!element) return;
    e.preventDefault();
    element.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // ESC 키로 열린 창(문의·약관·메뉴) 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsFormOpen(false);
      setIsTermsOpen(false);
      setIsPrivacyOpen(false);
      setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (isFormOpen) track('open_inquiry_form');
  }, [isFormOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setSubmitStatus("success");
        track('submit_inquiry');
        alert("문의 접수가 되었습니다.");
        setFormData(EMPTY_FORM);
        setTimeout(() => {
          setIsFormOpen(false);
          setSubmitStatus("idle");
        }, 2000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.message || "접수 중 오류가 발생했습니다. 전화로 문의해 주세요.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setErrorMessage("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand/10 selection:text-brand">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[60] transition-all duration-500 ${scrolled ? 'glass py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="/" aria-label="부컴 홈" className="flex items-center group">
            <Logo size="text-2xl" className="group-hover:scale-105 transition-transform" />
          </a>

            <div className="hidden lg:flex items-center gap-7 xl:gap-10">
            {[
              { id: 'services', label: '서비스 안내' },
              { id: 'cctv', label: 'CCTV 설치' },
              { id: 'guarantee', label: '비용 안내' },
              { id: 'process', label: '이용 절차' },
              { id: 'cases', label: '시공 사례' },
            ].map((item) => (
              <a 
                key={item.id}
                href={`/#${item.id}`}
                onClick={(e) => goToSection(e, item.id)} 
                className="text-sm font-semibold text-slate-500 hover:text-brand transition-colors tracking-wider whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
            <a 
              href={BUSINESS.blogUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold text-slate-500 hover:text-brand transition-colors tracking-wider whitespace-nowrap"
            >
              공식 블로그
            </a>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-brand transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              수리 문의
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2 text-slate-900" aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <ServiceTicker scrolled={scrolled} />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm lg:hidden"
            />
            {/* Menu Content */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] z-[80] bg-white lg:hidden shadow-2xl flex flex-col"
            >
              {/* Menu Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <Logo size="text-xl" />
                <button 
                  aria-label="닫기"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'services', label: '서비스 안내', icon: Zap },
                    { id: 'cctv', label: 'CCTV 설치', icon: Cctv },
                    { id: 'guarantee', label: '비용 안내', icon: Banknote },
                    { id: 'process', label: '이용 절차', icon: Clock },
                    { id: 'cases', label: '시공 사례', icon: Users },
                  ].map((item) => (
                    <a 
                      key={item.id}
                      href={`/#${item.id}`}
                      onClick={(e) => goToSection(e, item.id)} 
                      className="flex items-center gap-4 w-full text-lg font-bold text-slate-700 text-left py-4 px-4 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-all"
                    >
                      <item.icon className="w-5 h-5 text-brand/50" />
                      {item.label}
                    </a>
                  ))}
                  
                  <a 
                    href={BUSINESS.blogUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 w-full text-lg font-bold text-slate-700 text-left py-4 px-4 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-all"
                  >
                    <MessageSquare className="w-5 h-5 text-brand/50" />
                    공식 블로그
                  </a>

                  <div className="h-px bg-slate-50 my-4" />

                  <button 
                    onClick={() => { setIsTermsOpen(true); setIsMenuOpen(false); }}
                    className="text-sm font-bold text-slate-400 text-left py-3 px-4 hover:text-brand transition-colors"
                  >
                    이용약관
                  </button>
                  <button 
                    onClick={() => { setIsPrivacyOpen(true); setIsMenuOpen(false); }}
                    className="text-sm font-bold text-slate-400 text-left py-3 px-4 hover:text-brand transition-colors"
                  >
                    개인정보처리방침
                  </button>
                </div>
              </div>

              {/* Menu Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
                <a 
                  href={BUSINESS.kakaoUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FEE500] text-[#191919] py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
                >
                  <KakaoIcon className="w-5 h-5" />
                  카카오톡 상담
                </a>
                <button 
                  onClick={() => {
                    setIsFormOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="bg-brand text-white py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-lg shadow-brand/20 active:scale-[0.98] transition-transform"
                >
                  <MessageSquare className="w-5 h-5" />
                  수리문의하기
                </button>
                <p className="text-center text-xs text-slate-400 mt-2 font-bold tracking-widest uppercase">
                  {BUSINESS.hours}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {isHome ? (<>
      {/* Hero Section */}
      <section id="hero" className="relative pt-48 pb-20 lg:pt-64 lg:pb-40 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 hidden lg:block" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* 첫 화면 글자는 검색엔진이 읽을 수 있도록 투명 효과 없이 위치만 움직임 */}
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand/5 text-brand text-xs font-bold uppercase tracking-[0.2em] mb-8 border border-brand/10">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                {BUSINESS.serviceArea} 출장 전문
              </div>
              <p className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter mb-10 text-balance">
                FAST REPAIR,<br />
                <span className="text-brand italic font-serif font-bold">Perfect</span> RESULT.
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
                부산 컴퓨터 출장수리 · CCTV 설치, 부컴
              </h1>
              <p className="text-lg text-slate-500 mb-12 max-w-xl leading-relaxed font-medium">
                {BUSINESS.serviceArea} 어디든 10년 경력 엔지니어가 직접 방문합니다.<br />
                컴퓨터 수리·조립PC·데이터 복구부터 네트워크·NAS·CCTV 설치까지 한 번에 해결해 드립니다.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex flex-col gap-4 w-full sm:w-auto">
                  <a 
                    href={BUSINESS.kakaoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#FEE500] text-[#191919] px-10 py-5 rounded-2xl text-lg font-black hover:bg-[#F7E600] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                  >
                    <KakaoIcon className="w-6 h-6" />
                    카카오톡 실시간 상담
                  </a>
                  <a href={`tel:${BUSINESS.phone}`} className="group bg-brand text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-brand/20">
                    <Phone className="w-6 h-6" />
                    전화 상담하기
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
                <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-slate-600">
                    <span className="text-slate-900">10년 경력</span> 엔지니어 직접 방문<br />
                    <span className="text-slate-400">출장비 10,000원 · 수리 시 면제</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <HeroSlideshow />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-xs font-bold text-brand tracking-[0.4em] uppercase mb-6">전문 기술 분야</h2>
              <h3 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9]">
                모든 기술적 난제,<br />
                <span className="text-slate-300">우리가 해결합니다.</span>
              </h3>
            </div>
            <p className="text-slate-500 text-lg max-w-sm leading-relaxed">
              단순한 수리를 넘어, 고객의 소중한 자산과 데이터를 보호하는 최상의 기술 서비스를 지향합니다.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border border-slate-100 rounded-[3rem] overflow-hidden">
            {SERVICES.map((service, index) => (
              <div 
                key={index}
                className="group relative p-12 bg-white hover:bg-slate-50 transition-all duration-500"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 text-brand mb-10 group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                    <a href={service.href} className="after:absolute after:inset-0 hover:text-brand transition-colors">{service.title}</a>
                  </h4>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">{service.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map(tag => (
                      <span key={tag} className="text-[11px] font-bold px-2 py-1 bg-slate-50 text-slate-400 rounded uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CCTV Section */}
      <section id="cctv" className="py-32 lg:py-40 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-xs font-bold text-brand tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
              <Cctv className="w-4 h-4" />
              CCTV 설치 · 시공
            </h2>
            <h3 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tighter mb-8">
              부산 CCTV 설치,<br />
              <span className="text-slate-500">동선을 따라 설계합니다.</span>
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl">
              카메라만 달고 끝내지 않습니다. 현장을 직접 보고 드나드는 길을 따라 위치를 잡고,
              배선 정리부터 녹화기·모니터 세팅까지 한 번에 마무리합니다.
            </p>

            <div className="space-y-6 mb-10">
              {CCTV_POINTS.map(point => (
                <div key={point.title} className="flex gap-5">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-brand flex items-center justify-center shrink-0">
                    {point.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{point.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {CCTV_PLACES.map(place => (
                <span key={place} className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  {place}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={BUSINESS.kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FEE500] text-[#191919] px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#F7E600] transition-colors"
              >
                <KakaoIcon className="w-5 h-5" />
                카톡으로 현장 사진 보내고 상담
              </a>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
              >
                <Phone className="w-5 h-5" />
                {BUSINESS.phone}
              </a>
            </div>

            <p className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed max-w-xl">
              <Info className="w-4 h-4 shrink-0 mt-px" />
              매장·주차장처럼 여러 사람이 드나드는 곳에 CCTV를 달면 개인정보 보호법에 따라 촬영 목적·범위·관리자 연락처를 적은 안내판을 붙여야 합니다.
            </p>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              {CCTV_PHOTOS.map(photo => (
                <figure key={photo.src} className="relative aspect-square rounded-3xl overflow-hidden bg-slate-800">
                  <img
                    src={photo.src}
                    alt={`부산 수영구 CCTV 설치 현장 - ${photo.caption}`}
                    loading="lazy"
                    width={700}
                    height={700}
                    className="w-full h-full object-cover"
                  />
                  <figcaption className="absolute left-3 bottom-3 px-3 py-1.5 rounded-lg bg-slate-900/80 text-[11px] font-bold">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <a
                href={casePath("suyeong-cctv")}
                className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <span>
                  <span className="block text-xs font-bold text-brand mb-1">시공 사례 · 부산 수영구</span>
                  <span className="block font-bold">씨메르 필로티 주차장 CCTV</span>
                </span>
                <ArrowUpRight className="w-5 h-5 shrink-0" />
              </a>
              <a
                href={servicePath("cctv")}
                className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <span>
                  <span className="block text-xs font-bold text-brand mb-1">서비스 안내</span>
                  <span className="block font-bold">부산 CCTV 설치 자세히 보기</span>
                </span>
                <ArrowUpRight className="w-5 h-5 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="py-24 border-y border-slate-100 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400 mb-3">수리·취급 가능 브랜드</h2>
            <div className="w-16 h-1 bg-brand mx-auto rounded-full opacity-30" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {BRANDS.map(brand => (
              <span key={brand} className="px-5 py-3 bg-white rounded-xl shadow-sm border border-slate-100 text-xs font-black tracking-widest text-slate-500">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4대 안심 약속 Section */}
      <section id="guarantee" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-xs font-bold text-brand tracking-[0.4em] uppercase mb-6">비용 안내</h2>
            <h3 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9]">비용은 미리,<br /><span className="text-slate-300">투명하게.</span></h3>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8" />,
                title: "10년 경력 엔지니어",
                desc: "단순 알바생이 아닙니다. 10년 경력의 베테랑 엔지니어가 직접 방문하여 책임지고 수리합니다."
              },
              {
                icon: <ClipboardCheck className="w-8 h-8" />,
                title: "수리 전 견적 안내 필수",
                desc: "수리 전 견적 안내는 필수입니다. 고객님의 동의 없이는 단 1원도 청구하지 않습니다."
              },
              {
                icon: <Banknote className="w-8 h-8" />,
                title: "거품 뺀 정직한 공임",
                desc: "거품을 뺀 정직한 공임으로 운영됩니다. 점검 후 원인에 맞는 가장 합리적인 비용만 안내합니다."
              },
              {
                icon: <History className="w-8 h-8" />,
                title: `${BUSINESS.warrantyDays}일 무상 A/S`,
                desc: `수리 완료일로부터 ${BUSINESS.warrantyDays}일 이내 동일 부위에 같은 증상이 다시 생기면 무상으로 다시 수리해 드립니다.`
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-brand/20 hover:bg-white hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              {
                title: "출장비",
                price: "10,000원",
                note: "수리를 진행하시면 출장비는 받지 않습니다.",
                detail: `${BUSINESS.serviceArea} 전 지역`
              },
              {
                title: "컴퓨터 청소",
                price: "기본 55,000원",
                note: "팬·쿨러를 떼어 따로 청소하고 CPU 서멀구리스 재도포까지 진행합니다.",
                detail: "오염도·작업 난이도에 따라 추가 비용이 생길 수 있고, 청소가 불가능할 만큼 오염이 심하면 케이스 교체를 안내해 드립니다."
              },
              {
                title: "수리 · 설치",
                price: "점검 후 견적",
                note: "부품 교체, 윈도우 설치, 데이터 복구, 네트워크·NAS·CCTV 설치 등",
                detail: "증상과 필요한 부품에 따라 달라서, 점검 후 비용을 먼저 안내하고 동의하신 경우에만 진행합니다."
              }
            ].map(item => (
              <div key={item.title} className="p-8 rounded-[2rem] border border-slate-100 bg-white flex flex-col">
                <div className="text-sm font-bold text-slate-500 mb-2">{item.title}</div>
                <div className="text-3xl font-black text-slate-900 tracking-tight mb-4">{item.price}</div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed mb-3">{item.note}</p>
                <p className="text-xs text-slate-500 leading-relaxed mt-auto">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-3xl bg-brand/5 border border-brand/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center shadow-lg shadow-brand/20 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-900">
                정확한 비용은 점검 후, 수리 전에 먼저 안내해 드립니다.
              </p>
            </div>
            <a href={BUSINESS.kakaoUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-brand transition-colors shadow-xl whitespace-nowrap">
              카톡으로 비용 문의
            </a>
          </div>
        </div>
      </section>

      {/* Process Section - Editorial Style (Recipe 9 inspired) */}
      <section id="process" className="py-40 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-8">
            <div className="max-w-xl">
              <h2 className="text-xs font-bold text-brand tracking-[0.4em] uppercase mb-6">서비스 진행 과정</h2>
              <h3 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9]">확실한 프로세스,<br /><span className="text-slate-300 italic font-serif">Trust the Step.</span></h3>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {STEPS.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="relative group"
              >
                {/* Oversized Number Background */}
                <div className="absolute -top-16 -left-4 text-[160px] font-serif font-bold text-slate-200/50 leading-none select-none group-hover:text-brand/10 transition-colors duration-700">
                  {step.number}
                </div>
                
                <div className="relative pt-12">
                  <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 shadow-2xl shadow-slate-200/50">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{step.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { label: "전문 엔지니어 경력", value: "10년+", icon: <Wrench /> },
              { label: "출장비 (수리 시 면제)", value: "10,000원", icon: <Banknote /> },
              { label: "무상 A/S 기간", value: `${BUSINESS.warrantyDays}일`, icon: <ShieldCheck /> }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex p-4 bg-slate-50 rounded-2xl text-brand mb-8 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                  {stat.icon}
                </div>
                <div className="text-6xl font-black text-slate-900 mb-3 tracking-tighter">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Section - 블로그 실제 현장 사례 */}
      <section id="cases" className="py-40 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
            <div className="max-w-xl">
              <h2 className="text-xs font-bold text-brand tracking-[0.4em] uppercase mb-6">현장 시공 사례</h2>
              <h3 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9]">직접 다녀온<br /><span className="text-slate-300">현장 이야기.</span></h3>
            </div>
            <a
              href={BUSINESS.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 bg-white rounded-2xl border border-slate-100 text-sm font-bold text-slate-700 hover:text-brand hover:border-brand/20 transition-colors"
            >
              블로그에서 사례 더 보기
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CASE_PAGES.map(item => (
              <CaseCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Split Layout Style */}
      <section id="contact" className="py-40 bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <div className="text-brand text-xs font-bold uppercase tracking-[0.4em] mb-8">정직한 기술, 확실한 해결</div>
            <h2 className="text-6xl md:text-8xl font-black text-white mb-12 tracking-tighter leading-[0.85]">
              당신의<br /> 소중한 일상,<br />
              <span className="text-brand">다시 완벽하게</span><br />
              시작하세요.
            </h2>
          </div>
          <div className="flex flex-col gap-8">
            <a href={`tel:${BUSINESS.phone}`} className="group bg-brand text-white px-12 py-8 rounded-[2rem] text-3xl font-black hover:bg-white hover:text-brand transition-all flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-6">
                <Phone className="w-10 h-10" />
                {BUSINESS.phone}
              </div>
              <ArrowUpRight className="w-10 h-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
            </a>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-12 py-8 rounded-[2rem] text-xl font-bold hover:bg-white/10 transition-all text-left flex items-center justify-between"
            >
              <span>온라인 예약 상담하기</span>
              <ChevronRight className="w-6 h-6" />
            </button>
            <p className="text-white/30 font-mono text-xs uppercase tracking-[0.3em]">{BUSINESS.serviceArea} 신속 출장 · {BUSINESS.hours}</p>
          </div>
        </div>
      </section>

      </>) : (
        <SubPage route={route} openForm={() => setIsFormOpen(true)} />
      )}

      {/* Footer */}
      <footer className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-16 mb-20">
            <div className="md:col-span-5">
              <Logo size="text-2xl" className="mb-8" />
              <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed">
                부컴은 10년 경력의 베테랑 엔지니어가 직접 운영하는 부산 컴퓨터 출장수리 · CCTV 설치 전문 업체입니다.
                정직한 진단, 투명한 서비스, 완벽한 기술력으로 고객님의 디지털 라이프를 지킵니다.
              </p>
            </div>
            
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">바로가기</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400">
                  <li><a href="/#services" onClick={(e) => goToSection(e, 'services')} className="hover:text-brand transition-colors">서비스 안내</a></li>
                  <li><a href="/#cctv" onClick={(e) => goToSection(e, 'cctv')} className="hover:text-brand transition-colors">CCTV 설치</a></li>
                  <li><a href="/#guarantee" onClick={(e) => goToSection(e, 'guarantee')} className="hover:text-brand transition-colors">비용 안내</a></li>
                  <li><a href="/#process" onClick={(e) => goToSection(e, 'process')} className="hover:text-brand transition-colors">이용 절차</a></li>
                  <li><a href="/#cases" onClick={(e) => goToSection(e, 'cases')} className="hover:text-brand transition-colors">시공 사례</a></li>
                  <li><a href={BUSINESS.blogUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">공식 블로그</a></li>
                  <li><a href={BLOG_PATH} className="hover:text-brand transition-colors">블로그 글 목록</a></li>
                  <li><button onClick={() => setIsTermsOpen(true)} className="hover:text-brand transition-colors cursor-pointer">이용약관</button></li>
                  <li><button onClick={() => setIsPrivacyOpen(true)} className="hover:text-brand transition-colors cursor-pointer">개인정보처리방침</button></li>
                </ul>
              </div>
              
              <div className="col-span-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">서비스 안내</h4>
                <ul className="space-y-6 text-sm font-bold text-slate-500">
                  <li className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-brand shrink-0" />
                    <span>{BUSINESS.serviceArea} 전지역 출장 가능</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-brand shrink-0" />
                    <span>{BUSINESS.phone}</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-brand shrink-0" />
                    <span>{BUSINESS.hours}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 mb-16 text-sm">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-5">서비스</h4>
              <ul className="space-y-3 font-bold text-slate-400">
                {SERVICE_PAGES.map(sp => (
                  <li key={sp.slug}><a href={servicePath(sp.slug)} className="hover:text-brand transition-colors">{sp.title}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-5">출장 지역</h4>
              <ul className="flex flex-wrap gap-x-4 gap-y-3 font-bold text-slate-400">
                {AREA_PAGES.map(ap => (
                  <li key={ap.slug}><a href={areaPath(ap.slug)} className="hover:text-brand transition-colors">{ap.name} 컴퓨터수리</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-5">시공 사례</h4>
              <ul className="space-y-3 font-bold text-slate-400">
                {CASE_PAGES.map(cp => (
                  <li key={cp.slug}><a href={casePath(cp.slug)} className="hover:text-brand transition-colors">{cp.area} · {cp.category}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <p className="normal-case tracking-normal text-[11px] leading-relaxed text-center md:text-left">
              {[
                `상호: ${BUSINESS.name}`,
                BUSINESS.owner && `대표: ${BUSINESS.owner}`,
                BUSINESS.bizNumber && `사업자등록번호: ${BUSINESS.bizNumber}`,
                BUSINESS.address && `주소: ${BUSINESS.address}`,
                `전화: ${BUSINESS.phone}`,
                BUSINESS.email && `이메일: ${BUSINESS.email}`,
              ].filter(Boolean).join(' | ')}
            </p>
            <p>© 2026 BUCOM COMPUTER SERVICE. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>

      {/* Legal Modals */}
      <LegalModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)} 
        title="이용약관" 
        content={TERMS_OF_SERVICE} 
      />
      <LegalModal 
        isOpen={isPrivacyOpen} 
        onClose={() => setIsPrivacyOpen(false)} 
        title="개인정보처리방침" 
        content={PRIVACY_POLICY} 
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-end">
        <motion.a 
          href={BUSINESS.kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          aria-label="카카오톡 실시간 상담"
          className="bg-[#FEE500] text-[#191919] w-16 h-16 rounded-2xl shadow-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative"
        >
          <KakaoIcon className="w-8 h-8" />
          <span className="absolute right-full mr-4 bg-[#FEE500] text-[#191919] px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            카카오톡 실시간 상담
          </span>
        </motion.a>

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <button 
            onClick={() => setIsFormOpen(true)}
            aria-label="수리 문의하기"
            className="bg-brand text-white w-16 h-16 rounded-2xl shadow-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative"
          >
            <MessageSquare className="w-8 h-8" />
            <span className="absolute right-full mr-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              수리 문의하기
            </span>
          </button>
        </motion.div>
      </div>

      {/* Customer Info Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative z-10"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">수리 문의 접수</h2>
                    <p className="text-slate-500 text-sm font-medium">정보를 입력하시면 담당자가 즉시 연락드립니다.</p>
                  </div>
                  <button 
                    aria-label="닫기"
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="inquiry-name" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">이름</label>
                    <input 
                      required
                      type="text"
                      maxLength={30}
                      placeholder="성함을 입력해주세요"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-brand transition-all outline-none"
                      id="inquiry-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="inquiry-phone" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">연락처</label>
                    <input 
                      required
                      type="tel"
                      inputMode="tel"
                      pattern="[0-9\-\s]{9,15}"
                      title="숫자와 - 만 입력해 주세요"
                      placeholder="010-0000-0000"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-brand transition-all outline-none"
                      id="inquiry-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="inquiry-address" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">주소</label>
                    <input 
                      required
                      type="text"
                      maxLength={200}
                      placeholder="수리를 받을 주소를 입력해 주세요"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-brand transition-all outline-none"
                      id="inquiry-address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="inquiry-description" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">증상 및 요청사항</label>
                    <textarea 
                      rows={3}
                      maxLength={1000}
                      placeholder="수리가 필요한 증상을 간단히 적어주세요"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-brand transition-all outline-none resize-none"
                      id="inquiry-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* 봇 차단용 숨김 필드 */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />

                  <button 
                    disabled={isSubmitting}
                    className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 ${
                      submitStatus === "success" ? "bg-green-500" : 
                      submitStatus === "error" ? "bg-red-500" : 
                      "bg-brand hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : submitStatus === "success" ? (
                      <>
                        <CheckCircle2 className="w-6 h-6" />
                        접수 완료
                      </>
                    ) : submitStatus === "error" ? (
                      <span className="text-sm">{errorMessage}</span>
                    ) : (
                      <>
                        문의하기
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
