import { describe, expect, it } from 'vitest';
import {
  calculateBalanceScore,
  calculateCompatibility,
  calculateMBTIScore,
  calculateNameScore,
  calculateOverallScore,
} from './compatibility';
import {
  BalanceAnswers,
  getBalanceQuestions,
  MBTI_TYPES,
  RelationshipType,
} from './types';

const relationships: RelationshipType[] = ['romance', 'some', 'friend', 'coworker'];

function createAnswers(
  relationship: RelationshipType,
  matchingCount: number,
): { mine: BalanceAnswers; partner: BalanceAnswers } {
  const mine: BalanceAnswers = {};
  const partner: BalanceAnswers = {};

  getBalanceQuestions(relationship).forEach((question, index) => {
    mine[question.id] = 0;
    partner[question.id] = index < matchingCount ? 0 : 1;
  });

  return { mine, partner };
}

describe('name score', () => {
  it('is symmetric regardless of name order', () => {
    expect(calculateNameScore('민준', '서연')).toBe(calculateNameScore('서연', '민준'));
  });

  it('always stays within the documented range', () => {
    const samples = ['민준', '서연', 'Alex', '김철수', 'A', '가나다라마바사'];
    for (const first of samples) {
      for (const second of samples) {
        expect(calculateNameScore(first, second)).toBeGreaterThanOrEqual(40);
        expect(calculateNameScore(first, second)).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe('MBTI score', () => {
  it('keeps every MBTI pair in range for every relationship', () => {
    for (const relationship of relationships) {
      for (const first of MBTI_TYPES) {
        for (const second of MBTI_TYPES) {
          const score = calculateMBTIScore(first, second, relationship);
          expect(score).toBeGreaterThanOrEqual(40);
          expect(score).toBeLessThanOrEqual(100);
        }
      }
    }
  });
});

describe('balance and overall scores', () => {
  it('increases as more answers match', () => {
    const scores = Array.from({ length: 11 }, (_, matches) => {
      const answers = createAnswers('romance', matches);
      return calculateBalanceScore({
        myName: '민준',
        partnerName: '서연',
        myMBTI: 'ENFP',
        partnerMBTI: 'ISTJ',
        relationship: 'romance',
        myAnswers: answers.mine,
        partnerAnswers: answers.partner,
      });
    });

    expect(scores).toEqual([...scores].sort((a, b) => a - b));
    expect(scores[0]).toBe(40);
    expect(scores[10]).toBe(100);
  });

  it('applies the 20/40/40 weights', () => {
    expect(calculateOverallScore(50, 70, 90)).toBe(74);
  });

  it('can reach every result tier with valid inputs', () => {
    const reached = new Set<string>();

    for (const relationship of relationships) {
      for (const first of MBTI_TYPES) {
        for (const second of MBTI_TYPES) {
          for (let matches = 0; matches <= 10; matches += 1) {
            const answers = createAnswers(relationship, matches);
            const result = calculateCompatibility({
              myName: `이름${matches}`,
              partnerName: `상대${first}`,
              myMBTI: first,
              partnerMBTI: second,
              relationship,
              myAnswers: answers.mine,
              partnerAnswers: answers.partner,
            });
            reached.add(result.chemistryType);
          }
        }
      }
    }

    expect(reached).toEqual(new Set([
      '찰떡 동기화형',
      '단단한 시너지형',
      '티키타카 성장형',
      '밀당 탐구형',
      '극과 극 자석형',
    ]));
  });

  it('prioritizes relationship-specific answers in personalized guidance', () => {
    const questions = getBalanceQuestions('romance');
    const mine: BalanceAnswers = {};
    const partner: BalanceAnswers = {};

    questions.forEach((question) => {
      mine[question.id] = 0;
      partner[question.id] = question.scope === 'relationship' ? 1 : 0;
    });

    const result = calculateCompatibility({
      myName: '민준',
      partnerName: '서연',
      myMBTI: 'ENFP',
      partnerMBTI: 'ISTJ',
      relationship: 'romance',
      myAnswers: mine,
      partnerAnswers: partner,
    });

    expect(result.conflictPoints).toContain(
      '혼자만의 시간이나 장난의 선을 두고 오해가 생길 수 있어요.',
    );
    expect(result.communicationTips).toContain(
      '괜찮지 않은 행동은 참기 전에 짧고 명확하게 알려주세요.',
    );
  });
});
