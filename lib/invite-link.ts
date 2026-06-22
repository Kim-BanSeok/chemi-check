import { BalanceAnswer, BalanceAnswers } from './types';
import { ChemistryTestType, MINI_TEST_DEFINITIONS } from './mini-tests';

type MiniTestType = Exclude<ChemistryTestType, 'overall'>;
const MINI_TEST_TYPES: readonly MiniTestType[] = ['travel', 'food', 'conflict', 'date'];

function isMiniTestType(value: unknown): value is MiniTestType {
  return typeof value === 'string' && MINI_TEST_TYPES.includes(value as MiniTestType);
}

export interface InvitePayload {
  version: 1;
  testType: MiniTestType;
  inviterName: string;
  answers: BalanceAnswers;
}

export function createInviteToken(payload: InvitePayload): string {
  const definition = MINI_TEST_DEFINITIONS[payload.testType];
  const compact = {
    v: payload.version,
    t: payload.testType,
    n: payload.inviterName,
    a: definition.questions.map(({ id }) => payload.answers[id]).join(''),
  };
  const bytes = new TextEncoder().encode(JSON.stringify(compact));
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
}

export function parseInviteToken(token: string): InvitePayload | null {
  try {
    const base64 = token.replaceAll('-', '+').replaceAll('_', '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const compact = JSON.parse(new TextDecoder().decode(bytes)) as {
      v?: number;
      t?: unknown;
      n?: string;
      a?: string;
    };
    if (
      compact.v !== 1
      || !isMiniTestType(compact.t)
      || !compact.n
      || !compact.a
    ) return null;

    const questions = MINI_TEST_DEFINITIONS[compact.t].questions;
    if (compact.a.length !== questions.length || /[^01]/.test(compact.a)) return null;

    return {
      version: 1,
      testType: compact.t,
      inviterName: compact.n.slice(0, 12),
      answers: Object.fromEntries(
        questions.map((question, index) => [
          question.id,
          Number(compact.a?.[index]) as BalanceAnswer,
        ]),
      ),
    };
  } catch {
    return null;
  }
}

export function buildInviteUrl(payload: InvitePayload, location: Location): string {
  return `${location.origin}${location.pathname}#invite=${createInviteToken(payload)}`;
}
