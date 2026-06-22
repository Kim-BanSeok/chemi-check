import ChemistryHub from '@/components/ChemistryHub';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden px-4 py-8 md:py-14">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center md:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm">
            <span>💫</span>
            MBTI부터 여행·음식·데이트까지 보는 우리 사이
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            케미<span className="text-pink-500">체크</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
            궁금한 주제를 골라 두 사람이 직접 답하고, 맞춤 케미 리포트를 확인해보세요.
          </p>
        </header>

        <ChemistryHub />
      </div>
    </main>
  );
}
