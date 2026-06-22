import { CHEMISTRY_TESTS, ChemistryTestType } from '@/lib/mini-tests';

interface TestSelectorProps {
  onSelect: (testType: ChemistryTestType) => void;
}

export default function TestSelector({ onSelect }: TestSelectorProps) {
  return (
    <section>
      <div className="mb-7 text-center">
        <h2 data-step-heading tabIndex={-1} className="text-2xl font-black text-slate-900 outline-none md:text-3xl">
          어떤 케미를 확인할까요?
        </h2>
        <p className="mt-2 text-sm text-slate-500">궁금한 테스트를 골라 두 사람이 함께 답해보세요.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {CHEMISTRY_TESTS.map((test) => (
          <button
            key={test.id}
            type="button"
            onClick={() => onSelect(test.id)}
            className="group rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl"
          >
            <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${test.color} text-2xl text-white shadow-md`}>
              {test.icon}
            </span>
            <strong className="mt-4 block text-lg text-slate-900">{test.title}</strong>
            <span className="mt-2 block text-sm leading-relaxed text-slate-500">{test.description}</span>
            <span className="mt-4 block text-sm font-bold text-pink-600">테스트 시작 →</span>
          </button>
        ))}
      </div>
    </section>
  );
}
