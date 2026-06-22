import { describe, expect, it } from 'vitest';
import {
  calculateMiniTest,
  ChemistryTestType,
  MINI_TEST_DEFINITIONS,
} from './mini-tests';
import { BalanceAnswers } from './types';

const testTypes: Exclude<ChemistryTestType, 'overall'>[] = [
  'travel',
  'food',
  'conflict',
  'date',
];

function createAnswers(
  testType: Exclude<ChemistryTestType, 'overall'>,
  answer: 0 | 1,
): BalanceAnswers {
  return Object.fromEntries(
    MINI_TEST_DEFINITIONS[testType].questions.map((question) => [question.id, answer]),
  );
}

describe('calculateMiniTest', () => {
  it.each(testTypes)('%s 테스트의 완전 일치 결과를 계산한다', (testType) => {
    const answers = createAnswers(testType, 0);
    const result = calculateMiniTest({
      testType,
      myName: '민준',
      partnerName: '서연',
      myAnswers: answers,
      partnerAnswers: answers,
    });

    expect(result.score).toBe(100);
    expect(result.comparisons).toHaveLength(8);
    expect(result.comparisons.every((comparison) => comparison.matches)).toBe(true);
    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.differences.length).toBeGreaterThan(0);
  });

  it.each(testTypes)('%s 테스트의 완전 불일치 결과를 계산한다', (testType) => {
    const result = calculateMiniTest({
      testType,
      myName: '민준',
      partnerName: '서연',
      myAnswers: createAnswers(testType, 0),
      partnerAnswers: createAnswers(testType, 1),
    });

    expect(result.score).toBe(40);
    expect(result.comparisons.every((comparison) => !comparison.matches)).toBe(true);
    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.differences.length).toBeGreaterThan(0);
  });
});
