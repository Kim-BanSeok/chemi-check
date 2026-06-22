'use client';

import { useState } from 'react';
import { CompatibilityResult } from '@/lib/types';

interface ResultCardProps {
  result: CompatibilityResult;
  myName: string;
  partnerName: string;
  onReset: () => void;
  onShare: () => void;
  onChooseTest?: () => void;
}

export default function ResultCard({
  result,
  myName,
  partnerName,
  onReset,
  onShare,
  onChooseTest,
}: ResultCardProps) {
  const [openSection, setOpenSection] = useState('strengths');
  const sections = [
    { id: 'strengths', title: '잘 맞는 점', icon: '✨', items: result.strengths },
    { id: 'conflicts', title: '갈등이 생기는 지점', icon: '⚡', items: result.conflictPoints },
    { id: 'talk', title: '우리에게 맞는 대화법', icon: '💬', items: result.communicationTips },
    { id: 'activities', title: '함께하면 좋은 것', icon: '🎯', items: result.recommendedActivities },
  ];

  return (
    <div className="animate-result">
      <div className="text-center">
        <span className="inline-flex rounded-full bg-pink-50 px-4 py-2 text-sm font-bold text-pink-700">
          {result.relationshipLabel} 케미 리포트
        </span>
        <div className="mt-5 text-6xl">{result.emoji}</div>
        <h2 className="mt-3 text-2xl font-black text-slate-900 md:text-3xl">
          {myName} <span className="text-pink-400">×</span> {partnerName}
        </h2>
        <p className="mt-2 text-sm text-slate-500">우리의 케미 별명 · {result.coupleNickname}</p>
      </div>

      <div className="my-7 rounded-3xl bg-gradient-to-br from-pink-500 to-violet-600 p-6 text-center text-white shadow-xl shadow-pink-200">
        <p className="text-sm font-semibold text-white/80">종합 케미</p>
        <div className="mt-1 text-7xl font-black tracking-tight">
          {result.scores.overallScore}<span className="text-2xl">점</span>
        </div>
        <h3 className="mt-3 text-xl font-black">{result.chemistryType}</h3>
        <p className="mt-2 text-sm text-white/90">“{result.oneLineSummary}”</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Score label="이름" value={result.scores.nameScore} />
        <Score label="MBTI" value={result.scores.mbtiScore} />
        <Score label="취향 일치" value={result.scores.balanceScore} />
      </div>

      <div className="my-6 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700 md:p-6">
        <h3 className="mb-3 text-center font-bold text-slate-900">두 사람의 종합 해석</h3>
        {result.description.split('\n\n').map((paragraph) => (
          <p key={paragraph} className="mt-3 first:mt-0">{paragraph}</p>
        ))}
      </div>

      <div className="space-y-3">
        <Insight title="MBTI 관계 분석" icon="🧠">{result.mbtiInsight}</Insight>
        <Insight title="두 사람의 취향 분석" icon="🎭">{result.balanceInsight}</Insight>
      </div>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="font-black text-amber-900">🏁 이번 주 케미 미션</h3>
        <p className="mt-2 text-sm leading-7 text-amber-900/80">{result.weeklyMission}</p>
      </section>

      <section className="mt-6">
        <h3 className="mb-3 font-black text-slate-900">두 사람의 답변 비교</h3>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          {result.comparisons.map((comparison) => (
            <div
              key={comparison.id}
              className="border-b border-slate-100 p-4 last:border-b-0"
            >
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
      </section>

      <div className="mt-6 space-y-3">
        {sections.map((section) => {
          const isOpen = openSection === section.id;
          return (
            <div key={section.id} className="overflow-hidden rounded-2xl border border-slate-200">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenSection(isOpen ? '' : section.id)}
                className="flex w-full items-center justify-between bg-white px-4 py-4 text-left"
              >
                <span className="font-bold text-slate-800">{section.icon} {section.title}</span>
                <span className="text-slate-400">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <ul className="space-y-2 border-t border-slate-100 bg-slate-50 px-5 py-4">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                      <span className="text-pink-400">•</span>{item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-7 grid gap-3 md:grid-cols-2">
        <button type="button" onClick={onShare} className="rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-4 font-bold text-white shadow-lg shadow-pink-200">
          결과 공유하기
        </button>
        <button type="button" onClick={onReset} className="rounded-xl bg-slate-100 px-5 py-4 font-bold text-slate-600 hover:bg-slate-200">
          다른 조합 테스트
        </button>
      </div>
      {onChooseTest && (
        <button type="button" onClick={onChooseTest} className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-600 hover:bg-slate-50">
          다른 케미 테스트 선택
        </button>
      )}

      <p className="mt-5 text-center text-xs text-slate-400">재미로 보는 관계 테스트이며 전문적인 심리 진단이 아닙니다.</p>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center ring-1 ring-slate-100">
      <span className="block text-xs text-slate-500">{label}</span>
      <strong className="mt-1 block text-xl text-slate-800">{value}</strong>
    </div>
  );
}

function Insight({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
      <h3 className="mb-3 text-sm font-bold text-violet-900">{icon} {title}</h3>
      <p className="text-sm leading-7 text-slate-600">{children}</p>
    </div>
  );
}
