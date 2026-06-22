# 케미체크 💫

이름, MBTI와 다양한 취향 질문을 바탕으로 두 사람의 케미를 확인하는 모바일 우선 웹사이트입니다.

## 주요 기능

- 연인, 썸, 친구, 동료 관계 유형 선택
- 공통 질문 5개와 관계별 질문 5개로 구성된 10문항 테스트
- 두 사람이 같은 기기에서 순서대로 답하는 흐름
- 이름 20%, MBTI 40%, 취향 일치도 40% 기반 점수
- 실제 답변에 따라 달라지는 강점, 갈등 지점, 대화법
- MBTI 네 축 분석과 두 사람의 답변 비교
- 관계별 추천 활동과 이번 주 케미 미션
- 여행, 음식, 싸움 해결, 데이트·놀거리 전용 케미 테스트
- 각 전용 테스트의 8문항 답변 비교, 추천 활동, 실천 미션
- 한 기기에서 같이하기, 상대 답변 예상, 내 취향 분석, 랜덤 비교
- 서버 저장 없이 URL 해시로 전달하는 상대방 초대 링크
- Web Share API 및 클립보드 공유

이 테스트는 재미를 위한 콘텐츠이며 전문적인 심리 검사나 관계 진단이 아닙니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 검증 명령

```bash
npm run test
npm run lint
npm run build
```

## 기술 스택

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest

모든 궁합 계산은 브라우저에서 처리되며 서버, API, 데이터베이스를 사용하지 않습니다.

## 프로젝트 구조

```text
chemi-check/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CompatibilityExperience.tsx
│   ├── ChemistryHub.tsx
│   ├── MiniChemistryExperience.tsx
│   ├── MiniResultCard.tsx
│   └── ResultCard.tsx
├── lib/
│   ├── compatibility.ts
│   ├── compatibility.test.ts
│   ├── mini-tests.ts
│   ├── mini-tests.test.ts
│   └── types.ts
├── package.json
└── next.config.ts
```

## 계산 방식

- 이름 점수: 이름 조합을 해시해 40~100점으로 변환
- MBTI 점수: 관계 유형에 따라 네 성향 축의 유사성과 차이에 다른 가중치 적용
- 취향 점수: 관계별 10개 질문의 일치 비율을 40~100점으로 변환
- 종합 점수: 이름 20% + MBTI 40% + 취향 40%

자동 테스트에서 점수 범위, 이름 순서 대칭성, 취향 일치도 증가, MBTI 전체 조합, 모든 결과 등급 도달 가능성을 검증합니다.
