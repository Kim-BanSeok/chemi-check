'use client';

import { useEffect, useRef, useState } from 'react';
import ResultCard from '@/components/ResultCard';
import TestSelectorBackButton from '@/components/TestSelectorBackButton';
import { calculateCompatibility } from '@/lib/compatibility';
import {
  BalanceAnswer,
  BalanceAnswers,
  CompatibilityResult,
  getBalanceQuestions,
  MBTI_TYPES,
  MBTIType,
  RELATIONSHIP_OPTIONS,
  RelationshipType,
} from '@/lib/types';

type Step = 'basic' | 'mine' | 'partner' | 'result';

const stepOrder: Step[] = ['basic', 'mine', 'partner', 'result'];
const stepLabels = ['기본 정보', '나의 취향', '상대 취향', '결과'];

export default function CompatibilityExperience({
  onChooseTest,
}: {
  onChooseTest?: () => void;
}) {
  const experienceRef = useRef<HTMLElement>(null);
  const hasMounted = useRef(false);
  const [step, setStep] = useState<Step>('basic');
  const [myName, setMyName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [myMBTI, setMyMBTI] = useState<MBTIType | ''>('');
  const [partnerMBTI, setPartnerMBTI] = useState<MBTIType | ''>('');
  const [relationship, setRelationship] = useState<RelationshipType>('romance');
  const [myAnswers, setMyAnswers] = useState<BalanceAnswers>({});
  const [partnerAnswers, setPartnerAnswers] = useState<BalanceAnswers>({});
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const currentStep = stepOrder.indexOf(step);
  const questions = getBalanceQuestions(relationship);

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
    experienceRef.current
      ?.querySelector<HTMLElement>('[data-step-heading]')
      ?.focus();
  }, [step]);

  const validateBasic = () => {
    if (!myName.trim() || !partnerName.trim()) {
      setError('두 사람의 이름을 모두 입력해주세요.');
      const field = !myName.trim() ? 'my-name' : 'partner-name';
      experienceRef.current
        ?.querySelector<HTMLElement>(`[data-basic-field="${field}"]`)
        ?.focus();
      return false;
    }
    if (!myMBTI || !partnerMBTI) {
      setError('두 사람의 MBTI를 모두 선택해주세요.');
      const field = !myMBTI ? 'my-mbti' : 'partner-mbti';
      experienceRef.current
        ?.querySelector<HTMLElement>(`[data-basic-field="${field}"]`)
        ?.focus();
      return false;
    }
    setError('');
    return true;
  };

  const goToMyQuestions = () => {
    if (validateBasic()) setStep('mine');
  };

  const updateAnswer = (
    owner: 'mine' | 'partner',
    questionId: string,
    answer: BalanceAnswer,
  ) => {
    const setter = owner === 'mine' ? setMyAnswers : setPartnerAnswers;
    setter((previous) => ({ ...previous, [questionId]: answer }));
  };

  const answersComplete = (answers: BalanceAnswers) =>
    questions.every(({ id }) => answers[id] !== undefined);

  const focusFirstUnanswered = (answers: BalanceAnswers) => {
    const unanswered = questions.find(({ id }) => answers[id] === undefined);
    if (!unanswered) return;
    experienceRef.current
      ?.querySelector<HTMLElement>(`[data-question-id="${unanswered.id}"]`)
      ?.focus();
  };

  const goToPartnerQuestions = () => {
    if (!answersComplete(myAnswers)) {
      setError('모든 질문에 답해주세요.');
      focusFirstUnanswered(myAnswers);
      return;
    }
    setError('');
    setStep('partner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showResult = () => {
    if (!answersComplete(partnerAnswers) || !myMBTI || !partnerMBTI) {
      setError('모든 질문에 답해주세요.');
      focusFirstUnanswered(partnerAnswers);
      return;
    }

    setResult(
      calculateCompatibility({
        myName: myName.trim(),
        partnerName: partnerName.trim(),
        myMBTI,
        partnerMBTI,
        relationship,
        myAnswers,
        partnerAnswers,
      }),
    );
    setError('');
    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setStep('basic');
    setMyName('');
    setPartnerName('');
    setMyMBTI('');
    setPartnerMBTI('');
    setRelationship('romance');
    setMyAnswers({});
    setPartnerAnswers({});
    setResult(null);
    setError('');
    setToast('');
  };

  const copyShareText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast('결과를 클립보드에 복사했어요.');
    } catch {
      setToast('결과를 복사하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const share = async () => {
    if (!result) return;
    const text = `${result.emoji} ${myName} × ${partnerName}의 ${result.relationshipLabel} 케미\n${result.scores.overallScore}점 · ${result.chemistryType}\n“${result.oneLineSummary}”\n우리의 별명: ${result.coupleNickname}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: '케미체크 결과', text });
      } else await copyShareText(text);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      await copyShareText(text);
    }
  };

  return (
    <section
      ref={experienceRef}
      className="rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-2xl shadow-pink-200/50 backdrop-blur md:p-8"
    >
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl"
        >
          {toast}
        </div>
      )}
      {step !== 'result' && onChooseTest && (
        <TestSelectorBackButton onClick={onChooseTest} />
      )}
      <Progress currentStep={currentStep} />

      {error && (
        <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {step === 'basic' && (
        <BasicStep
          myName={myName}
          partnerName={partnerName}
          myMBTI={myMBTI}
          partnerMBTI={partnerMBTI}
          relationship={relationship}
          onMyNameChange={setMyName}
          onPartnerNameChange={setPartnerName}
          onMyMBTIChange={setMyMBTI}
          onPartnerMBTIChange={setPartnerMBTI}
          onRelationshipChange={setRelationship}
          onNext={goToMyQuestions}
        />
      )}

      {step === 'mine' && (
        <QuestionStep
          name={myName}
          questions={questions}
          answers={myAnswers}
          onAnswer={(id, answer) => updateAnswer('mine', id, answer)}
          onBack={() => setStep('basic')}
          onNext={goToPartnerQuestions}
          buttonLabel={`${partnerName}에게 넘기기`}
        />
      )}

      {step === 'partner' && (
        <QuestionStep
          name={partnerName}
          questions={questions}
          answers={partnerAnswers}
          onAnswer={(id, answer) => updateAnswer('partner', id, answer)}
          onBack={() => setStep('mine')}
          onNext={showResult}
          buttonLabel="우리 케미 확인하기"
          handoff
        />
      )}

      {step === 'result' && result && (
        <ResultCard
          result={result}
          myName={myName}
          partnerName={partnerName}
          onReset={reset}
          onShare={share}
          onChooseTest={onChooseTest}
        />
      )}
    </section>
  );
}

function Progress({ currentStep }: { currentStep: number }) {
  return (
    <div
      className="mb-8"
      role="progressbar"
      aria-label="궁합 테스트 진행 단계"
      aria-valuemin={1}
      aria-valuemax={stepLabels.length}
      aria-valuenow={currentStep + 1}
      aria-valuetext={`${stepLabels[currentStep]} 단계`}
    >
      <div className="mb-3 flex justify-between text-[11px] font-semibold text-slate-500 md:text-xs">
        {stepLabels.map((label, index) => (
          <span key={label} className={index <= currentStep ? 'text-pink-600' : ''}>
            {label}
          </span>
        ))}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-500"
          style={{ width: `${((currentStep + 1) / stepLabels.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

interface BasicStepProps {
  myName: string;
  partnerName: string;
  myMBTI: MBTIType | '';
  partnerMBTI: MBTIType | '';
  relationship: RelationshipType;
  onMyNameChange: (value: string) => void;
  onPartnerNameChange: (value: string) => void;
  onMyMBTIChange: (value: MBTIType | '') => void;
  onPartnerMBTIChange: (value: MBTIType | '') => void;
  onRelationshipChange: (value: RelationshipType) => void;
  onNext: () => void;
}

function BasicStep(props: BasicStepProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        props.onNext();
      }}
    >
      <StepHeading title="어떤 사이인가요?" description="관계에 따라 궁합 해석과 추천이 달라져요." />

      <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4">
        {RELATIONSHIP_OPTIONS.map((option) => {
          const selected = props.relationship === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => props.onRelationshipChange(option.value)}
              className={`rounded-2xl border p-3 text-left transition ${
                selected
                  ? 'border-pink-400 bg-pink-50 ring-2 ring-pink-100'
                  : 'border-slate-200 bg-white hover:border-pink-200'
              }`}
            >
              <span className="text-2xl">{option.icon}</span>
              <strong className="mt-2 block text-sm text-slate-800">{option.label}</strong>
              <span className="mt-1 block text-xs leading-snug text-slate-500">{option.description}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PersonFields
          label="나"
          fieldPrefix="my"
          name={props.myName}
          mbti={props.myMBTI}
          onNameChange={props.onMyNameChange}
          onMBTIChange={props.onMyMBTIChange}
        />
        <PersonFields
          label="상대"
          fieldPrefix="partner"
          name={props.partnerName}
          mbti={props.partnerMBTI}
          onNameChange={props.onPartnerNameChange}
          onMBTIChange={props.onPartnerMBTIChange}
        />
      </div>

      <PrimaryButton>취향 질문 시작하기</PrimaryButton>
    </form>
  );
}

function PersonFields({
  label,
  fieldPrefix,
  name,
  mbti,
  onNameChange,
  onMBTIChange,
}: {
  label: string;
  fieldPrefix: 'my' | 'partner';
  name: string;
  mbti: MBTIType | '';
  onNameChange: (value: string) => void;
  onMBTIChange: (value: MBTIType | '') => void;
}) {
  return (
    <fieldset className="rounded-2xl bg-slate-50 p-4">
      <legend className="px-1 text-sm font-bold text-slate-700">{label}</legend>
      <label className="mt-2 block text-xs font-semibold text-slate-500">
        이름
        <input
          value={name}
          data-basic-field={`${fieldPrefix}-name`}
          maxLength={12}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder={`${label}의 이름`}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        />
      </label>
      <label className="mt-4 block text-xs font-semibold text-slate-500">
        MBTI
        <select
          value={mbti}
          data-basic-field={`${fieldPrefix}-mbti`}
          onChange={(event) => onMBTIChange(event.target.value as MBTIType | '')}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        >
          <option value="">선택하기</option>
          {MBTI_TYPES.map((type) => <option key={type}>{type}</option>)}
        </select>
      </label>
    </fieldset>
  );
}

function QuestionStep({
  name,
  questions,
  answers,
  onAnswer,
  onBack,
  onNext,
  buttonLabel,
  handoff = false,
}: {
  name: string;
  questions: ReturnType<typeof getBalanceQuestions>;
  answers: BalanceAnswers;
  onAnswer: (id: string, answer: BalanceAnswer) => void;
  onBack: () => void;
  onNext: () => void;
  buttonLabel: string;
  handoff?: boolean;
}) {
  return (
    <div>
      {handoff && (
        <div className="mb-6 rounded-2xl bg-violet-50 p-4 text-center text-sm leading-relaxed text-violet-800">
          📱 이제 화면을 <strong>{name}</strong>님에게 넘겨주세요.<br />
          앞사람의 답은 보이지 않으니 편하게 고르면 돼요.
        </div>
      )}
      <StepHeading
        title={`${name}님의 취향`}
        description={`선택한 관계에 맞춘 ${questions.length}개 질문이에요.`}
      />

      <div className="space-y-5">
        {questions.map((question, questionIndex) => (
          <fieldset
            key={question.id}
            data-question-id={question.id}
            tabIndex={-1}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-4"
          >
            <legend className="mb-3 text-sm font-bold text-slate-800">
              <span className="mr-2 text-pink-500">{questionIndex + 1}</span>
              {question.question}
            </legend>
            <div className="grid gap-2 md:grid-cols-2">
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onAnswer(question.id, optionIndex as BalanceAnswer)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      selected
                        ? 'border-violet-400 bg-violet-50 text-violet-800 ring-2 ring-violet-100'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <button type="button" onClick={onBack} className="rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-200">
          이전
        </button>
        <button type="button" onClick={onNext} className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-3 font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5">
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

function StepHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 text-center">
      <h2
        data-step-heading
        tabIndex={-1}
        className="text-2xl font-black text-slate-900 outline-none md:text-3xl"
      >
        {title}
      </h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button type="submit" className="mt-7 w-full rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-4 font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5">
      {children}
    </button>
  );
}
