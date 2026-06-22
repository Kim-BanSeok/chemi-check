// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChemistryHub from './ChemistryHub';

async function answerEveryQuestion(
  user: ReturnType<typeof userEvent.setup>,
  optionIndex: number,
) {
  const groups = document.querySelectorAll<HTMLElement>('[data-question-id]');
  for (const group of groups) {
    await user.click(within(group).getAllByRole('button')[optionIndex]);
  }
}

describe('ChemistryHub', () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('다섯 가지 테스트를 표시하고 여행 케미 전체 흐름을 완료한다', async () => {
    const user = userEvent.setup();
    render(<ChemistryHub />);

    expect(screen.getAllByText('테스트 시작 →')).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: /여행 케미/ }));
    expect(screen.getByRole('heading', { name: '여행 케미, 어떻게 할까요?' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /같이 테스트하기/ }));
    expect(screen.getByRole('button', { name: '← 테스트 선택으로' })).toBeInTheDocument();

    const names = screen.getAllByRole('textbox');
    await user.type(names[0], '민준');
    await user.type(names[1], '서연');
    await user.click(screen.getByRole('button', { name: '질문 시작하기' }));

    expect(await screen.findByText('여행 계획은 어느 정도가 좋아?')).toBeInTheDocument();
    await answerEveryQuestion(user, 0);
    await user.click(screen.getByRole('button', { name: '서연에게 넘기기' }));
    await answerEveryQuestion(user, 0);
    await user.click(screen.getByRole('button', { name: '여행 케미 확인하기' }));

    expect(await screen.findByText('환상의 여행 메이트')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다른 케미 테스트 선택' }));
    expect(screen.getByRole('heading', { name: '어떤 케미를 확인할까요?' })).toBeInTheDocument();
  });

  it('내 취향 분석 모드는 상대 이름 없이 결과를 보여준다', async () => {
    const user = userEvent.setup();
    render(<ChemistryHub />);

    await user.click(screen.getByRole('button', { name: /음식 케미/ }));
    await user.click(screen.getByRole('button', { name: /내 취향만 분석하기/ }));
    await user.type(screen.getByRole('textbox'), '민준');
    await user.click(screen.getByRole('button', { name: '질문 시작하기' }));
    await answerEveryQuestion(user, 0);
    await user.click(screen.getByRole('button', { name: '내 취향 분석하기' }));

    expect(await screen.findByText('민준님의 음식 케미')).toBeInTheDocument();
    expect(screen.getByText('기준이 분명한 계획형')).toBeInTheDocument();
  });

  it('초대 링크 모드는 상대 이름 없이 시작하고 링크를 만든다', async () => {
    const user = userEvent.setup();
    render(<ChemistryHub />);

    await user.click(screen.getByRole('button', { name: /여행 케미/ }));
    await user.click(screen.getByRole('button', { name: /초대 링크 보내기/ }));
    await user.type(screen.getByRole('textbox'), '민준');
    await user.click(screen.getByRole('button', { name: '질문 시작하기' }));

    expect(await screen.findByText('여행 계획은 어느 정도가 좋아?')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await answerEveryQuestion(user, 0);
    await user.click(screen.getByRole('button', { name: '초대 링크 만들기' }));

    expect(await screen.findByRole('heading', { name: '초대 링크가 준비됐어요' })).toBeInTheDocument();
    expect(window.location.hash).toMatch(/^#invite=/);
  });
});
