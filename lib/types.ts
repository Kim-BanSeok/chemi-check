export type MBTIType =
  | 'ISTJ'
  | 'ISFJ'
  | 'INFJ'
  | 'INTJ'
  | 'ISTP'
  | 'ISFP'
  | 'INFP'
  | 'INTP'
  | 'ESTP'
  | 'ESFP'
  | 'ENFP'
  | 'ENTP'
  | 'ESTJ'
  | 'ESFJ'
  | 'ENFJ'
  | 'ENTJ';

export const MBTI_TYPES: MBTIType[] = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
];

export type RelationshipType = 'romance' | 'some' | 'friend' | 'coworker';

export const RELATIONSHIP_OPTIONS = [
  { value: 'romance', label: '연인', icon: '💞', description: '애정 표현과 장기적인 관계' },
  { value: 'some', label: '썸', icon: '💓', description: '설렘과 관계 발전 가능성' },
  { value: 'friend', label: '친구', icon: '🤝', description: '대화와 함께 노는 케미' },
  { value: 'coworker', label: '동료', icon: '🧩', description: '협업과 갈등 해결 방식' },
] as const satisfies ReadonlyArray<{
  value: RelationshipType;
  label: string;
  icon: string;
  description: string;
}>;

export type BalanceAnswer = 0 | 1;
export type QuestionCategory =
  | 'contact'
  | 'plan'
  | 'conflict'
  | 'energy'
  | 'expression'
  | 'trust'
  | 'support'
  | 'feedback'
  | 'boundary'
  | 'growth';

export interface BalanceQuestion {
  id: string;
  scope: 'common' | 'relationship';
  category: QuestionCategory;
  question: string;
  options: readonly [string, string];
}

const COMMON_QUESTIONS: readonly BalanceQuestion[] = [
  {
    id: 'contact',
    scope: 'common',
    category: 'contact',
    question: '연락은 어떻게 하는 게 편해?',
    options: ['자주, 사소한 것도 공유', '필요할 때 집중해서'],
  },
  {
    id: 'plan',
    scope: 'common',
    category: 'plan',
    question: '약속이나 일정은?',
    options: ['미리 꼼꼼하게 계획', '그날 기분 따라 유연하게'],
  },
  {
    id: 'conflict',
    scope: 'common',
    category: 'conflict',
    question: '갈등이 생겼을 때 나는?',
    options: ['바로 이야기해서 해결', '생각을 정리한 뒤 대화'],
  },
  {
    id: 'energy',
    scope: 'common',
    category: 'energy',
    question: '함께 보내고 싶은 시간은?',
    options: ['밖에서 새로운 경험', '편한 공간에서 깊은 대화'],
  },
  {
    id: 'expression',
    scope: 'common',
    category: 'expression',
    question: '마음을 표현하는 방식은?',
    options: ['말과 리액션으로 표현', '행동과 챙김으로 표현'],
  },
];

const RELATIONSHIP_QUESTIONS: Record<RelationshipType, readonly BalanceQuestion[]> = {
  romance: [
    { id: 'romance_space', scope: 'relationship', category: 'boundary', question: '연인 사이 개인 시간은?', options: ['가능하면 함께 보내고 싶어', '각자의 시간도 꼭 필요해'] },
    { id: 'romance_date', scope: 'relationship', category: 'growth', question: '데이트에서 더 중요한 것은?', options: ['새로운 추억과 설렘', '익숙하고 편안한 시간'] },
    { id: 'romance_support', scope: 'relationship', category: 'support', question: '힘들 때 받고 싶은 반응은?', options: ['충분한 공감과 위로', '현실적인 해결책과 도움'] },
    { id: 'romance_future', scope: 'relationship', category: 'trust', question: '미래 이야기는 언제 나누는 편이야?', options: ['초반부터 방향을 확인해', '관계가 깊어진 뒤 자연스럽게'] },
    { id: 'romance_apology', scope: 'relationship', category: 'conflict', question: '사과에서 더 중요한 것은?', options: ['진심이 담긴 말', '달라진 행동과 재발 방지'] },
  ],
  some: [
    { id: 'some_contact', scope: 'relationship', category: 'contact', question: '호감이 있을 때 연락은?', options: ['먼저 자주 표현하는 편', '상대 반응을 보며 천천히'] },
    { id: 'some_signal', scope: 'relationship', category: 'expression', question: '호감 표현은 어느 쪽이 편해?', options: ['분명하게 티 내기', '부담 없게 은근히 표현'] },
    { id: 'some_speed', scope: 'relationship', category: 'growth', question: '관계 발전 속도는?', options: ['확신이 들면 빠르게', '충분히 알아본 뒤 천천히'] },
    { id: 'some_date', scope: 'relationship', category: 'energy', question: '첫 데이트 분위기는?', options: ['활동적이고 대화 많은 곳', '조용하고 편안한 곳'] },
    { id: 'some_clarity', scope: 'relationship', category: 'trust', question: '관계 정의는 어떻게?', options: ['애매함이 길기 전에 확인', '자연스럽게 확실해질 때까지 기다려'] },
  ],
  friend: [
    { id: 'friend_frequency', scope: 'relationship', category: 'contact', question: '친구와 연락하는 빈도는?', options: ['자주 안부를 주고받아', '오랜만이어도 편하면 돼'] },
    { id: 'friend_promise', scope: 'relationship', category: 'trust', question: '친구 사이 약속은?', options: ['웬만하면 반드시 지켜', '상황에 따라 변경할 수 있어'] },
    { id: 'friend_advice', scope: 'relationship', category: 'support', question: '고민 상담을 들을 때?', options: ['우선 충분히 공감해줘', '도움 될 해결책을 찾아줘'] },
    { id: 'friend_joke', scope: 'relationship', category: 'boundary', question: '친한 사이 장난은?', options: ['솔직하고 센 장난도 괜찮아', '선을 지키는 장난이 좋아'] },
    { id: 'friend_activity', scope: 'relationship', category: 'energy', question: '친구와 놀 때 선호하는 것은?', options: ['여럿이 활기차게', '소수로 여유롭게'] },
  ],
  coworker: [
    { id: 'work_deadline', scope: 'relationship', category: 'plan', question: '마감 업무는 어떻게 진행해?', options: ['일찍 완성하고 수정해', '마감에 맞춰 집중해서 완성해'] },
    { id: 'work_feedback', scope: 'relationship', category: 'feedback', question: '피드백은 어떤 방식이 좋아?', options: ['직접적이고 명확하게', '맥락과 장점을 함께 부드럽게'] },
    { id: 'work_role', scope: 'relationship', category: 'trust', question: '협업 역할 분담은?', options: ['처음부터 명확히 나눠', '상황에 따라 유연하게 도와'] },
    { id: 'work_issue', scope: 'relationship', category: 'conflict', question: '문제가 생기면?', options: ['바로 공유하고 함께 해결해', '대안을 정리한 뒤 공유해'] },
    { id: 'work_quality', scope: 'relationship', category: 'growth', question: '업무에서 더 중요한 것은?', options: ['속도와 실행력', '완성도와 정확성'] },
  ],
};

export function getBalanceQuestions(
  relationship: RelationshipType,
): readonly BalanceQuestion[] {
  return [...COMMON_QUESTIONS, ...RELATIONSHIP_QUESTIONS[relationship]];
}

export type BalanceAnswers = Partial<Record<string, BalanceAnswer>>;

export interface CompatibilityInput {
  myName: string;
  partnerName: string;
  myMBTI: MBTIType;
  partnerMBTI: MBTIType;
  relationship: RelationshipType;
  myAnswers: BalanceAnswers;
  partnerAnswers: BalanceAnswers;
}

export interface CompatibilityScores {
  nameScore: number;
  mbtiScore: number;
  balanceScore: number;
  overallScore: number;
}

export interface AnswerComparison {
  id: string;
  question: string;
  myAnswer: string;
  partnerAnswer: string;
  matches: boolean;
}

export interface CompatibilityResult {
  scores: CompatibilityScores;
  relationshipLabel: string;
  chemistryType: string;
  coupleNickname: string;
  oneLineSummary: string;
  description: string;
  emoji: string;
  strengths: string[];
  conflictPoints: string[];
  communicationTips: string[];
  recommendedActivities: string[];
  mbtiInsight: string;
  balanceInsight: string;
  comparisons: AnswerComparison[];
  weeklyMission: string;
}
