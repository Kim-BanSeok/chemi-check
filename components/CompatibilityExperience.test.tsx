// @vitest-environment jsdom

import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CompatibilityExperience from './CompatibilityExperience';

async function fillBasicInformation(
  user: ReturnType<typeof userEvent.setup>,
  relationship = '친구',
) {
  await user.click(screen.getByRole('button', { name: new RegExp(relationship) }));
  const nameInputs = screen.getAllByLabelText('이름');
  const mbtiSelects = screen.getAllByLabelText('MBTI');

  await user.type(nameInputs[0], '민준');
  await user.type(nameInputs[1], '서연');
  await user.selectOptions(mbtiSelects[0], 'ENFP');
  await user.selectOptions(mbtiSelects[1], 'ISTJ');

  return { nameInputs, mbtiSelects };
}

async function answerEveryQuestion(
  user: ReturnType<typeof userEvent.setup>,
  optionIndex: number,
) {
  const questionGroups = document.querySelectorAll<HTMLElement>('[data-question-id]');
  for (const questionGroup of questionGroups) {
    const options = within(questionGroup).getAllByRole('button');
    await user.click(options[optionIndex]);
  }
}

describe('CompatibilityExperience', () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });
  });

  it('returns to the test selector when the callback is provided', async () => {
    const user = userEvent.setup();
    const onChooseTest = vi.fn();
    render(<CompatibilityExperience onChooseTest={onChooseTest} />);

    await user.click(screen.getByRole('button', { name: '← 테스트 선택으로' }));

    expect(onChooseTest).toHaveBeenCalledOnce();
  });

  it('submits the basic form with Enter and shows relationship-specific questions', async () => {
    const user = userEvent.setup();
    render(<CompatibilityExperience />);
    const { nameInputs } = await fillBasicInformation(user);

    await user.click(nameInputs[1]);
    await user.keyboard('{Enter}');

    const heading = await screen.findByRole('heading', { name: '민준님의 취향' });
    expect(heading).toHaveFocus();
    expect(screen.getByText('친구와 연락하는 빈도는?')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
  });

  it('focuses the first unanswered question when attempting to continue', async () => {
    const user = userEvent.setup();
    render(<CompatibilityExperience />);
    await fillBasicInformation(user);
    await user.click(screen.getByRole('button', { name: '취향 질문 시작하기' }));
    await user.click(screen.getByRole('button', { name: '서연에게 넘기기' }));

    expect(screen.getByRole('alert')).toHaveTextContent('모든 질문에 답해주세요.');
    expect(document.querySelector('[data-question-id="contact"]')).toHaveFocus();
  });

  it('completes the full flow and falls back to clipboard sharing', async () => {
    const user = userEvent.setup();
    const share = vi.fn().mockRejectedValue(new Error('share unavailable'));
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
    });
    render(<CompatibilityExperience />);
    await fillBasicInformation(user, '연인');
    await user.click(screen.getByRole('button', { name: '취향 질문 시작하기' }));

    await answerEveryQuestion(user, 0);
    await user.click(screen.getByRole('button', { name: '서연에게 넘기기' }));
    await answerEveryQuestion(user, 1);
    await user.click(screen.getByRole('button', { name: '우리 케미 확인하기' }));

    expect(await screen.findByText('두 사람의 답변 비교')).toBeInTheDocument();
    expect(screen.getAllByText('다름')).toHaveLength(10);
    expect(screen.getByText('🏁 이번 주 케미 미션')).toBeInTheDocument();

    const writeText = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue(undefined);
    await user.click(screen.getByRole('button', { name: '결과 공유하기' }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledOnce();
    });
    expect(screen.getByRole('status')).toHaveTextContent('결과를 클립보드에 복사했어요.');
  });
});
