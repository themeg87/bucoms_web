/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// PC 견적 요청 폼 (/pc-estimate/) — 기존 문의 API(/api/inquiry, kind: "pc-estimate")로 텔레그램·구글 시트에 접수.
// 사장님이 견적 도구(bench_mark_danawa)로 견적서를 만들어 링크로 보내 드리는 흐름.

import { useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { track } from '../analytics';

const PURPOSES = ["사무·인강", "게임", "영상·디자인 작업", "기타"];
const BUDGETS = ["70만 원 이하", "70~100만 원", "100~150만 원", "150~200만 원", "200만 원 이상", "상담 후 결정"];
const EXTRAS = ["모니터", "키보드·마우스", "윈도우 설치", "쓰던 PC 부품 재사용·업그레이드 상담"];

const EMPTY = { purpose: "", budget: "", programs: "", extras: [] as string[], name: "", phone: "", address: "", note: "", website: "" };

const inputClass = "w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-brand transition-all outline-none";

const Field = ({ id, label, children }: { id?: string; label: string; children: ReactNode }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-black text-slate-900 mb-3">{label}</label>
    {children}
  </div>
);

const Chips = ({ name, options, value, onPick, multi = false }: {
  name: string; options: string[]; value: string | string[]; onPick: (v: string) => void; multi?: boolean;
}) => (
  <div role={multi ? "group" : "radiogroup"} aria-label={name} className="flex flex-wrap gap-2">
    {options.map(o => {
      const on = multi ? (value as string[]).includes(o) : value === o;
      return (
        <button
          key={o}
          type="button"
          role={multi ? "checkbox" : "radio"}
          aria-checked={on}
          onClick={() => onPick(o)}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${on ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-brand hover:text-brand'}`}
        >
          {o}
        </button>
      );
    })}
  </div>
);

export const EstimateForm = () => {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const toggleExtra = (v: string) =>
    setForm(f => ({ ...f, extras: f.extras.includes(v) ? f.extras.filter(x => x !== v) : [...f.extras, v] }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.purpose || !form.budget) {
      setStatus("error");
      setError("용도와 예산을 골라 주세요.");
      return;
    }
    setStatus("sending");
    setError("");
    const description = [
      `용도: ${form.purpose}`,
      `예산(본체): ${form.budget}`,
      `게임·프로그램: ${form.programs || "없음"}`,
      `추가: ${form.extras.join(", ") || "없음"}`,
      `요청사항: ${form.note || "없음"}`,
    ].join("\n");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "pc-estimate", name: form.name, phone: form.phone, address: form.address, description, website: form.website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("done");
        track("submit_pc_estimate", { purpose: form.purpose, budget: form.budget });
        setForm(EMPTY);
      } else {
        setStatus("error");
        setError(data.message || "접수 중 오류가 발생했습니다. 전화로 문의해 주세요.");
      }
    } catch {
      setStatus("error");
      setError("서버와 통신 중 오류가 발생했습니다. 전화로 문의해 주세요.");
    }
  };

  if (status === "done") {
    return (
      <div className="p-10 rounded-[2rem] bg-slate-50 border border-slate-100 text-center">
        <CheckCircle2 className="w-12 h-12 text-brand mx-auto mb-5" />
        <h3 className="text-2xl font-black text-slate-900 mb-3">견적 요청이 접수됐어요</h3>
        <p className="text-slate-500 leading-relaxed">
          내용을 확인하고 연락드릴게요. 견적서는 휴대폰으로 볼 수 있는 링크로 보내 드립니다.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-9">
      <Field label="어디에 쓰실 건가요? *">
        <Chips name="용도" options={PURPOSES} value={form.purpose} onPick={v => setForm({ ...form, purpose: v })} />
      </Field>
      <Field label="예산은 어느 정도인가요? (본체 기준) *">
        <Chips name="예산" options={BUDGETS} value={form.budget} onPick={v => setForm({ ...form, budget: v })} />
      </Field>
      <Field id="est-programs" label="주로 하는 게임·프로그램">
        <input id="est-programs" type="text" maxLength={150} placeholder="예) 배틀그라운드, 롤 / 프리미어 프로, 포토샵" className={inputClass}
          value={form.programs} onChange={e => setForm({ ...form, programs: e.target.value })} />
      </Field>
      <Field label="같이 필요한 것 (여러 개 선택)">
        <Chips name="추가 품목" options={EXTRAS} value={form.extras} onPick={toggleExtra} multi />
      </Field>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field id="est-name" label="이름 *">
          <input id="est-name" required type="text" maxLength={30} placeholder="성함" className={inputClass}
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field id="est-phone" label="연락처 *">
          <input id="est-phone" required type="tel" inputMode="tel" pattern="[0-9\-\s]{9,15}" title="숫자와 - 만 입력해 주세요"
            placeholder="010-0000-0000" className={inputClass}
            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </Field>
      </div>
      <Field id="est-address" label="지역 *">
        <input id="est-address" required type="text" maxLength={200} placeholder="예) 부산 동래구 명륜동 (설치·배송 받으실 곳)" className={inputClass}
          value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
      </Field>
      <Field id="est-note" label="더 알려 주실 것">
        <textarea id="est-note" rows={3} maxLength={500} placeholder="원하는 부품·브랜드, 흰색 케이스 같은 취향, 쓰던 PC 사양 등" className={`${inputClass} resize-none`}
          value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
      </Field>

      {/* 봇 차단용 숨김 필드 */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden"
        value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />

      {status === "error" && <p role="alert" className="text-sm font-bold text-red-500">{error}</p>}
      <button disabled={status === "sending"}
        className="w-full py-5 rounded-2xl font-black text-white bg-brand shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-70">
        {status === "sending"
          ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <>견적 요청하기 <ArrowRight className="w-5 h-5" /></>}
      </button>
      <p className="text-xs text-slate-400 leading-relaxed">
        입력하신 정보는 견적 안내 연락에만 사용합니다. 자세한 내용은 페이지 아래 개인정보처리방침을 확인해 주세요.
      </p>
    </form>
  );
};
