import { BalanceAnswer, BalanceAnswers } from './types';

export type ChemistryTestType = 'overall' | 'travel' | 'food' | 'conflict' | 'date';

export interface ChemistryTestOption {
  id: ChemistryTestType;
  title: string;
  icon: string;
  description: string;
  color: string;
}

export const CHEMISTRY_TESTS: readonly ChemistryTestOption[] = [
  { id: 'overall', title: '종합 케미', icon: '💫', description: '이름, MBTI, 관계별 취향으로 보는 상세 궁합', color: 'from-pink-500 to-violet-500' },
  { id: 'travel', title: '여행 케미', icon: '✈️', description: '계획, 예산, 숙소와 여행 역할까지 확인', color: 'from-sky-500 to-cyan-500' },
  { id: 'food', title: '음식 케미', icon: '🍽️', description: '메뉴 선택부터 매운맛, 디저트 취향까지', color: 'from-orange-500 to-amber-500' },
  { id: 'conflict', title: '싸움 해결 케미', icon: '🤝', description: '갈등 속도, 사과와 화해 방식을 분석', color: 'from-rose-500 to-red-500' },
  { id: 'date', title: '데이트·놀거리 케미', icon: '🎡', description: '둘에게 맞는 분위기와 코스를 추천', color: 'from-violet-500 to-indigo-500' },
] as const;

export interface MiniQuestion {
  id: string;
  question: string;
  options: readonly [string, string];
}

interface MiniTestDefinition {
  title: string;
  icon: string;
  color: string;
  questions: readonly MiniQuestion[];
  activities: readonly string[];
  mission: string;
  highType: string;
  middleType: string;
  lowType: string;
  highSummary: string;
  middleSummary: string;
  lowSummary: string;
}

export const MINI_TEST_DEFINITIONS: Record<Exclude<ChemistryTestType, 'overall'>, MiniTestDefinition> = {
  travel: {
    title: '여행 케미',
    icon: '✈️',
    color: 'from-sky-500 to-cyan-500',
    questions: [
      { id: 'travel_plan', question: '여행 계획은 어느 정도가 좋아?', options: ['시간대별로 미리 계획', '큰 목적지만 정하고 즉흥적으로'] },
      { id: 'travel_budget', question: '여행 예산에서 우선하는 것은?', options: ['가성비와 합리적인 소비', '특별한 경험에는 과감하게'] },
      { id: 'travel_lodging', question: '숙소를 고를 때 더 중요한 것은?', options: ['위치와 이동 편의', '분위기와 숙소 자체의 매력'] },
      { id: 'travel_pace', question: '하루 여행 일정은?', options: ['여러 장소를 알차게', '한두 장소를 여유롭게'] },
      { id: 'travel_food', question: '현지 음식 선택은?', options: ['검증된 맛집 위주', '처음 보는 메뉴도 도전'] },
      { id: 'travel_photo', question: '여행 사진은 얼마나 찍어?', options: ['기록을 위해 많이 찍어', '눈으로 즐기고 조금만 찍어'] },
      { id: 'travel_morning', question: '여행지의 아침은?', options: ['일찍 시작해서 꽉 채워', '늦잠과 여유로운 브런치'] },
      { id: 'travel_problem', question: '계획이 틀어지면?', options: ['빠르게 대안을 다시 세워', '상황 자체를 즐기며 바꿔'] },
    ],
    activities: ['2박 3일 도시 탐방', '휴양지에서 하루는 자유 일정', '각자 하루씩 여행 코스 담당'],
    mission: '가고 싶은 여행지 하나를 정하고, 서로 절대 포기할 수 없는 조건을 한 가지씩 말해보세요.',
    highType: '환상의 여행 메이트',
    middleType: '역할 분담 원정대',
    lowType: '극과 극 모험단',
    highSummary: '여행의 속도와 기준이 자연스럽게 맞는 조합',
    middleSummary: '서로 다른 장점을 역할로 나누면 강해지는 조합',
    lowSummary: '여행 규칙 두 가지만 정하면 의외로 재미있는 조합',
  },
  food: {
    title: '음식 케미',
    icon: '🍽️',
    color: 'from-orange-500 to-amber-500',
    questions: [
      { id: 'food_menu', question: '메뉴 선택은 어떻게 해?', options: ['미리 찾아보고 골라', '그날 당기는 음식으로'] },
      { id: 'food_spicy', question: '매운 음식은?', options: ['매워도 스트레스 풀려', '순하고 편한 맛이 좋아'] },
      { id: 'food_new', question: '새로운 음식 도전은?', options: ['처음 보는 메뉴도 환영', '익숙하고 검증된 메뉴 선호'] },
      { id: 'food_share', question: '여럿이 먹을 때 주문은?', options: ['여러 메뉴를 함께 나눠', '각자 원하는 메뉴를 먹어'] },
      { id: 'food_speed', question: '식사 속도는?', options: ['빠르게 먹는 편', '천천히 대화하며 먹어'] },
      { id: 'food_dessert', question: '식사 후 디저트는?', options: ['배불러도 디저트는 별도', '식사로 충분해'] },
      { id: 'food_night', question: '늦은 밤 야식은?', options: ['좋은 메뉴가 있으면 먹어', '밤에는 가볍게 참는 편'] },
      { id: 'food_wait', question: '맛집 대기 시간은?', options: ['맛있다면 오래 기다려도 돼', '대기 없는 다른 곳으로 가'] },
    ],
    activities: ['서로의 최애 맛집 교환 방문', '메뉴 세 개를 골라 미니 먹방', '새로운 나라 음식 도전'],
    mission: '각자의 최애 음식과 절대 못 먹는 음식을 하나씩 공유하고 다음 식사 메뉴를 함께 골라보세요.',
    highType: '한입 찰떡단',
    middleType: '메뉴 타협의 달인',
    lowType: '각자 메뉴 평화주의자',
    highSummary: '메뉴 고민 없이 한 상을 즐길 수 있는 조합',
    middleSummary: '한 끼씩 번갈아 선택하면 만족도가 높은 조합',
    lowSummary: '각자 메뉴를 존중할수록 평화로운 미식 조합',
  },
  conflict: {
    title: '싸움 해결 케미',
    icon: '🤝',
    color: 'from-rose-500 to-red-500',
    questions: [
      { id: 'conflict_timing', question: '서운한 일이 생기면?', options: ['바로 말하고 풀고 싶어', '생각을 정리할 시간이 필요해'] },
      { id: 'conflict_tone', question: '대화에서 더 중요한 것은?', options: ['핵심을 솔직하고 분명하게', '상처받지 않는 말투와 분위기'] },
      { id: 'conflict_need', question: '힘들 때 먼저 필요한 것은?', options: ['공감과 위로', '해결책과 현실적인 도움'] },
      { id: 'conflict_apology', question: '좋은 사과는?', options: ['진심 어린 말과 설명', '달라진 행동과 재발 방지'] },
      { id: 'conflict_space', question: '싸운 뒤 연락은?', options: ['연락을 이어가며 해결', '잠시 거리를 두고 진정'] },
      { id: 'conflict_past', question: '이전 갈등 이야기는?', options: ['관련 있다면 다시 말할 수 있어', '지난 일은 다시 꺼내지 않아'] },
      { id: 'conflict_finish', question: '화해가 됐다고 느끼는 순간은?', options: ['서로 충분히 이야기했을 때', '평소처럼 행동이 편해졌을 때'] },
      { id: 'conflict_compromise', question: '의견이 끝까지 다르면?', options: ['명확한 결론을 정해야 해', '다름을 인정하고 넘어갈 수 있어'] },
    ],
    activities: ['갈등 대화 규칙 세 가지 정하기', '서로 듣고 싶은 사과 문장 써보기', '감정 온도 1~10으로 말하는 연습'],
    mission: '갈등이 생겼을 때 필요한 시간과 듣고 싶은 첫 문장을 서로 한 가지씩 알려주세요.',
    highType: '회복 탄력 듀오',
    middleType: '번역이 필요한 화해팀',
    lowType: '속도 조절 협상단',
    highSummary: '갈등이 생겨도 회복 과정의 박자가 맞는 조합',
    middleSummary: '서로의 화해 언어를 알면 훨씬 단단해지는 조합',
    lowSummary: '대화 시작 시간만 합의해도 큰 변화가 생기는 조합',
  },
  date: {
    title: '데이트·놀거리 케미',
    icon: '🎡',
    color: 'from-violet-500 to-indigo-500',
    questions: [
      { id: 'date_place', question: '함께 놀 때 더 끌리는 곳은?', options: ['야외와 새로운 장소', '실내와 편안한 공간'] },
      { id: 'date_energy', question: '놀거리 스타일은?', options: ['몸을 쓰는 활동적인 체험', '대화와 감상 중심의 활동'] },
      { id: 'date_plan', question: '코스는 어떻게 정해?', options: ['미리 예약하고 계획해', '만나서 즉흥적으로 정해'] },
      { id: 'date_crowd', question: '사람 많은 핫플은?', options: ['기다려도 인기 장소가 좋아', '조용하고 한적한 곳이 좋아'] },
      { id: 'date_time', question: '약속 시간대는?', options: ['낮부터 길게 만나기', '저녁에 짧고 집중해서'] },
      { id: 'date_repeat', question: '마음에 든 장소는?', options: ['자주 다시 가도 좋아', '매번 새로운 곳에 가고 싶어'] },
      { id: 'date_cost', question: '놀거리 비용은?', options: ['특별하면 비용을 써도 돼', '부담 없이 자주 만나는 게 좋아'] },
      { id: 'date_rest', question: '일정 중간에 쉬는 시간은?', options: ['흐름을 이어서 계속 움직여', '카페나 공원에서 충분히 쉬어'] },
    ],
    activities: ['전시와 맛집을 묶은 반나절 코스', '방탈출 또는 공방 체험', '간식과 함께 야간 산책'],
    mission: '각자 하고 싶은 활동을 하나씩 적고, 이번 주에는 둘을 한 코스로 연결해보세요.',
    highType: '완벽한 코스 메이트',
    middleType: '반반 취향 믹서',
    lowType: '번갈아 놀기 탐험대',
    highSummary: '같은 장소에서도 비슷한 즐거움을 찾는 조합',
    middleSummary: '활동과 휴식을 섞으면 만족도가 높은 조합',
    lowSummary: '데이트 주도권을 번갈아 가지면 매번 새로워지는 조합',
  },
};

export interface MiniTestInput {
  testType: Exclude<ChemistryTestType, 'overall'>;
  myName: string;
  partnerName: string;
  myAnswers: BalanceAnswers;
  partnerAnswers: BalanceAnswers;
}

export interface MiniComparison {
  id: string;
  question: string;
  myAnswer: string;
  partnerAnswer: string;
  matches: boolean;
}

export interface MiniTestResult {
  testType: Exclude<ChemistryTestType, 'overall'>;
  title: string;
  icon: string;
  color: string;
  score: number;
  type: string;
  summary: string;
  description: string;
  strengths: string[];
  differences: string[];
  recommendations: string[];
  mission: string;
  comparisons: MiniComparison[];
}

export function calculateMiniTest(input: MiniTestInput): MiniTestResult {
  const definition = MINI_TEST_DEFINITIONS[input.testType];
  const comparisons = definition.questions.map((question) => {
    const mine = input.myAnswers[question.id] as BalanceAnswer;
    const partner = input.partnerAnswers[question.id] as BalanceAnswer;
    return {
      id: question.id,
      question: question.question,
      myAnswer: question.options[mine],
      partnerAnswer: question.options[partner],
      matches: mine === partner,
    };
  });
  const matches = comparisons.filter((comparison) => comparison.matches);
  const differences = comparisons.filter((comparison) => !comparison.matches);
  const score = 40 + Math.round((matches.length / definition.questions.length) * 60);
  const high = score >= 80;
  const middle = score >= 60;

  return {
    testType: input.testType,
    title: definition.title,
    icon: definition.icon,
    color: definition.color,
    score,
    type: high ? definition.highType : middle ? definition.middleType : definition.lowType,
    summary: high ? definition.highSummary : middle ? definition.middleSummary : definition.lowSummary,
    description: `${input.myName}님과 ${input.partnerName}님은 ${definition.questions.length}개 질문 중 ${matches.length}개에서 같은 선택을 했어요. ${differences.length === 0 ? '기본 취향과 행동 방식이 매우 비슷해 자연스럽게 호흡을 맞추기 쉬워요.' : `특히 “${differences[0].question}”에서는 기대하는 방식이 다르므로 상대의 선택을 미리 확인하면 더 편해져요.`}`,
    strengths: matches.length > 0
      ? matches.slice(0, 3).map((comparison) => `“${comparison.question}”에서 같은 기준을 가지고 있어요.`)
      : ['선택은 달라도 서로에게 새로운 방식과 경험을 알려줄 수 있어요.'],
    differences: differences.length > 0
      ? differences.slice(0, 3).map((comparison) => `“${comparison.question}”에서는 서로 다른 방식을 선호해요.`)
      : ['큰 차이가 적어 별도의 조율 없이도 편하게 선택할 수 있어요.'],
    recommendations: [...definition.activities],
    mission: definition.mission,
    comparisons,
  };
}
