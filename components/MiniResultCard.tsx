'use client';

import { useState } from 'react';
import { MiniTestResult } from '@/lib/mini-tests';

interface MiniResultCardProps {
  result: MiniTestResult;
  myName: string;
  partnerName: string;
  onReset: () => void;
  onShare: () => void;
  onChooseTest: () => void;
  modeNotice?: string;
}

export default function MiniResultCard({
  result,
  myName,
  partnerName,
  onReset,
  onShare,
  onChooseTest,
  modeNotice,
}: MiniResultCardProps) {
  const [showComparisons, setShowComparisons] = useState(false);

  return (
    <div className="animate-result">
      <div className="text-center">
        {modeNotice && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
            {modeNotice}
          </div>
        )}
        <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
          {result.icon} {result.title} 리포트
        </span>
        <h2 data-step-heading tabIndex={-1} className="mt-5 text-2xl font-black text-slate-900 outline-none md:text-3xl">
          {myName} <span className="text-pink-400">×</span> {partnerName}
        </h2>
      </div>

      <div className={`my-7 rounded-3xl bg-gradient-to-br ${result.color} p-6 text-center text-white shadow-xl`}>
        <p className="text-sm font-semibold text-white/80">{result.title} 점수</p>
        <div className="mt-1 text-7xl font-black tracking-tight">
          {result.score}<span className="text-2xl">점</span>
        </div>
        <h3 className="mt-3 text-xl font-black">{result.type}</h3>
        <p className="mt-2 text-sm text-white/90">“{result.summary}”</p>
      </div>

      <section className="rounded-2xl bg-slate-50 p-5 md:p-6">
        <h3 className="font-black text-slate-900">두 사람의 결과 해석</h3>
        <p className="mt-3 text-sm leading-7 text-slate-700">{result.description}</p>
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ResultList title="✨ 잘 맞는 부분" items={result.strengths} tone="emerald" />
        <ResultList title="🔎 조율하면 좋은 부분" items={result.differences} tone="orange" />
      </div>

      <section className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 p-5">
        <h3 className="font-black text-violet-900">함께 해볼 만한 것</h3>
        <ul className="mt-3 space-y-2">
          {result.recommendations.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-violet-900/80">
              <span>•</span>{item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="font-black text-amber-900">🏁 이번 주 케미 미션</h3>
        <p className="mt-2 text-sm leading-7 text-amber-900/80">{result.mission}</p>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
        <button
          type="button"
          aria-expanded={showComparisons}
          onClick={() => setShowComparisons((current) => !current)}
          className="flex w-full items-center justify-between bg-white px-5 py-4 text-left font-bold text-slate-800"
        >
          두 사람의 답변 비교
          <span className="text-slate-400">{showComparisons ? '−' : '+'}</span>
        </button>
        {showComparisons && (
          <div className="border-t border-slate-100">
            {result.comparisons.map((comparison) => (
              <div key={comparison.id} className="border-b border-slate-100 p-4 last:border-b-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-slate-800">{comparison.question}</p>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${
                    comparison.matches
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-orange-50 text-orange-700'
                  }`}>
                    {comparison.matches ? '일치' : '다름'}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-xs md:grid-cols-2">
                  <p className="rounded-xl bg-pink-50 px-3 py-2 text-pink-800">
                    <strong>{myName}</strong> · {comparison.myAnswer}
                  </p>
                  <p className="rounded-xl bg-violet-50 px-3 py-2 text-violet-800">
                    <strong>{partnerName}</strong> · {comparison.partnerAnswer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-7 grid gap-3 md:grid-cols-2">
        <button type="button" onClick={onShare} className="rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-4 font-bold text-white shadow-lg shadow-pink-200">
          결과 공유하기
        </button>
        <button type="button" onClick={onReset} className="rounded-xl bg-slate-100 px-5 py-4 font-bold text-slate-600 hover:bg-slate-200">
          같은 테스트 다시하기
        </button>
      </div>
      <button type="button" onClick={onChooseTest} className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-600 hover:bg-slate-50">
        다른 케미 테스트 선택
      </button>

      <p className="mt-5 text-center text-xs text-slate-400">재미로 보는 관계 테스트이며 전문적인 심리 진단이 아닙니다.</p>
    </div>
  );
}

function ResultList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'emerald' | 'orange';
}) {
  const classes = tone === 'emerald'
    ? 'border-emerald-100 bg-emerald-50 text-emerald-900'
    : 'border-orange-100 bg-orange-50 text-orange-900';

  return (
    <section className={`rounded-2xl border p-5 ${classes}`}>
      <h3 className="font-black">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 opacity-80">
            <span>•</span>{item}
          </li>
        ))}
      </ul>
    </section>
  );
}
