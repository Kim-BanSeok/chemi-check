// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { createInviteToken, parseInviteToken } from './invite-link';
import { MINI_TEST_DEFINITIONS } from './mini-tests';

describe('invite link token', () => {
  it('별칭과 답변을 서버 없이 URL용 토큰으로 왕복 변환한다', () => {
    const answers = Object.fromEntries(
      MINI_TEST_DEFINITIONS.travel.questions.map((question, index) => [
        question.id,
        index % 2,
      ]),
    );
    const token = createInviteToken({
      version: 1,
      testType: 'travel',
      inviterName: '민준',
      answers,
    });

    expect(token).not.toContain('+');
    expect(token).not.toContain('/');
    expect(parseInviteToken(token)).toEqual({
      version: 1,
      testType: 'travel',
      inviterName: '민준',
      answers,
    });
  });

  it('손상된 토큰은 거부한다', () => {
    expect(parseInviteToken('broken-token')).toBeNull();
  });
});
