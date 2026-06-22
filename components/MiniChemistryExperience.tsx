'use client';

import { useEffect, useRef, useState } from 'react';
import MiniResultCard from '@/components/MiniResultCard';
import SoloResultCard from '@/components/SoloResultCard';
import TestSelectorBackButton from '@/components/TestSelectorBackButton';
import { ParticipationMode } from '@/components/ParticipationSelector';
import { buildInviteUrl, InvitePayload } from '@/lib/invite-link';
import {
  calculateMiniTest,
  ChemistryTestType,
  MINI_TEST_DEFINITIONS,
  MiniTestResult,
} from '@/lib/mini-tests';
import { BalanceAnswer, BalanceAnswers } from '@/lib/types';

type MiniTestType = Exclude<ChemistryTestType, 'overall'>;
type Step = 'basic' | 'mine' | 'partner' | 'invite-ready' | 'result';

interface MiniChemistryExperienceProps {
  testType: MiniTestType;
  mode: ParticipationMode;
  invite: InvitePayload | null;
  onChooseMode: () => void;
  onChooseTest: () => void;
}

export default function MiniChemistryExperience({
  testType,
  mode,
  invite,
  onChooseMode,
  onChooseTest,
}: MiniChemistryExperienceProps) {
  const definition = MINI_TEST_DEFINITIONS[testType];
  const experienceRef = useRef<HTMLElement>(null);
  const hasMounted = useRef(false);
  const joiningInvite = mode === 'invite' && invite !== null;
  const [step, setStep] = useState<Step>(joiningInvite ? 'basic' : 'basic');
  const [myName, setMyName] = useState('');
  const [partnerName, setPartnerName] = useState(invite?.inviterName ?? '');
  const [myAnswers, setMyAnswers] = useState<BalanceAnswers>({});
  const [partnerAnswers, setPartnerAnswers] = useState<BalanceAnswers>(invite?.answers ?? {});
  const [result, setResult] = useState<MiniTestResult | null>(null);
  const [inviteUrl, setInviteUrl] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    experienceRef.current?.querySelector<HTMLElement>('[data-step-heading]')?.focus();
  }, [step]);

  const answersComplete = (answers: BalanceAnswers) =>
    definition.questions.every(({ id }) => answers[id] !== undefined);

  const focusFirstUnanswered = (answers: BalanceAnswers) => {
    const unanswered = definition.questions.find(({ id }) => answers[id] === undefined);
    experienceRef.current
      ?.querySelector<HTMLElement>(`[data-question-id="${unanswered?.id}"]`)
      ?.focus();
  };

  const start = () => {
    const requiresPartnerName = mode === 'together' || mode === 'predict';
    if (!myName.trim() || (requiresPartnerName && !partnerName.trim())) {
      setError('필요한 이름을 입력해주세요.');
      const field = !myName.trim() ? 'my-name' : 'partner-name';
      experienceRef.current?.querySelector<HTMLElement>(`[data-basic-field="${field}"]`)?.focus();
      return;
    }
    setError('');
    setStep('mine');
  };

  const randomAnswers = (): BalanceAnswers => Object.fromEntries(
    definition.questions.map(({ id }) => [id, Math.random() < 0.5 ? 0 : 1]),
  );

  const finishMine = () => {
    if (!answersComplete(myAnswers)) {
      setError('모든 질문에 답해주세요.');
      focusFirstUnanswered(myAnswers);
      return;
    }
    setError('');

    if (mode === 'solo') {
      setStep('result');
      return;
    }
    if (mode === 'random') {
      const generated = randomAnswers();
      setPartnerName('랜덤 상대');
      setPartnerAnswers(generated);
      setResult(calculateMiniTest({
        testType,
        myName: myName.trim(),
        partnerName: '랜덤 상대',
        myAnswers,
        partnerAnswers: generated,
      }));
      setStep('result');
      return;
    }
    if (mode === 'invite' && !joiningInvite) {
      const url = buildInviteUrl({
        version: 1,
        testType,
        inviterName: myName.trim(),
        answers: myAnswers,
      }, window.location);
      setInviteUrl(url);
      window.history.replaceState(null, '', url);
      setStep('invite-ready');
      return;
    }
    if (joiningInvite) {
      setResult(calculateMiniTest({
        testType,
        myName: partnerName,
        partnerName: myName.trim(),
        myAnswers: partnerAnswers,
        partnerAnswers: myAnswers,
      }));
      setStep('result');
      return;
    }
    setStep('partner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showResult = () => {
    if (!answersComplete(partnerAnswers)) {
      setError('모든 질문에 답해주세요.');
      focusFirstUnanswered(partnerAnswers);
      return;
    }
    setResult(calculateMiniTest({
      testType,
      myName: myName.trim(),
      partnerName: partnerName.trim(),
      myAnswers,
      partnerAnswers,
    }));
    setError('');
    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setStep('basic');
    setMyName('');
    setPartnerName(invite?.inviterName ?? '');
    setMyAnswers({});
    setPartnerAnswers(invite?.answers ?? {});
    setResult(null);
    setInviteUrl('');
    setError('');
    setToast('');
  };

  const copyText = async (text: string, success: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(success);
    } catch {
      setToast('복사하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const shareInvite = async () => {
    const text = `${myName}님이 ${definition.title}에 초대했어요!\n${inviteUrl}`;
    try {
      if (navigator.share) await navigator.share({ title: `${definition.title} 초대`, text, url: inviteUrl });
      else await copyText(inviteUrl, '초대 링크를 복사했어요.');
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === 'AbortError') return;
      await copyText(inviteUrl, '초대 링크를 복사했어요.');
    }
  };

  const shareResult = async () => {
    if (!result) return;
    const text = `${result.icon} ${result.title}\n${result.score}점 · ${result.type}\n“${result.summary}”`;
    try {
      if (navigator.share) await navigator.share({ title: `${result.title} 결과`, text });
      else await copyText(text, '결과를 클립보드에 복사했어요.');
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === 'AbortError') return;
      await copyText(text, '결과를 클립보드에 복사했어요.');
    }
  };

  const updateAnswer = (owner: 'mine' | 'partner', id: string, answer: BalanceAnswer) => {
    const setter = owner === 'mine' ? setMyAnswers : setPartnerAnswers;
    setter((previous) => ({ ...previous, [id]: answer }));
  };

  const progressLabels = mode === 'invite'
    ? (joiningInvite ? ['이름', '내 선택', '결과'] : ['이름', '내 선택', '링크'])
    : mode === 'solo' || mode === 'random'
      ? ['이름', '내 선택', '결과']
      : ['이름', '내 선택', mode === 'predict' ? '예상 답변' : '상대 선택', '결과'];
  const progressIndex = step === 'basic' ? 0 : step === 'mine' ? 1 : step === 'partner' ? 2 : progressLabels.length - 1;

  return (
    <section ref={experienceRef} className="rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-2xl shadow-pink-200/50 backdrop-blur md:p-8">
      {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div>}

      {step !== 'result' && step !== 'invite-ready' && <TestSelectorBackButton onClick={onChooseMode} />}
      <Progress labels={progressLabels} currentStep={progressIndex} />

      {error && <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">{error}</div>}

      {step === 'basic' && (
        <form onSubmit={(event) => { event.preventDefault(); start(); }}>
          <StepHeading
            title={`${definition.icon} ${definition.title}`}
            description={joiningInvite
              ? `${invite.inviterName}님이 보낸 초대예요. 내 이름을 입력하고 직접 답해주세요.`
              : mode === 'solo'
                ? '내 이름을 입력하고 취향 분석을 시작해보세요.'
                : mode === 'random'
                  ? '내 답변과 재미용 랜덤 상대의 답변을 비교해요.'
                  : mode === 'invite'
                    ? '내 답변을 완료하면 서버 없이 전달할 초대 링크를 만들어요.'
                    : mode === 'predict'
                      ? '내 답변 후 상대방이 고를 것 같은 답을 예상해보세요.'
                      : '두 사람이 같은 질문에 차례대로 직접 답해주세요.'}
          />
          <div className={`grid gap-4 ${mode === 'together' || mode === 'predict' ? 'md:grid-cols-2' : ''}`}>
            <NameField label={joiningInvite ? '내' : '나'} value={myName} field="my-name" onChange={setMyName} />
            {(mode === 'together' || mode === 'predict') && (
              <NameField label="상대" value={partnerName} field="partner-name" onChange={setPartnerName} />
            )}
          </div>
          <button type="submit" className={`mt-7 w-full rounded-xl bg-gradient-to-r ${definition.color} px-5 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5`}>질문 시작하기</button>
        </form>
      )}

      {step === 'mine' && (
        <QuestionStep
          name={myName}
          description={joiningInvite ? `${invite.inviterName}님의 답은 결과 전까지 보이지 않아요.` : undefined}
          questions={definition.questions}
          answers={myAnswers}
          onAnswer={(id, answer) => updateAnswer('mine', id, answer)}
          onBack={() => setStep('basic')}
          onNext={finishMine}
          buttonLabel={mode === 'solo' ? '내 취향 분석하기' : mode === 'random' ? '랜덤 비교 결과 보기' : mode === 'invite' ? (joiningInvite ? '우리 케미 확인하기' : '초대 링크 만들기') : mode === 'predict' ? '상대 답변 예상하기' : `${partnerName}에게 넘기기`}
        />
      )}

      {step === 'partner' && (
        <QuestionStep
          name={partnerName}
          description={mode === 'predict' ? `${partnerName}님이라면 고를 것 같은 답을 예상해주세요.` : '앞사람의 답을 보지 않고 직접 골라주세요.'}
          questions={definition.questions}
          answers={partnerAnswers}
          onAnswer={(id, answer) => updateAnswer('partner', id, answer)}
          onBack={() => setStep('mine')}
          onNext={showResult}
          buttonLabel={`${definition.title} 확인하기`}
        />
      )}

      {step === 'invite-ready' && (
        <div className="animate-result text-center">
          <div className="text-6xl">🔗</div>
          <h2 data-step-heading tabIndex={-1} className="mt-4 text-2xl font-black text-slate-900 outline-none">초대 링크가 준비됐어요</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">상대방이 링크에서 답하면 두 사람의 결과가 바로 표시됩니다. 서버에는 아무것도 저장하지 않아요.</p>
          <div className="mt-6 break-all rounded-2xl bg-slate-50 p-4 text-left text-xs leading-5 text-slate-600">{inviteUrl}</div>
          <button type="button" onClick={shareInvite} className={`mt-6 w-full rounded-xl bg-gradient-to-r ${definition.color} px-5 py-4 font-bold text-white shadow-lg`}>초대 링크 공유하기</button>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <button type="button" onClick={() => copyText(inviteUrl, '초대 링크를 복사했어요.')} className="rounded-xl bg-slate-100 px-5 py-4 font-bold text-slate-600">링크 복사</button>
            <button type="button" onClick={onChooseTest} className="rounded-xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-600">메인으로</button>
          </div>
        </div>
      )}

      {step === 'result' && mode === 'solo' && (
        <SoloResultCard testType={testType} name={myName} answers={myAnswers} onReset={reset} onChooseTest={onChooseTest} />
      )}

      {step === 'result' && mode !== 'solo' && result && (
        <MiniResultCard
          result={result}
          myName={joiningInvite ? partnerName : myName}
          partnerName={joiningInvite ? myName : partnerName}
          onReset={reset}
          onShare={shareResult}
          onChooseTest={onChooseTest}
          modeNotice={mode === 'predict'
            ? '🔮 상대방의 실제 답변이 아닌 예상 답변을 바탕으로 한 결과예요.'
            : mode === 'random'
              ? '🎲 무작위로 생성된 재미용 상대와 비교한 결과예요.'
              : undefined}
        />
      )}
    </section>
  );
}

function Progress({ labels, currentStep }: { labels: string[]; currentStep: number }) {
  return (
    <div className="mb-8" role="progressbar" aria-label="케미 테스트 진행 단계" aria-valuemin={1} aria-valuemax={labels.length} aria-valuenow={currentStep + 1} aria-valuetext={`${labels[currentStep]} 단계`}>
      <div className="mb-3 flex justify-between text-[11px] font-semibold text-slate-500 md:text-xs">
        {labels.map((label, index) => <span key={label} className={index <= currentStep ? 'text-pink-600' : ''}>{label}</span>)}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-500" style={{ width: `${((currentStep + 1) / labels.length) * 100}%` }} />
      </div>
    </div>
  );
}

function NameField({ label, value, field, onChange }: { label: string; value: string; field: string; onChange: (value: string) => void }) {
  return (
    <label className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
      {label}의 이름
      <input value={value} data-basic-field={field} maxLength={12} onChange={(event) => onChange(event.target.value)} placeholder={`${label}의 이름`} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-normal text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100" />
    </label>
  );
}

function QuestionStep({
  name,
  description,
  questions,
  answers,
  onAnswer,
  onBack,
  onNext,
  buttonLabel,
}: {
  name: string;
  description?: string;
  questions: typeof MINI_TEST_DEFINITIONS.travel.questions;
  answers: BalanceAnswers;
  onAnswer: (id: string, answer: BalanceAnswer) => void;
  onBack: () => void;
  onNext: () => void;
  buttonLabel: string;
}) {
  return (
    <div>
      <StepHeading title={`${name}님의 선택`} description={description ?? `${questions.length}개 질문에 가장 가까운 답을 골라주세요.`} />
      <div className="space-y-5">
        {questions.map((question, questionIndex) => (
          <fieldset key={question.id} data-question-id={question.id} tabIndex={-1} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-4">
            <legend className="mb-3 text-sm font-bold text-slate-800"><span className="mr-2 text-pink-500">{questionIndex + 1}</span>{question.question}</legend>
            <div className="grid gap-2 md:grid-cols-2">
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                return (
                  <button key={option} type="button" aria-pressed={selected} onClick={() => onAnswer(question.id, optionIndex as BalanceAnswer)} className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${selected ? 'border-violet-400 bg-violet-50 text-violet-800 ring-2 ring-violet-100' : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200'}`}>{option}</button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={onBack} className="rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-200">이전</button>
        <button type="button" onClick={onNext} className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-3 font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5">{buttonLabel}</button>
      </div>
    </div>
  );
}

function StepHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 text-center">
      <h2 data-step-heading tabIndex={-1} className="text-2xl font-black text-slate-900 outline-none md:text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
