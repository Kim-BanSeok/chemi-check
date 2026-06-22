import {
  AnswerComparison,
  BalanceQuestion,
  CompatibilityInput,
  CompatibilityResult,
  getBalanceQuestions,
  MBTIType,
  RELATIONSHIP_OPTIONS,
  RelationshipType,
} from './types';

const clamp = (score: number, minimum = 40, maximum = 100) =>
  Math.max(minimum, Math.min(maximum, Math.round(score)));

export function calculateNameScore(name1: string, name2: string): number {
  const names = [name1.trim().toLowerCase(), name2.trim().toLowerCase()].sort();
  let hash = 17;

  for (const name of names) {
    for (let index = 0; index < name.length; index += 1) {
      hash = (hash * 31 + name.charCodeAt(index)) % 100000;
    }
  }

  return 40 + (hash % 61);
}

const MBTI_AXIS_SCORES = {
  romance: [[12, 8], [15, 7], [9, 15], [9, 13]],
  some: [[10, 12], [13, 9], [8, 16], [8, 14]],
  friend: [[10, 12], [12, 10], [10, 14], [8, 14]],
  coworker: [[9, 13], [14, 8], [13, 10], [12, 10]],
} as const satisfies Record<RelationshipType, readonly (readonly [number, number])[]>;

export function calculateMBTIScore(
  mbti1: MBTIType,
  mbti2: MBTIType,
  relationship: RelationshipType = 'romance',
): number {
  let score = 35;
  const axisScores = MBTI_AXIS_SCORES[relationship];

  for (let index = 0; index < 4; index += 1) {
    const [sameScore, differentScore] = axisScores[index];
    score += mbti1[index] === mbti2[index] ? sameScore : differentScore;
  }

  return clamp(score);
}

export function calculateBalanceScore(input: CompatibilityInput): number {
  const questions = getBalanceQuestions(input.relationship);
  const matches = questions.filter(
    ({ id }) => input.myAnswers[id] === input.partnerAnswers[id],
  ).length;

  return clamp(35 + (matches / questions.length) * 65);
}

export function calculateOverallScore(
  nameScore: number,
  mbtiScore: number,
  balanceScore: number,
): number {
  return clamp(nameScore * 0.2 + mbtiScore * 0.4 + balanceScore * 0.4);
}

function getChemistryProfile(score: number) {
  if (score >= 90) {
    return {
      type: '찰떡 동기화형',
      emoji: '💘',
      summary: '말하지 않아도 박자가 맞는 고밀도 케미',
      description: '두 사람은 기본 성향과 생활 리듬이 자연스럽게 맞아, 함께 있을 때 크게 노력하지 않아도 편안함을 느끼기 쉬운 조합이에요. 비슷한 부분은 빠른 공감대를 만들고, 차이도 새로운 매력으로 받아들일 가능성이 높아요.',
    };
  }
  if (score >= 80) {
    return {
      type: '단단한 시너지형',
      emoji: '✨',
      summary: '편안함 속에서 서로를 성장시키는 케미',
      description: '공통점은 관계에 안정감을 만들고, 적당한 차이는 서로에게 새로운 자극을 주는 균형 좋은 조합이에요. 중요한 순간에 기대하는 반응을 솔직하게 알려준다면 더 단단한 관계로 발전할 수 있어요.',
    };
  }
  if (score >= 70) {
    return {
      type: '티키타카 성장형',
      emoji: '🌱',
      summary: '알아갈수록 매력이 커지는 발전형 케미',
      description: '처음부터 모든 것이 맞기보다는 대화를 거듭할수록 서로의 사용법을 발견하는 성장형 조합이에요. 차이를 관심 부족으로 단정하지 않고 질문하는 습관이 관계의 만족도를 높여줘요.',
    };
  }
  if (score >= 60) {
    return {
      type: '밀당 탐구형',
      emoji: '🧭',
      summary: '차이를 번역하면 특별해지는 반전 케미',
      description: '표현 방식과 기대에서 차이를 느낄 수 있지만, 서로의 기준을 알게 되면 다른 관계에서는 얻기 힘든 균형을 만들 수 있어요. 원하는 행동을 구체적으로 말하는 것이 중요해요.',
    };
  }
  return {
    type: '극과 극 자석형',
    emoji: '🧲',
    summary: '서로 다른 세계가 만나 생기는 예측불가 케미',
    description: '익숙한 방식과 중요하게 생각하는 기준이 꽤 달라 의식적인 대화가 필요한 조합이에요. 누가 옳은지를 정하기보다 맞춰야 할 부분과 자유롭게 둘 부분을 구분하면 특별한 관계가 될 수 있어요.',
  };
}

function getMBTIInsight(first: MBTIType, second: MBTIType): string {
  const insights = [
    first[0] === second[0]
      ? '에너지를 충전하는 방식이 비슷해 함께 있을 때 리듬을 맞추기 쉬워요.'
      : '활동과 휴식의 필요량이 다를 수 있어 각자의 충전 시간을 존중하는 것이 중요해요.',
    first[1] === second[1]
      ? '정보를 받아들이는 방식이 비슷해 설명과 계획을 빠르게 이해할 수 있어요.'
      : '한 사람은 구체적인 사실을, 다른 사람은 의미와 가능성을 먼저 보므로 결론과 배경을 함께 말해보세요.',
    first[2] === second[2]
      ? '판단 기준이 비슷해 중요한 결정을 합의하기 쉽지만 놓치기 쉬운 반대 관점도 확인해보세요.'
      : '논리와 공감이 서로를 보완하므로 지금 필요한 것이 해결책인지 위로인지 먼저 확인하면 좋아요.',
    first[3] === second[3]
      ? '계획을 다루는 리듬이 비슷해 약속과 일상을 운영하기 편해요.'
      : '큰 틀은 미리 정하고 세부 내용은 열어두는 방식이 두 사람 모두에게 편해요.',
  ];

  return insights.join(' ');
}

function createComparisons(
  input: CompatibilityInput,
  questions: readonly BalanceQuestion[],
): AnswerComparison[] {
  return questions.map((question) => {
    const myAnswer = input.myAnswers[question.id];
    const partnerAnswer = input.partnerAnswers[question.id];

    return {
      id: question.id,
      question: question.question,
      myAnswer: myAnswer === undefined ? '미응답' : question.options[myAnswer],
      partnerAnswer: partnerAnswer === undefined ? '미응답' : question.options[partnerAnswer],
      matches: myAnswer !== undefined && myAnswer === partnerAnswer,
    };
  });
}

function getBalanceInsight(comparisons: AnswerComparison[]): string {
  const matches = comparisons.filter((comparison) => comparison.matches);
  const differences = comparisons.filter((comparison) => !comparison.matches);

  if (differences.length === 0) {
    return `열 가지 취향이 모두 일치해 일상에서 기대하는 반응이 매우 비슷해요. 특히 “${matches[0].question}” 같은 기본 리듬이 같아 상대의 행동을 해석하는 데 에너지를 적게 써도 돼요. 익숙함이 단조로움이 되지 않도록 새로운 경험을 번갈아 제안해보세요.`;
  }
  if (differences.length <= 3) {
    return `열 가지 취향 중 ${matches.length}개가 일치해 전반적인 리듬이 잘 맞아요. “${matches[0].question}”에서는 자연스러운 공감대를 만들 수 있고, “${differences[0].question}”에서는 같은 상황을 다르게 받아들일 수 있어요. 상황에 따라 누구의 방식을 따를지 미리 정하면 작은 서운함이 쌓이는 것을 막을 수 있어요.`;
  }
  return `열 가지 취향 중 ${matches.length}개가 일치하고 ${differences.length}개에서 차이가 나타났어요. 특히 “${differences[0].question}”과 “${differences[1].question}”에서는 원하는 방식을 구체적으로 설명해보세요. 취향의 차이는 마음의 크기가 아니라 편안함을 느끼는 조건의 차이예요.`;
}

const CATEGORY_GUIDANCE: Record<string, {
  strength: string;
  conflict: string;
  tip: string;
}> = {
  contact: { strength: '연락에 기대하는 리듬이 비슷해 불필요한 눈치를 덜 볼 수 있어요.', conflict: '연락 빈도를 관심의 크기로 해석하면 서운함이 생길 수 있어요.', tip: '바쁜 시간대와 편한 연락 주기를 숫자보다 상황 중심으로 합의해보세요.' },
  plan: { strength: '약속과 계획을 다루는 방식이 비슷해 함께 움직이기 편해요.', conflict: '계획의 구체성과 변경 가능성을 두고 답답함을 느낄 수 있어요.', tip: '변경이 어려운 큰 일정과 유연하게 바꿀 세부 일정을 구분하세요.' },
  conflict: { strength: '갈등을 풀어가는 속도가 비슷해 감정 회복이 빠른 편이에요.', conflict: '한 사람은 즉시 대화를, 다른 사람은 정리할 시간을 원할 수 있어요.', tip: '대화를 미루더라도 다시 이야기할 정확한 시간을 약속하세요.' },
  expression: { strength: '마음을 전달하고 확인하는 방식이 비슷해 애정을 알아차리기 쉬워요.', conflict: '말과 행동 중 무엇을 애정 표현으로 보는지가 다를 수 있어요.', tip: '내가 주기 편한 표현보다 상대가 받기 쉬운 표현을 한 번씩 선택하세요.' },
  energy: { strength: '함께 쉬고 노는 방식이 비슷해 만족도 높은 시간을 만들기 쉬워요.', conflict: '활동량과 장소 취향이 달라 한쪽만 계속 맞추게 될 수 있어요.', tip: '활동적인 일정과 편안한 일정을 번갈아 정해보세요.' },
  trust: { strength: '약속과 관계의 확실성에 대한 기준이 비슷해 신뢰를 쌓기 좋아요.', conflict: '확신을 확인하는 시점이 달라 한쪽은 부담, 다른 쪽은 불안을 느낄 수 있어요.', tip: '관계나 역할에 관해 지금 확정할 것과 나중에 정할 것을 구분하세요.' },
  support: { strength: '힘든 순간에 받고 싶은 도움의 방식이 비슷해 서로에게 안정감을 줘요.', conflict: '위로가 필요한 순간에 해결책부터 제시하면 마음이 닫힐 수 있어요.', tip: '“공감이 필요해, 해결책이 필요해?”라고 먼저 물어보세요.' },
  feedback: { strength: '의견을 주고받는 방식이 비슷해 솔직한 협업이 가능해요.', conflict: '직접적인 말투와 부드러운 설명 사이에서 의도가 왜곡될 수 있어요.', tip: '관찰한 사실, 영향, 다음 행동 순서로 피드백하세요.' },
  boundary: { strength: '개인적인 선과 친밀감의 기준이 비슷해 편안한 거리를 유지해요.', conflict: '혼자만의 시간이나 장난의 선을 두고 오해가 생길 수 있어요.', tip: '괜찮지 않은 행동은 참기 전에 짧고 명확하게 알려주세요.' },
  growth: { strength: '관계와 경험에서 추구하는 방향이 비슷해 함께 성장하기 좋아요.', conflict: '속도와 완성도, 새로움과 안정 중 우선순위가 다를 수 있어요.', tip: '이번 선택에서 무엇을 우선할지 한 가지 기준만 먼저 합의하세요.' },
};

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function selectCategories(
  comparisons: AnswerComparison[],
  questionById: Map<string, BalanceQuestion>,
  matches: boolean,
): BalanceQuestion['category'][] {
  const candidates = comparisons
    .filter((comparison) => comparison.matches === matches)
    .map((comparison) => questionById.get(comparison.id))
    .filter((question): question is BalanceQuestion => Boolean(question));
  const relationshipCategory = candidates.find(
    (question) => question.scope === 'relationship',
  )?.category;
  const commonCategory = candidates.find(
    (question) => question.scope === 'common',
  )?.category;

  return unique(
    [relationshipCategory, commonCategory, ...candidates.map(({ category }) => category)]
      .filter((category): category is BalanceQuestion['category'] => Boolean(category)),
  ).slice(0, 2);
}

function createPersonalizedContent(
  input: CompatibilityInput,
  questions: readonly BalanceQuestion[],
  comparisons: AnswerComparison[],
) {
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const matchingCategories = selectCategories(comparisons, questionById, true);
  const differingCategories = selectCategories(comparisons, questionById, false);

  const relationshipBase = {
    romance: {
      strength: '서로의 일상에 안정감과 설렘을 함께 만들 가능성이 있어요.',
      conflict: '사랑의 크기보다 사랑을 전달하는 방식에서 오해가 생길 수 있어요.',
      tip: '원하는 애정 표현을 “알아서”가 아니라 구체적인 행동으로 말해보세요.',
      activities: ['서로를 위한 반나절 데이트 코스 짜기', '플레이리스트를 교환하고 이유 나누기'],
    },
    some: {
      strength: '서로 다른 매력이 호기심과 설렘을 오래 유지해줘요.',
      conflict: '관계에 대한 기대를 혼자 추측하면 타이밍이 엇갈릴 수 있어요.',
      tip: '호감은 모호한 신호보다 부담 없는 작은 행동으로 꾸준히 보여주세요.',
      activities: ['취향을 알 수 있는 전시나 소품숍 가기', '메뉴를 하나씩 고르는 가벼운 데이트'],
    },
    friend: {
      strength: '부담 없이 솔직한 대화를 나누며 경험의 폭을 넓힐 수 있어요.',
      conflict: '친밀감의 기준이 달라 약속이나 장난에서 오해가 생길 수 있어요.',
      tip: '서운한 일은 농담으로 넘기지 말고 짧게라도 직접 말하세요.',
      activities: ['협동 보드게임이나 방탈출 도전', '서로의 최애 콘텐츠 함께 보기'],
    },
    coworker: {
      strength: '서로 다른 업무 관점이 결과물의 완성도를 높일 수 있어요.',
      conflict: '속도와 완성도의 우선순위가 다르면 마찰이 생길 수 있어요.',
      tip: '업무 시작 전에 완료 기준, 담당자, 마감 시간을 명확히 합의하세요.',
      activities: ['15분 커피챗으로 업무 방식 공유', '서로의 강점에 맞춰 역할 바꿔보기'],
    },
  }[input.relationship];

  return {
    strengths: unique([
      ...matchingCategories.map((category) => CATEGORY_GUIDANCE[category].strength),
      relationshipBase.strength,
    ]),
    conflictPoints: unique([
      ...differingCategories.map((category) => CATEGORY_GUIDANCE[category].conflict),
      relationshipBase.conflict,
    ]),
    communicationTips: unique([
      ...differingCategories.map((category) => CATEGORY_GUIDANCE[category].tip),
      relationshipBase.tip,
    ]),
    recommendedActivities: relationshipBase.activities,
  };
}

function getRelationshipOutlook(relationship: RelationshipType): string {
  return {
    romance: '연인 관계에서는 연락, 표현, 혼자만의 시간에 관한 기준을 솔직하게 나눌수록 안정감이 커져요.',
    some: '썸 관계에서는 상대의 반응을 혼자 해석하기보다 가볍고 분명한 표현을 주고받는 것이 중요해요.',
    friend: '친구 관계에서는 만나는 횟수보다 필요할 때 편하게 찾을 수 있는 신뢰가 더 중요해요.',
    coworker: '동료 관계에서는 성격의 유사성보다 역할과 기대치를 명확하게 합의하는지가 더 중요해요.',
  }[relationship];
}

function createWeeklyMission(
  comparisons: AnswerComparison[],
  communicationTips: string[],
): string {
  const firstDifference = comparisons.find((comparison) => !comparison.matches);
  if (!firstDifference) {
    return '이번 주에는 평소 하지 않던 활동을 한 가지씩 제안하고, 둘 중 하나를 함께 실행해보세요.';
  }
  return `“${firstDifference.question}”에 대해 각자 원하는 방식을 3분씩 설명하고, 이번 주에 지킬 작은 규칙 하나를 정해보세요. ${communicationTips[0]}`;
}

function createNickname(input: CompatibilityInput, score: number): string {
  const first = input.myName.trim().slice(0, 1);
  const second = input.partnerName.trim().slice(0, 1);
  const suffix = score >= 85 ? '찰떡단' : score >= 70 ? '케미즈' : '탐험대';
  return `${first}${second} ${suffix}`;
}

export function calculateCompatibility(input: CompatibilityInput): CompatibilityResult {
  const questions = getBalanceQuestions(input.relationship);
  const nameScore = calculateNameScore(input.myName, input.partnerName);
  const mbtiScore = calculateMBTIScore(input.myMBTI, input.partnerMBTI, input.relationship);
  const balanceScore = calculateBalanceScore(input);
  const overallScore = calculateOverallScore(nameScore, mbtiScore, balanceScore);
  const profile = getChemistryProfile(overallScore);
  const comparisons = createComparisons(input, questions);
  const content = createPersonalizedContent(input, questions, comparisons);
  const relationshipLabel =
    RELATIONSHIP_OPTIONS.find(({ value }) => value === input.relationship)?.label ?? '';

  return {
    scores: { nameScore, mbtiScore, balanceScore, overallScore },
    relationshipLabel,
    chemistryType: profile.type,
    coupleNickname: createNickname(input, overallScore),
    oneLineSummary: profile.summary,
    description: `${profile.description}\n\n${getRelationshipOutlook(input.relationship)}`,
    emoji: profile.emoji,
    ...content,
    mbtiInsight: getMBTIInsight(input.myMBTI, input.partnerMBTI),
    balanceInsight: getBalanceInsight(comparisons),
    comparisons,
    weeklyMission: createWeeklyMission(comparisons, content.communicationTips),
  };
}
