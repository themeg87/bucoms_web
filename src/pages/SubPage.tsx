/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 서비스·지역·시공 사례 페이지 (홈을 제외한 모든 페이지)

import type { ReactNode } from 'react';
import { ArrowUpRight, CheckCircle2, ChevronRight, MapPin, MessageSquare, Phone } from 'lucide-react';
import { BUSINESS } from '../constants/business';
import { KakaoIcon } from '../components/KakaoIcon';
import { CaseCard } from '../components/CaseCard';
import { EstimateForm } from './EstimateForm';
import {
  AREA_PAGES, BLOG_PATH, CASE_PAGES, ESTIMATE_PATH, SERVICE_PAGES,
  allPosts, areaPath, areaPosts, blogPostUrl, caseBlogUrl, casePath, findCase, findService, pageMeta, servicePath, topicPosts,
  type AreaPage, type BlogPost, type CasePage, type Faq, type Photo, type Route, type ServicePage
} from '../content/pages';

type OpenForm = () => void;

const Breadcrumbs = ({ path }: { path: string }) => (
  <nav aria-label="현재 위치" className="text-xs font-bold text-slate-400 mb-8">
    <ol className="flex flex-wrap items-center gap-1.5">
      {pageMeta(path).breadcrumbs.map((b, i, all) => (
        <li key={b.path} className="flex items-center gap-1.5">
          {i < all.length - 1 ? (
            <>
              <a href={b.path} className="hover:text-brand transition-colors">{b.name}</a>
              <ChevronRight className="w-3 h-3" />
            </>
          ) : (
            <span className="text-slate-600" aria-current="page">{b.name}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

const ContactButtons = ({ openForm, dark = false }: { openForm: OpenForm; dark?: boolean }) => (
  <div className="flex flex-col sm:flex-row gap-3">
    <a
      href={BUSINESS.kakaoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#FEE500] text-[#191919] px-7 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#F7E600] transition-colors"
    >
      <KakaoIcon className="w-5 h-5" />
      카카오톡 상담
    </a>
    <a
      href={`tel:${BUSINESS.phone}`}
      className={`px-7 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-colors ${dark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-brand text-white hover:bg-slate-900'}`}
    >
      <Phone className="w-5 h-5" />
      {BUSINESS.phone}
    </a>
    <button
      type="button"
      onClick={openForm}
      className={`px-7 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-colors ${dark ? 'border border-white/20 text-white hover:bg-white/10' : 'border border-slate-200 text-slate-700 hover:border-brand hover:text-brand'}`}
    >
      <MessageSquare className="w-5 h-5" />
      온라인 문의
    </button>
  </div>
);

const PageHeader = ({ path, label, h1, intro, image, openForm, children }: {
  path: string; label: string; h1: string; intro: string[]; image?: Photo; openForm: OpenForm; children?: ReactNode;
}) => (
  <section className="pt-44 lg:pt-52 pb-20 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <Breadcrumbs path={path} />
      <div className={`grid gap-12 items-center ${image ? 'lg:grid-cols-12' : ''}`}>
        <div className={image ? 'lg:col-span-7' : 'max-w-3xl'}>
          <div className="text-xs font-bold text-brand tracking-[0.3em] uppercase mb-5">{label}</div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.05] mb-8">{h1}</h1>
          {intro.map(p => (
            <p key={p} className="text-lg text-slate-500 leading-relaxed font-medium mb-3 max-w-2xl">{p}</p>
          ))}
          {children}
          <div className="mt-10">
            <ContactButtons openForm={openForm} />
          </div>
        </div>
        {image && (
          <figure className="lg:col-span-5 relative aspect-[4/3] lg:aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100">
            <img src={image.src} alt={image.caption} width={800} height={1000} className="w-full h-full object-cover" />
            <figcaption className="absolute left-4 bottom-4 px-4 py-2 rounded-xl bg-slate-900/80 text-white text-xs font-bold">
              실제 현장 · {image.caption}
            </figcaption>
          </figure>
        )}
      </div>
    </div>
  </section>
);

const SectionTitle = ({ label, title }: { label: string; title: string }) => (
  <div className="mb-12">
    <div className="text-xs font-bold text-brand tracking-[0.3em] uppercase mb-4">{label}</div>
    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">{title}</h2>
  </div>
);

const CheckList = ({ items }: { items: string[] }) => (
  <ul className="grid sm:grid-cols-2 gap-3">
    {items.map(item => (
      <li key={item} className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-slate-100 font-bold text-slate-700">
        <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
        {item}
      </li>
    ))}
  </ul>
);

const CaseGrid = ({ slugs }: { slugs: string[] }) => {
  const items = slugs.map(findCase).filter((c): c is CasePage => Boolean(c));
  if (items.length === 0) return null;
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle label="실제 시공 사례" title="직접 다녀온 현장" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(item => <CaseCard key={item.slug} item={item} />)}
        </div>
      </div>
    </section>
  );
};

const FaqList = ({ faqs }: { faqs: Faq[] }) => (
  <section className="py-24 bg-white">
    <div className="max-w-3xl mx-auto px-6">
      <SectionTitle label="자주 묻는 질문" title="궁금하신 점" />
      <div className="space-y-3">
        {faqs.map(f => (
          <details key={f.q} className="group p-6 rounded-2xl border border-slate-100 bg-slate-50 open:bg-white open:shadow-lg transition-all">
            <summary className="flex items-center justify-between gap-4 cursor-pointer font-bold text-slate-900 list-none">
              {f.q}
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 transition-transform group-open:rotate-90" />
            </summary>
            <p className="mt-4 text-slate-600 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const BlogPosts = ({ title, posts }: { title: string; posts: BlogPost[] }) => {
  if (posts.length === 0) return null;
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-bold text-brand tracking-[0.3em] uppercase mb-4">부컴 블로그</div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{title}</h2>
          </div>
          <a href={BLOG_PATH} className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-brand">
            블로그 글 전체 목록 <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <ul className="divide-y divide-slate-200 border-y border-slate-200">
          {posts.map(post => (
            <li key={post.id}>
              <a href={blogPostUrl(post.id)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-6 py-5 group">
                <span className="font-bold text-slate-700 group-hover:text-brand transition-colors">{post.title}</span>
                <span className="text-xs font-bold text-slate-400 shrink-0">{post.date}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const LinkGrid = ({ title, links }: { title: string; links: { href: string; label: string }[] }) => (
  <section className="py-20 bg-white border-t border-slate-100">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-xl font-black text-slate-900 mb-6">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {links.map(l => (
          <a key={l.href} href={l.href} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:border-brand hover:text-brand transition-colors">
            {l.label}
          </a>
        ))}
      </div>
    </div>
  </section>
);

const BottomCta = ({ openForm, title }: { openForm: OpenForm; title: string }) => (
  <section className="py-24 bg-slate-900">
    <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
      <div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">{title}</h2>
        <p className="text-slate-400">
          {BUSINESS.serviceArea} 출장 · {BUSINESS.hours} · 출장비 10,000원(수리 시 면제)
        </p>
      </div>
      <ContactButtons openForm={openForm} dark />
    </div>
  </section>
);

const serviceLinks = SERVICE_PAGES.map(s => ({ href: servicePath(s.slug), label: s.title }));
const areaLinks = AREA_PAGES.map(a => ({ href: areaPath(a.slug), label: `${a.name} 컴퓨터수리` }));

const EstimateBanner = () => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <a href={ESTIMATE_PATH} className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-10 rounded-[2rem] bg-slate-900 text-white hover:bg-brand transition-colors">
        <div>
          <div className="text-xs font-bold tracking-[0.3em] uppercase text-slate-400 group-hover:text-white/70 mb-3">PC 견적</div>
          <div className="text-2xl md:text-3xl font-black tracking-tight mb-2">용도와 예산만 알려 주세요</div>
          <p className="text-slate-400 group-hover:text-white/80">부품을 골라 견적서를 만들어 휴대폰으로 볼 수 있는 링크로 보내 드립니다.</p>
        </div>
        <span className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white text-slate-900 font-black shrink-0">
          견적 요청하기 <ArrowUpRight className="w-5 h-5" />
        </span>
      </a>
    </div>
  </section>
);

const EstimateView = ({ openForm }: { openForm: OpenForm }) => (
  <>
    <PageHeader
      path={ESTIMATE_PATH}
      label="조립PC 견적"
      h1="PC 견적 요청"
      intro={[
        "쓰시는 용도와 예산을 알려 주시면, 부컴이 다나와 가격을 기준으로 부품을 골라 견적서를 만들어 드립니다.",
        "견적서는 휴대폰으로 볼 수 있는 링크로 보내 드리고, 확인하신 뒤 조립·설치까지 진행할 수 있어요."
      ]}
      openForm={openForm}
    />
    <section className="pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <EstimateForm />
        </div>
        <aside className="lg:col-span-5 space-y-4">
          {[
            { title: "1. 견적 요청", desc: "이 페이지에서 용도·예산을 보내 주세요. 궁금한 점은 전화나 카톡으로 여쭤볼게요." },
            { title: "2. 견적서 링크", desc: "부품 목록과 가격이 담긴 견적서를 링크로 보내 드립니다. 부품 가격은 시세에 따라 바뀔 수 있어 7일 동안 유효해요." },
            { title: "3. 조립·설치", desc: "확정하시면 조립하고 테스트까지 마친 뒤 설치해 드립니다. 조립 공임은 기본 55,000원이에요." }
          ].map(s => (
            <div key={s.title} className="p-7 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-black text-lg text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </aside>
      </div>
    </section>
    <CaseGrid slugs={["dongnae-board", "ulsan-gpu-board"]} />
    <BottomCta openForm={openForm} title="PC 견적, 편하게 물어보세요" />
  </>
);

const ServiceView = ({ page, openForm }: { page: ServicePage; openForm: OpenForm }) => (
  <>
    <PageHeader path={servicePath(page.slug)} label="서비스 안내" h1={page.h1} intro={page.intro} image={page.image} openForm={openForm} />

    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
        <div>
          <SectionTitle label={page.name} title={page.listTitle} />
          <CheckList items={page.list} />
        </div>
        <div>
          <SectionTitle label="부컴 방식" title="이렇게 진행합니다" />
          <div className="space-y-4">
            {page.points.map((p, i) => (
              <div key={p.title} className="flex gap-5 p-6 rounded-2xl bg-white border border-slate-100">
                <div className="text-2xl font-black text-brand/40 w-8 shrink-0">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{p.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {page.prices && (
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {page.prices.map(price => (
                <div key={price.label} className="p-6 rounded-2xl bg-slate-900 text-white">
                  <div className="text-xs font-bold text-slate-400 mb-1">{price.label}</div>
                  <div className="text-2xl font-black mb-2">{price.value}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{price.note}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>

    {page.slug === "custom-pc" && <EstimateBanner />}
    <CaseGrid slugs={page.cases} />
    <FaqList faqs={page.faqs} />
    <BlogPosts title={`${page.name} 관련 글`} posts={topicPosts(page.slug)} />
    <LinkGrid title="다른 서비스" links={serviceLinks.filter(l => l.href !== servicePath(page.slug))} />
    <LinkGrid title="출장 지역" links={areaLinks} />
    <BottomCta openForm={openForm} title={`${page.title}, 지금 상담하세요`} />
  </>
);

const AreaView = ({ page, openForm }: { page: AreaPage; openForm: OpenForm }) => {
  const data = areaPosts(page.slug);
  return (
    <>
      <PageHeader
        path={areaPath(page.slug)}
        label="출장 지역"
        h1={`부산 ${page.name} 컴퓨터수리 · CCTV 설치`}
        intro={[
          `${page.name}에서 컴퓨터가 고장 났거나 CCTV 설치가 필요하다면, 부컴의 10년 경력 엔지니어가 직접 방문합니다.`,
          ...(page.note ? [page.note] : []),
          "출장비는 10,000원이며 수리를 진행하시면 받지 않습니다. 점검 후 비용을 먼저 안내하고, 동의하신 경우에만 수리합니다."
        ]}
        openForm={openForm}
      >
        {data.dongs.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
              <MapPin className="w-4 h-4 text-brand" />
              블로그에 소개한 {page.short} 지역
            </div>
            <div className="flex flex-wrap gap-2">
              {data.dongs.map(d => (
                <span key={d} className="px-3 py-1.5 rounded-full bg-slate-100 text-sm font-bold text-slate-600">{d}</span>
              ))}
            </div>
          </div>
        )}
      </PageHeader>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle label={`${page.name} 출장 서비스`} title="이런 작업을 합니다" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICE_PAGES.map(s => (
              <a key={s.slug} href={servicePath(s.slug)} className="group p-7 rounded-2xl bg-white border border-slate-100 hover:border-brand/30 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-lg text-slate-900">{page.short} {s.name}</h3>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-brand transition-colors" />
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{s.intro[0]}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CaseGrid slugs={page.cases} />
      <BlogPosts title={`${page.name} 관련 글`} posts={data.posts} />
      <LinkGrid title="다른 출장 지역" links={areaLinks.filter(l => l.href !== areaPath(page.slug))} />
      <BottomCta openForm={openForm} title={`${page.name} 출장 상담`} />
    </>
  );
};

const CaseView = ({ page, openForm }: { page: CasePage; openForm: OpenForm }) => {
  const service = findService(page.service);
  const blogUrl = caseBlogUrl(page);
  return (
    <>
      <PageHeader
        path={casePath(page.slug)}
        label={`시공 사례 · ${page.area} · ${page.category}`}
        h1={page.title}
        intro={[page.summary]}
        openForm={openForm}
      />

      <section className="pb-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-16">
            {page.photos.map((photo, i) => (
              <figure key={photo.src} className={`relative rounded-3xl overflow-hidden bg-slate-100 ${i === 0 && page.photos.length % 2 === 1 ? 'sm:col-span-2' : ''}`}>
                <img src={photo.src} alt={`${page.area} ${page.category} - ${photo.caption}`} loading={i === 0 ? undefined : "lazy"} width={800} height={600} className="w-full h-full object-cover aspect-[4/3]" />
                <figcaption className="absolute left-4 bottom-4 px-3 py-1.5 rounded-lg bg-slate-900/80 text-white text-xs font-bold">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>

          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-8">작업 내용</h2>
            <div className="space-y-5 text-lg text-slate-600 leading-relaxed">
              {page.body.map(p => <p key={p}>{p}</p>)}
            </div>
            <div className="flex flex-wrap gap-2 mt-10">
              {page.tags.map(tag => (
                <span key={tag} className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full">{tag}</span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              {service && (
                <a href={servicePath(service.slug)} className="inline-flex items-center justify-between gap-4 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 hover:border-brand hover:text-brand transition-colors">
                  {service.title} 안내 보기 <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
              <a href={blogUrl || BLOG_PATH} {...(blogUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex items-center justify-between gap-4 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 hover:border-brand hover:text-brand transition-colors">
                {blogUrl ? "블로그에서 시공기 전체 보기" : "블로그 글 더 보기"} <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <CaseGrid slugs={CASE_PAGES.filter(c => c.slug !== page.slug).map(c => c.slug).slice(0, 3)} />
      <BottomCta openForm={openForm} title="비슷한 증상이 있으신가요?" />
    </>
  );
};

// 블로그 글 전체 목록 — 구글이 홈페이지를 따라 네이버 블로그 글을 찾아가도록 모든 글을 링크로 둔다
const BlogView = ({ openForm }: { openForm: OpenForm }) => {
  const posts = allPosts();
  const months: { month: string; posts: BlogPost[] }[] = [];
  for (const post of posts) {
    const month = post.date.slice(0, 7);
    const last = months[months.length - 1];
    if (last?.month === month) last.posts.push(post);
    else months.push({ month, posts: [post] });
  }
  return (
    <>
      <PageHeader
        path={BLOG_PATH}
        label="부컴 블로그"
        h1="부컴 블로그 글 전체 목록"
        intro={[
          `네이버 블로그에 올린 글 ${posts.length}개를 모았습니다. 부산 곳곳의 출장 수리·CCTV 설치 현장 이야기와 컴퓨터 고장 증상, 부품 정보 글입니다.`,
          "제목을 누르면 네이버 블로그에서 글 전체를 볼 수 있습니다."
        ]}
        openForm={openForm}
      />

      <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          {months.map(({ month, posts }) => (
            <div key={month}>
              <h2 className="text-lg font-black text-slate-900 mb-2">{month.replace("-", "년 ")}월 <span className="text-slate-400 text-sm">({posts.length})</span></h2>
              <ul className="divide-y divide-slate-100 border-y border-slate-100">
                {posts.map(post => (
                  <li key={post.id}>
                    <a href={blogPostUrl(post.id)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-6 py-3.5 group">
                      <span className="font-bold text-slate-700 group-hover:text-brand transition-colors">{post.title}</span>
                      <span className="text-xs font-bold text-slate-400 shrink-0">{post.date.slice(5)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <CaseGrid slugs={CASE_PAGES.map(c => c.slug).slice(0, 3)} />
      <LinkGrid title="서비스 안내" links={serviceLinks} />
      <LinkGrid title="출장 지역" links={areaLinks} />
      <BottomCta openForm={openForm} title="컴퓨터·CCTV 문제, 부컴에 상담하세요" />
    </>
  );
};

export const SubPage = ({ route, openForm }: { route: Exclude<Route, { type: "home" }>; openForm: OpenForm }) => {
  switch (route.type) {
    case "service": return <ServiceView page={route.page} openForm={openForm} />;
    case "area": return <AreaView page={route.page} openForm={openForm} />;
    case "case": return <CaseView page={route.page} openForm={openForm} />;
    case "blog": return <BlogView openForm={openForm} />;
    case "estimate": return <EstimateView openForm={openForm} />;
  }
};
