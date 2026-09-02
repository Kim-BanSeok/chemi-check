import ChemistryHub from '@/components/ChemistryHub';

const FAQS = [
  {
    q: '몇 명이서 하나요?',
    a: '두 사람이 함께 하는 테스트예요. 한 사람이 먼저 질문에 답하면 초대 링크가 생기고, 그 링크를 상대방에게 보내면 상대방도 같은 질문에 답해서 두 사람의 답을 비교한 리포트를 보여드려요.',
  },
  {
    q: '회원가입이 필요한가요?',
    a: '아니요. 회원가입 없이 바로 시작할 수 있어요.',
  },
  {
    q: '입력한 답변이나 결과가 서버에 저장되나요?',
    a: '두 사람을 연결하기 위한 초대 링크에 답변 정보가 담기지만, 별도 계정이나 서버 DB에 영구 저장하지 않아요. 링크를 잃어버리면 그 세션은 다시 진행해야 해요.',
  },
  {
    q: '이거 진짜 정확한 궁합 진단인가요?',
    a: '아니요. 재미로 보는 성향·취향 비교 콘텐츠예요. MBTI, 여행 스타일, 음식 취향, 데이트 성향 같은 주제로 두 사람의 답을 비교해서 보여드리는 것이지, 심리학적으로 검증된 궁합 진단이 아니에요.',
  },
  {
    q: '무료인가요?',
    a: '네, 모든 테스트를 무료로 이용할 수 있어요.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden px-4 py-8 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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

        <section className="mt-12 md:mt-16">
          <h2 className="mb-4 text-center text-xl font-bold text-slate-900 md:text-2xl">
            자주 묻는 질문
          </h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details
                key={q}
                className="rounded-2xl border border-pink-100 bg-white/80 p-4 shadow-sm"
              >
                <summary className="cursor-pointer font-semibold text-slate-800">
                  {q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
