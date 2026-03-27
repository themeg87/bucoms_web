/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  Apple,
  Settings,
  Zap,
  Award,
  Users,
  MessageSquare,
  ArrowUpRight,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from './constants/legal';
import Markdown from 'react-markdown';

const SERVICES = [
  {
    icon: <Monitor className="w-6 h-6" />,
    title: "데스크탑 판매",
    description: "사무용부터 하이엔드 게이밍 PC까지, 용도에 맞는 최적의 데스크탑 판매 및 맞춤 상담.",
    tags: ["사무용", "게이밍", "워크스테이션"],
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1200"
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "조립",
    description: "부품 선정부터 깔끔한 선 정리까지, 전문가의 손길로 완성되는 고성능 커스텀 조립 PC.",
    tags: ["커스텀PC", "선정리", "성능테스트"],
    image: "https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=80&w=1200"
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "AS대행/부품구매대행",
    description: "브랜드 PC 및 부품별 번거로운 AS 절차와 부품 구매를 부컴이 대신 빠르고 정확하게 처리해 드립니다.",
    tags: ["삼성/LG", "델/HP", "부품구매"],
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200"
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "데스크탑 전문 수리",
    description: "부팅 불량, 전원 고장, 블루스크린 등 모든 데스크탑 하드웨어 및 소프트웨어 고장 수리.",
    tags: ["메인보드", "그래픽카드", "파워교체"],
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=1200"
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "데이터 정밀 복구",
    description: "삭제된 파일, 포맷된 하드, 인식 불량 외장하드 등 소중한 데이터를 정밀 장비로 복원.",
    tags: ["HDD/SSD", "USB", "NAS복구"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200"
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "OS설치 및 최적화",
    description: "Windows 10/11 정품 설치, 드라이버 세팅 및 시스템 속도 향상을 위한 최적화 서비스.",
    tags: ["윈도우설치", "드라이버", "속도개선"],
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=1200"
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    title: "네트워크 및 NAS/CCTV 구축",
    description: "사무실 랜공사, NAS 데이터 서버 구축, CCTV 보안 시스템 설치 및 기업용 네트워크 최적화 서비스.",
    tags: ["랜공사", "NAS설치", "CCTV설치", "기업보안"],
    image: "https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?auto=format&fit=crop&q=80&w=1200"
  },
  {
    icon: <Laptop className="w-6 h-6" />,
    title: "노트북 수리",
    description: "액정 파손, 키보드 교체, 배터리 수명 문제 및 노트북 내부 청소/서멀 재도포 서비스.",
    tags: ["액정교체", "배터리", "맥북수리"],
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=1200"
  }
];

const STEPS = [
  { 
    number: "01", 
    title: "상담 접수", 
    desc: "컴퓨터 전문 상담원이 고객님의 문의를 정성껏 접수하여 최적의 해결책을 안내합니다.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
  },
  { 
    number: "02", 
    title: "기사 배정", 
    desc: "접수된 내용을 바탕으로 고객님의 문제를 가장 잘 해결해 드릴 베테랑 엔지니어를 즉시 배정합니다.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800"
  },
  { 
    number: "03", 
    title: "방문 및 진단", 
    desc: "전문 엔지니어가 직접 방문하여 컴퓨터 본체를 열고 정밀 장비로 꼼꼼하게 점검하여 정확한 원인을 진단합니다.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800"
  },
  { 
    number: "04", 
    title: "수리 완료", 
    desc: "수리 완료 후 정상 작동하는 컴퓨터를 보며 환하게 웃으시는 고객님의 모습이 저희 부컴의 가장 큰 보람입니다.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
  }
];

const STATUS_POOL = [
  { area: "부산 해운대구", service: "맥북 프로 배터리 교체", time: "방금 전" },
  { area: "울산 남구", service: "윈도우 11 최적화 및 설치", time: "1분 전" },
  { area: "김해 삼계동", service: "게이밍 PC 블루스크린 수리", time: "3분 전" },
  { area: "양산 물금읍", service: "사무실 네트워크 공유 설정", time: "5분 전" },
  { area: "부산 부산진구", service: "외장하드 데이터 복구", time: "7분 전" },
  { area: "울산 중구", service: "노트북 액정 파손 수리", time: "10분 전" },
  { area: "김해 내동", service: "아이맥 부팅 불량 수리", time: "12분 전" },
  { area: "양산 덕계동", service: "조립 PC 견적 및 조립", time: "15분 전" },
  { area: "부산 동래구", service: "컴퓨터 전원 불량 수리", time: "18분 전" },
  { area: "울산 북구", service: "사무용 PC 업그레이드", time: "20분 전" },
  { area: "김해 장유동", service: "노트북 힌지 파손 수리", time: "22분 전" },
  { area: "양산 평산동", service: "랜섬웨어 감염 복구 상담", time: "25분 전" }
];

const PARTNERS = [
  { name: "SAMSUNG", domain: "samsung.com" },
  { name: "LG", domain: "lg.com" },
  { name: "APPLE", domain: "apple.com" },
  { name: "MICROSOFT", domain: "microsoft.com" },
  { name: "INTEL", domain: "intel.com" },
  { name: "AMD", domain: "amd.com" },
  { name: "NVIDIA", domain: "nvidia.com" },
  { name: "ASUS", domain: "asus.com" },
  { name: "MSI", domain: "msi.com" },
  { name: "LENOVO", domain: "lenovo.com" },
  { name: "DELL", domain: "dell.com" },
  { name: "HP", domain: "hp.com" },
  { name: "ACER", domain: "acer.com" },
  { name: "GIGABYTE", domain: "gigabyte.com" },
  { name: "RAZER", domain: "razer.com" },
  { name: "LOGITECH", domain: "logitech.com" },
];

const REVIEWS = [
  { 
    name: "부산 동래구 럭키아파트 김XX 고객님", 
    content: "중요한 프로젝트 마감 직전에 서버가 멈춰서 정말 당황했는데, 부컴 기사님이 20분 만에 도착해서 메인보드 문제를 바로 해결해 주셨습니다. 전문성이 차원이 다릅니다." 
  },
  { 
    name: "부산 연제구 거제동 카페XX 이XX 사장님", 
    content: "포스기가 갑자기 안 돼서 영업에 차질이 생길 뻔했는데, 전화 한 통에 바로 달려와 주셨어요. 덕분에 점심 장사 무사히 마쳤습니다. 정말 감사합니다!" 
  },
  { 
    name: "부산 해운대구 센텀시티 IT회사 박XX 대리님", 
    content: "사무실 PC 5대가 동시에 네트워크 오류가 나서 업무가 마비됐었는데, 부컴 기술진분들이 오셔서 체계적으로 원인 파악하고 한 시간 만에 복구해 주셨습니다. 역시 베테랑이시네요." 
  },
  { 
    name: "부산 금정구 구서동 롯데캐슬 최XX 고객님", 
    content: "아이들 온라인 수업 중에 노트북이 꺼져서 급하게 불렀는데, 친절하게 설명해 주시고 먼지 청소까지 서비스로 해주셨어요. 믿고 맡길 수 있는 곳입니다." 
  },
  { 
    name: "부산 수영구 광안동 식당XX 정XX 사장님", 
    content: "CCTV 녹화기가 고장 나서 걱정했는데, 부품 교체 없이 간단한 세팅만으로 고쳐주셔서 수리비도 아끼고 정말 정직하게 장사하신다는 느낌을 받았습니다." 
  },
  { 
    name: "부산 남구 대연동 디자인스튜디오 강XX 실장님", 
    content: "맥북 침수 때문에 공식 센터 갔더니 수리비가 새로 사는 값 나오더라고요. 부컴에서 정밀 세척이랑 부품 수리 받고 지금 1년째 아무 문제 없이 잘 쓰고 있습니다." 
  },
  { 
    name: "부산 부산진구 양정동 현대아파트 윤XX 고객님", 
    content: "컴퓨터가 너무 느려져서 새로 사야 하나 고민했는데, 업그레이드 추천해 주신 대로 하니 새 컴퓨터처럼 빨라졌어요. 과잉 진단 없이 딱 필요한 것만 짚어주시네요." 
  }
];

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

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(STATUS_POOL.slice(0, 4));
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Live Status Update Logic
    const interval = setInterval(() => {
      setCurrentStatus(prev => {
        const nextItem = STATUS_POOL[Math.floor(Math.random() * STATUS_POOL.length)];
        return [nextItem, ...prev.slice(0, 3)];
      });
    }, 7000); // Update every 7 seconds

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        alert("문의 접수가 되었습니다.");
        setFormData({ name: "", phone: "", address: "", description: "" });
        setTimeout(() => {
          setIsFormOpen(false);
          setSubmitStatus("idle");
        }, 2000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.message || "메시지 전송에 실패했습니다.");
        if (data.sheetsError) {
          alert(`구글 시트 오류: ${data.sheetsError}`);
        }
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
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <Logo size="text-2xl" className="group-hover:scale-105 transition-transform" />
          </div>

            <div className="hidden md:flex items-center gap-10">
            {['services', 'process', 'reviews'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item)} 
                className="text-sm font-semibold text-slate-500 hover:text-brand transition-colors tracking-wider"
              >
                {item === 'services' ? '서비스 안내' : item === 'process' ? '이용 절차' : '고객 후기'}
              </button>
            ))}
            <a 
              href="https://blog.naver.com/bucom_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold text-slate-500 hover:text-brand transition-colors tracking-wider"
            >
              공식 블로그
            </a>
            <button 
              onClick={() => setIsTermsOpen(true)}
              className="text-sm font-semibold text-slate-500 hover:text-brand transition-colors tracking-wider"
            >
              이용약관
            </button>
            <button 
              onClick={() => setIsPrivacyOpen(true)}
              className="text-sm font-semibold text-slate-500 hover:text-brand transition-colors tracking-wider"
            >
              개인정보처리방침
            </button>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-brand transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              긴급 문의
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

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
              className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm md:hidden"
            />
            {/* Menu Content */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] z-[70] bg-white md:hidden shadow-2xl flex flex-col"
            >
              {/* Menu Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <Logo size="text-xl" />
                <button 
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
                    { id: 'process', label: '이용 절차', icon: Clock },
                    { id: 'reviews', label: '고객 후기', icon: Users },
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => { scrollToSection(item.id); setIsMenuOpen(false); }} 
                      className="flex items-center gap-4 w-full text-lg font-bold text-slate-700 text-left py-4 px-4 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-all"
                    >
                      <item.icon className="w-5 h-5 text-brand/50" />
                      {item.label}
                    </button>
                  ))}
                  
                  <a 
                    href="https://blog.naver.com/bucom_" 
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
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <a href="tel:010-2222-0170" className="bg-brand text-white py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-lg shadow-brand/20 active:scale-[0.98] transition-transform">
                  <Phone className="w-5 h-5" />
                  지금 바로 전화하기
                </a>
                <p className="text-center text-[10px] text-slate-400 mt-4 font-bold tracking-widest uppercase">
                  24시간 긴급 수리 지원
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-40 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 hidden lg:block" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand/5 text-brand text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-brand/10">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                National No.1 Service
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter mb-10 text-balance">
                FAST REPAIR,<br />
                <span className="text-brand italic font-serif font-bold">Perfect</span> RESULT.
              </h1>
              <p className="text-lg text-slate-500 mb-12 max-w-xl leading-relaxed font-medium">
                부산·경남 지역 컴퓨터 출장 수리 전문 서비스 BUCOM.<br />
                지역 어디서나 신속한 방문 서비스, 10년 경력의 베테랑 엔지니어가 당신의 문제를 즉시 해결합니다.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <a href="tel:010-2222-0170" className="group bg-brand text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-brand/20">
                  <Phone className="w-6 h-6" />
                  상담 신청하기
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                        <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-bold text-slate-600">
                    <span className="text-slate-900">50,000+</span> 고객 이용 중
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
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-3xl group">
                <img 
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000" 
                  alt="High Performance Custom PC" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Floating Status Card - Recipe 1 Inspired */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -left-10 bg-slate-900 p-6 rounded-2xl shadow-3xl border border-white/10 hidden xl:block min-w-[240px]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500">실시간 수리 현황</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/30">v2.0.4</span>
                </div>
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {currentStatus.map((status, i) => (
                      <motion.div 
                        key={`${status.area}-${status.service}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex flex-col gap-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-white font-bold">{status.area}</span>
                          <span className="text-[8px] font-mono text-white/40 uppercase">{status.time}</span>
                        </div>
                        <div className="text-[11px] font-mono text-brand truncate">{status.service}</div>
                        <div className="h-px bg-white/5 mt-1" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="py-24 border-y border-slate-100 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400 mb-3">공식 파트너 및 부품 지원</h2>
            <div className="w-16 h-1 bg-brand mx-auto rounded-full opacity-30" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8 items-center justify-items-center">
            {PARTNERS.map(partner => (
              <div key={partner.name} className="flex flex-col items-center gap-4 group w-full max-w-[100px]">
                <div className="h-12 w-full flex items-center justify-center p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:shadow-md group-hover:border-brand/20 transition-all duration-500">
                  <img 
                    src={`https://logo.clearbit.com/${partner.domain}`} 
                    alt={partner.name} 
                    className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('google.com')) {
                        target.src = `https://www.google.com/s2/favicons?domain=${partner.domain}&sz=128`;
                      }
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-black tracking-widest text-slate-400 group-hover:text-brand transition-colors uppercase text-center">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                  <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{service.title}</h4>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">{service.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold px-2 py-1 bg-slate-50 text-slate-400 rounded uppercase tracking-wider">
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
              { label: "방문 수리 건수", value: "12,000+", icon: <Users /> },
              { label: "전문 엔지니어 경력", value: "20년+", icon: <Wrench /> },
              { label: "고객 만족도", value: "99.8%", icon: <Star /> }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex p-4 bg-slate-50 rounded-2xl text-brand mb-8 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                  {stat.icon}
                </div>
                <div className="text-6xl font-bold text-slate-900 mb-3 tracking-tighter font-serif italic">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section - Draggable Carousel */}
      <section id="reviews" className="py-40 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-xl">
              <h2 className="text-xs font-bold text-brand tracking-[0.4em] uppercase mb-6">고객 이용 후기</h2>
              <h3 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9]">고객이 증명하는<br /><span className="text-slate-300">압도적 실력.</span></h3>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-4">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" />)}
                </div>
                <span className="text-2xl font-black text-slate-900">4.9 / 5.0</span>
              </div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">12,000건 이상의 실제 후기 기반</p>
            </div>
          </div>
        </div>

        {/* Infinite Auto-Scrolling Carousel */}
        <div className="relative overflow-hidden py-10">
          <div className="flex gap-8 w-max animate-marquee-left">
            {/* Triple the reviews for absolute seamlessness on all screen sizes */}
            {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((review, i) => (
              <div 
                key={i}
                className="w-[350px] md:w-[500px] shrink-0"
              >
                <div className="bg-white p-12 md:p-16 rounded-[3rem] border border-slate-100 flex flex-col justify-between h-full group hover:border-brand/20 transition-all duration-700 shadow-xl shadow-slate-200/20 select-none">
                  <p className="text-xl md:text-2xl font-serif italic text-slate-800 leading-relaxed mb-12">"{review.content}"</p>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                      {review.name.split(' ').pop()?.[0] || '고'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{review.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">인증된 고객</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Gradient Overlays for smooth edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
        </div>
      </section>

      {/* CTA Section - Split Layout Style */}
      <section className="py-40 bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <div className="text-brand text-xs font-bold uppercase tracking-[0.4em] mb-8">정직한 기술, 확실한 해결</div>
            <h2 className="text-6xl md:text-8xl font-black text-white mb-12 tracking-tighter leading-[0.85]">
              당신의<br /> 소중한 일상,<br />
              <span className="text-brand italic font-serif font-bold">다시 완벽하게</span><br />
              시작하세요.
            </h2>
          </div>
          <div className="flex flex-col gap-8">
            <a href="tel:010-2222-0170" className="group bg-brand text-white px-12 py-8 rounded-[2rem] text-3xl font-black hover:bg-white hover:text-brand transition-all flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-6">
                <Phone className="w-10 h-10" />
                010-2222-0170
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
            <p className="text-white/30 font-mono text-[10px] uppercase tracking-[0.3em]">긴급 출장 지원 대응 시간: 30분 이내</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-16 mb-20">
            <div className="md:col-span-5">
              <Logo size="text-2xl" className="mb-8" />
              <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed">
                부컴은 10년 경력의 베테랑 엔지니어가 직접 운영하는 컴퓨터 전문 수리 서비스입니다. 
                정직한 진단, 투명한 서비스, 완벽한 기술력으로 고객님의 디지털 라이프를 지킵니다.
              </p>
            </div>
            
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">바로가기</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400">
                  <li><button onClick={() => scrollToSection('services')} className="hover:text-brand transition-colors cursor-pointer">서비스 안내</button></li>
                  <li><button onClick={() => scrollToSection('process')} className="hover:text-brand transition-colors cursor-pointer">이용 절차</button></li>
                  <li><button onClick={() => scrollToSection('reviews')} className="hover:text-brand transition-colors cursor-pointer">고객 후기</button></li>
                  <li><a href="https://blog.naver.com/bucom_" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">공식 블로그</a></li>
                  <li><button onClick={() => setIsTermsOpen(true)} className="hover:text-brand transition-colors cursor-pointer">이용약관</button></li>
                  <li><button onClick={() => setIsPrivacyOpen(true)} className="hover:text-brand transition-colors cursor-pointer">개인정보처리방침</button></li>
                </ul>
              </div>
              
              <div className="col-span-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">서비스 안내</h4>
                <ul className="space-y-6 text-sm font-bold text-slate-500">
                  <li className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-brand shrink-0" />
                    <span>부산·울산·김해·양산 전지역 출장 가능</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-brand shrink-0" />
                    <span>010-2222-0170 (24시간 긴급 문의 접수)</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-brand shrink-0" />
                    <span>연중무휴 09:00 - 22:00 (야간 상담 가능)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
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

      {/* Floating Action Button */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-brand text-white w-16 h-16 rounded-2xl shadow-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative"
        >
          <MessageSquare className="w-8 h-8" />
          <span className="absolute right-full mr-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            수리 문의하기
          </span>
        </button>
      </motion.div>

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
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">수리 문의 접수</h2>
                    <p className="text-slate-500 text-sm font-medium">정보를 입력하시면 담당자가 즉시 연락드립니다.</p>
                  </div>
                  <button 
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">이름</label>
                    <input 
                      required
                      type="text"
                      placeholder="성함을 입력해주세요"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-brand transition-all outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">연락처</label>
                    <input 
                      required
                      type="tel"
                      placeholder="010-0000-0000"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-brand transition-all outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">주소</label>
                    <input 
                      required
                      type="text"
                      placeholder="수리를 받을 주소를 입력해 주세요"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-brand transition-all outline-none"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">증상 및 요청사항</label>
                    <textarea 
                      rows={3}
                      placeholder="수리가 필요한 증상을 간단히 적어주세요"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-brand transition-all outline-none resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

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
