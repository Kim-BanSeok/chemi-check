import { ChemistryTestOption } from '@/lib/mini-tests';
import TestSelectorBackButton from '@/components/TestSelectorBackButton';

export type ParticipationMode = 'together' | 'predict' | 'invite' | 'solo' | 'random';

const modes: readonly {
  id: ParticipationMode;
  icon: string;
  title: string;
  description: string;
  badge?: string;
}[] = [
  { id: 'together', icon: '👥', title: '같이 테스트하기', description: '한 기기에서 두 사람이 차례대로 직접 답해요.', badge: '기본' },
  { id: 'predict', icon: '🔮', title: '상대 답변 예상하기', description: '혼자서 상대방이 고를 것 같은 답을 선택해요.' },
  { id: 'invite', icon: '🔗', title: '초대 링크 보내기', description: '내 답변을 URL에 담아 상대방에게 전달해요.', badge: '서버 없음' },
  { id: 'solo', icon: '🪞', title: '내 취향만 분석하기', description: '상대 입력 없이 나의 성향과 추천을 확인해요.' },
  { id: 'random', icon: '🎲', title: '랜덤 상대와 비교하기', description: '재미용 무작위 답변과 즉시 케미를 비교해요.' },
] as const;

export default function ParticipationSelector({
  test,
  onSelect,
  onBack,
}: {
  test: ChemistryTestOption;
  onSelect: (mode: ParticipationMode) => void;
  onBack: () => void;
}) {
  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-2xl shadow-pink-200/50 backdrop-blur md:p-8">
      <TestSelectorBackButton onClick={onBack} label="다른 케미 선택" />
      <div className="text-center">
        <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${test.color} text-3xl text-white shadow-lg`}>
          {test.icon}
        </span>
        <h2 className="mt-4 text-2xl font-black text-slate-900 md:text-3xl">{test.title}, 어떻게 할까요?</h2>
        <p className="mt-2 text-sm text-slate-500">지금 상황에 맞는 참여 방식을 골라주세요.</p>
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-2">
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => onSelect(mode.id)}
            className="group relative rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-pink-300 hover:shadow-lg"
          >
            {mode.badge && (
              <span className="absolute right-3 top-3 rounded-full bg-pink-50 px-2 py-1 text-[10px] font-black text-pink-600">{mode.badge}</span>
            )}
            <span className="text-2xl">{mode.icon}</span>
            <strong className="mt-2 block text-base text-slate-900">{mode.title}</strong>
            <span className="mt-1 block pr-8 text-xs leading-5 text-slate-500">{mode.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
