import { ChemistryTestType, MINI_TEST_DEFINITIONS } from '@/lib/mini-tests';
import { BalanceAnswers } from '@/lib/types';

type MiniTestType = Exclude<ChemistryTestType, 'overall'>;

export default function SoloResultCard({
  testType,
  name,
  answers,
  onReset,
  onChooseTest,
}: {
  testType: MiniTestType;
  name: string;
  answers: BalanceAnswers;
  onReset: () => void;
  onChooseTest: () => void;
}) {
  const definition = MINI_TEST_DEFINITIONS[testType];
  const firstChoices = definition.questions.filter(({ id }) => answers[id] === 0).length;
  const balanced = firstChoices >= 3 && firstChoices <= 5;
  const profile = balanced
    ? '균형 감각형'
    : firstChoices > 5
      ? '기준이 분명한 계획형'
      : '감각을 따르는 유연형';
  const description = balanced
    ? '상황에 따라 계획과 즉흥성 사이를 유연하게 오가는 편이에요. 함께하는 사람의 취향도 비교적 편하게 반영할 수 있습니다.'
    : firstChoices > 5
      ? '선택할 때 중요하게 보는 기준이 분명한 편이에요. 상대에게 원하는 조건을 미리 알려주면 만족도가 더 높아집니다.'
      : '분위기와 그날의 감각을 따라 선택하는 편이에요. 너무 촘촘한 계획보다는 선택의 여지가 있을 때 편안함을 느낍니다.';

  return (
    <div className="animate-result">
      <div className="text-center">
        <span className="inline-flex rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700">🪞 내 취향 리포트</span>
        <h2 data-step-heading tabIndex={-1} className="mt-5 text-2xl font-black text-slate-900 outline-none md:text-3xl">{name}님의 {definition.title}</h2>
      </div>
      <div className={`my-7 rounded-3xl bg-gradient-to-br ${definition.color} p-7 text-center text-white shadow-xl`}>
        <div className="text-5xl">{definition.icon}</div>
        <h3 className="mt-4 text-2xl font-black">{profile}</h3>
        <p className="mt-3 text-sm leading-6 text-white/90">{description}</p>
      </div>
      <section className="rounded-2xl bg-slate-50 p-5">
        <h3 className="font-black text-slate-900">내 선택 한눈에 보기</h3>
        <ul className="mt-4 space-y-3">
          {definition.questions.map((question) => (
            <li key={question.id} className="rounded-xl bg-white p-3 text-sm">
              <strong className="block text-slate-800">{question.question}</strong>
              <span className="mt-1 block text-violet-700">{question.options[answers[question.id] ?? 0]}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="font-black text-amber-900">잘 맞는 사람을 찾는 팁</h3>
        <p className="mt-2 text-sm leading-7 text-amber-900/80">
          나와 같은 답을 많이 고른 사람은 편안한 호흡을, 다른 답을 고른 사람은 새로운 경험을 줄 수 있어요. 정답보다 서로 포기하기 어려운 선택을 먼저 공유해보세요.
        </p>
      </section>
      <div className="mt-7 grid gap-3 md:grid-cols-2">
        <button type="button" onClick={onReset} className="rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-4 font-bold text-white">다시 분석하기</button>
        <button type="button" onClick={onChooseTest} className="rounded-xl bg-slate-100 px-5 py-4 font-bold text-slate-600">다른 케미 선택</button>
      </div>
    </div>
  );
}
