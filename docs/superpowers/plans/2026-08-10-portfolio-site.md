# 포트폴리오 웹사이트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** create-next-app 기본 보일러플레이트를 걷어내고, 프로필 + 프로젝트 4개(TeachMon, Nuri, M-ADP, 순복음범천교회)를 담은 컬러풀·플레이풀한 포트폴리오 사이트를 만든다.

**Architecture:** Next.js App Router (기존 seabass 프로젝트) + Tailwind CSS + shadcn/ui. 콘텐츠는 정적 TS 데이터 모듈(`src/lib/content.ts`)에서 가져온다. 랜딩(`/`)은 프로필 히어로 + 프로젝트 카드 그리드. 프로젝트 4개는 각각 독립 라우트(`/projects/<slug>`)를 가지며, 해당 프로젝트의 실제 브랜드 컬러를 CSS 변수로 스코프해 페이지마다 다른 무드를 낸다.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, motion(framer-motion 후신 패키지명 `motion`), Aceternity UI/Magic UI에서 발췌한 컴포넌트 코드.

## Global Constraints

- 기존 `@/*` → `./src/*` path alias 유지 (tsconfig.json에 이미 설정됨).
- Node 22.12+ (현재 v26.0.0 확인됨).
- `design-taste-frontend`, `impeccable` 스킬 둘 다 `.claude/skills/`에 설치됨 — UI 작성 시 design-taste-frontend를, 완성 후 impeccable detect로 검증한다.
- Arial 등 overused 폰트 금지 (impeccable이 잡음). Pretendard(본문) + 개성 있는 헤드라인 서체 페어링.
- 콘텐츠 출처: `/Users/juhyun/Desktop/취업/회사별자료/CV3/오주현_포트폴리오_CV3.pdf` — 아래 데이터는 이 PDF에서 발췌한 실제 내용.
- 새 의존성 추가 시 `npm install` (프로젝트가 npm/pnpm 어느 쪽인지 `pnpm-lock.yaml` 존재로 확인됨 → **pnpm 사용**).
- 백엔드/CMS 없음. 5페이지(랜딩 + 프로젝트 4개)가 스코프의 전부.

---

### Task 1: Tailwind + shadcn/ui 세팅, 기존 보일러플레이트 제거

**Files:**
- Create: `src/app/globals.css` (재작성)
- Modify: `package.json`, `tsconfig.json`(shadcn CLI가 자동 수정), `next.config.ts`
- Delete: `src/app/page.module.css`, `public/next.svg`, `public/vercel.svg`, `public/file.svg`, `public/globe.svg`, `public/window.svg`
- Create: `components.json` (shadcn 설정, CLI가 생성)

**Interfaces:**
- Produces: Tailwind 유틸리티 클래스 사용 가능 상태, `cn()` 헬퍼(`src/lib/utils.ts`, shadcn CLI가 생성), shadcn 컴포넌트 설치 경로 `src/components/ui/*`

- [ ] **Step 1: Tailwind CSS v4 설치**

```bash
pnpm add tailwindcss @tailwindcss/postcss postcss
```

- [ ] **Step 2: PostCSS 설정 파일 생성**

`postcss.config.mjs`:
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 3: shadcn/ui 초기화**

```bash
pnpm dlx shadcn@latest init
```
프롬프트에서: base color는 `neutral`, CSS variables는 `yes`로 선택.

- [ ] **Step 4: 안 쓰는 기본 에셋/스타일 제거**

```bash
rm src/app/page.module.css public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg
```

- [ ] **Step 5: 빌드 확인**

Run: `pnpm build`
Expected: 에러 없이 빌드 성공 (페이지 내용은 아직 기본 상태여도 됨)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: set up Tailwind CSS and shadcn/ui"
```

---

### Task 2: 콘텐츠 데이터 모듈 작성

**Files:**
- Create: `src/lib/content.ts`

**Interfaces:**
- Produces:
  ```typescript
  export type TroubleshootingEntry = {
    title: string;
    problem: string;
    cause: string;
    solution: string;
    result: string;
    codeBefore?: { lang: string; code: string };
    codeAfter?: { lang: string; code: string };
  };

  export type Project = {
    slug: string;
    name: string;
    tagline: string;
    description: string;
    period: string;
    operatingPeriod: string;
    techStack: string[];
    role: string;
    contributions: string[];
    features: { title: string; description: string }[];
    troubleshooting: TroubleshootingEntry[];
    brandColor: string; // hex
    tags: string[];
    githubUrl?: string;
    liveUrl?: string;
  };

  export const profile: {
    name: string;
    tagline: string;
    bio: string;
    birthdate: string;
    phone: string;
    email: string;
    school: string;
    awards: { year: string; items: string[] }[];
    certificates: { year: string; items: string[] }[];
    leadership: { year: string; items: string[] }[];
    activities: { year: string; items: string[] }[];
  };

  export const projects: Project[];
  ```

- [ ] **Step 1: 데이터 파일 작성**

`src/lib/content.ts`:
```typescript
export type TroubleshootingEntry = {
  title: string;
  problem: string;
  cause: string;
  solution: string;
  result: string;
  codeBefore?: { lang: string; code: string };
  codeAfter?: { lang: string; code: string };
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  period: string;
  operatingPeriod: string;
  techStack: string[];
  role: string;
  contributions: string[];
  features: { title: string; description: string }[];
  troubleshooting: TroubleshootingEntry[];
  brandColor: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
};

export const profile = {
  name: "오주현",
  tagline: "스펀지 같은 개발자, 오주현입니다.",
  bio: "스펀지는 무엇이든 빠르게 빨아들이고, 한번 머금으면 쉽게 내뱉지 않습니다. 저도 이처럼 팀원들과 소통하면서 새로운 기술을 습득하고, 내면에 단단히 머금어 팀이 필요할 때 언제나 꺼내 쓸 수 있는 개발자입니다.",
  birthdate: "2008.05.30.",
  phone: "010-6637-7242",
  email: "me@zuu3.kr",
  school: "부산소프트웨어마이스터고등학교 재학중 (2027.01 졸업 예정)",
  awards: [
    {
      year: "2024",
      items: ["교내 클론코딩 경진대회 장려상", "교내 네트워크 경진대회 장려상"],
    },
    {
      year: "2025",
      items: [
        "SJSU 역량 강화 캠프 프로젝트 Tech Excellent상",
        "소프트웨어개발과 웹 프로그래밍 경진대회 우수상",
        "소프트웨어마이스터고등학교 4개교 연합해커톤 우수상",
        "U-BDIA 프로젝트 아이디어상(티치몬)",
      ],
    },
  ],
  certificates: [{ year: "2025", items: ["정보처리산업기사(25251030366V)"] }],
  leadership: [
    { year: "2025", items: ["SJSU 역량 강화 캠프 프로젝트 팀장"] },
    { year: "2026", items: ["부산소프트웨어마이스터고등학교 1, 2, 3학년 반장"] },
  ],
  activities: [
    {
      year: "2025",
      items: [
        "28th Appjam 참가",
        "교내 AI SW 공모전 참가(티치몬)",
        "U-BDIA 프로젝트 전시(티치몬)",
        "ko.react.dev 문서 기여",
      ],
    },
    { year: "2026", items: ["순복음범천교회 교회 웹사이트 외주 작업"] },
  ],
};

export const projects: Project[] = [
  {
    slug: "teachmon",
    name: "TeachMon(티치몬)",
    tagline: "교내 방과후 자습/이석 관리 서비스",
    description:
      "기존 구글 시트 기반의 자습 관리를 대체하여, 선생님께서 자습 일정·이석 현황을 한눈에 파악할 수 있는 웹 서비스입니다. 감독 교체 요청, 이탈 현황 확인, 이석 신청까지 하나의 플랫폼에서 처리할 수 있습니다.",
    period: "2024.12. ~ 2025.03.",
    operatingPeriod: "2025.03 ~",
    techStack: ["TypeScript", "React", "TanStack Query"],
    role: "Frontend Engineer",
    contributions: [
      "홈·운영 대시보드 구현",
      "자습/이석 일정 조회 및 감독 교체 구현",
      "방과후 보강 처리 구현",
      "어드민 방과후 출장/보강 구현",
      "분기별 자습 일정 설정 구현",
    ],
    features: [
      {
        title: "자습 감독 및 일정 관리",
        description:
          "자습/이석 일정을 캘린더로 확인하고 교체 요청을 처리하는 기능입니다. useQuery로 일정 데이터를 조회하고, 교체 요청 처리 시 useMutation과 invalidateQueries를 활용해 전체 일정에 변경 사항이 즉시 반영되도록 구현했습니다. 감독 검색에는 debounce를 적용해 입력마다 요청이 발생하지 않도록 처리했습니다.",
      },
      {
        title: "방과후 및 보강 처리",
        description:
          "방과후 일정 관리와 출장 및 보강 처리를 지원하는 기능입니다. 복수 교시 보강을 한 번에 처리할 때 Promise.all을 활용해 여러 요청을 병렬로 처리하고, 성공 시 invalidateQueries로 목록을 갱신했습니다.",
      },
      {
        title: "자습 일정 설정",
        description:
          "분기별 자습 일정을 학년 단위로 설정하는 기능입니다. 학년마다 자습 일정이 달라 이 부분을 한 화면에서 미리 설정해두어 불편함을 줄일 수 있도록 구성했으며, 설정 저장 시 useMutation으로 요청을 처리했습니다.",
      },
      {
        title: "운영 현황 대시보드",
        description:
          "감독 횟수, 교체 요청, 이탈 현황을 한눈에 확인하는 기능입니다. 요청 처리 이후 invalidateQueries로 관련 쿼리를 갱신해 항상 최신 상태를 유지하도록 구성했습니다.",
      },
    ],
    troubleshooting: [
      {
        title: "초기 번들 구조 개선을 통한 로딩 성능 개선",
        problem:
          "초기 Lighthouse Performance 점수가 56점으로, 네트워크 환경이 좋지 않을 경우 첫 화면이 늦게 렌더링되는 문제가 있었습니다. 특히 초기 접속 시 모든 페이지 번들이 함께 로드되면서, 실제 화면에 필요하지 않은 코드까지 동시에 로딩되고 있었습니다.",
        cause:
          "번들 구조를 분석한 결과, 라우트 단위 분리가 되어 있지 않아 초기 진입 시 전체 페이지 코드가 하나의 번들로 포함되어 있었습니다. 이로 인해 초기 렌더링에 불필요한 리소스까지 함께 다운로드되며 첫 화면 표시 시간이 지연되고 있었습니다.",
        solution:
          "라우트 단위 코드 스플리팅을 위해 React.lazy와 @loadable/component를 비교했습니다. Loadable은 SSR 지원과 named export 처리에 강점이 있지만, 티치몬은 CSR 기반 SPA이고 SSR이 필요하지 않았습니다. React.lazy는 별도 라이브러리 의존 없이 Suspense와 조합해 로딩 fallback까지 선언적으로 처리할 수 있어 이 프로젝트에 적합하다고 판단했습니다.",
        result:
          "사용자가 접근하는 시점에 필요한 페이지 코드만 비동기적으로 로드되도록 구조를 개선했습니다. Performance 점수는 56 → 81로 약 44.6% 향상되었습니다.",
      },
      {
        title: "Tanstack Query를 활용한 데이터 동기화 문제 해결",
        problem:
          "보강 처리나 교체 요청 이후에도 모든 화면에서 이전 데이터가 그대로 유지되어 변경된 상태가 즉시 반영되지 않는 문제가 있었습니다. 데이터 변경 이후에도 캐시된 값이 유지되면서 실제 서버 데이터와 UI 간의 불일치가 발생했습니다.",
        cause:
          "Tanstack Query를 사용해 데이터를 관리하고 있었지만, 데이터 변경 이후 관련 쿼리를 명시적으로 갱신하지 않아 기존 캐시 데이터가 그대로 유지되고 있었습니다. 이로 인해 데이터 변경이 발생하더라도 이미 조회된 데이터는 즉시 반영되지 않고, 각 화면에서 이전 상태가 남아 있는 문제가 발생했습니다.",
        solution:
          "데이터 변경 후 UI 반영 방식으로 낙관적 업데이트와 invalidateQueries를 비교했습니다. 낙관적 업데이트는 요청 전에 캐시를 먼저 수정해 UI에 즉시 반영하고, 실패 시 롤백하는 방식으로 응답 속도는 빠르지만 서버 데이터와 불일치가 생길 수 있고 롤백 로직이 추가로 필요합니다. 티치몬은 감독 교체·보강 처리 등 정확한 상태가 중요한 운영 서비스였기 때문에, 서버 기준으로 연관 쿼리를 일괄 갱신할 수 있는 invalidateQueries를 선택했습니다.",
        result:
          "데이터 변경 이후에도 이전 상태가 남아 있던 문제가 개선되어, 모든 화면에서 최신 상태를 일관되게 반영할 수 있었습니다. 사용자가 요청 처리 결과를 바로 확인할 수 있게 되었고, 운영 화면에서 데이터 신뢰도를 높일 수 있었습니다.",
        codeBefore: {
          lang: "typescript",
          code: `const mutation = useMutation({
  mutationFn: updateSchedule,
})`,
        },
        codeAfter: {
          lang: "typescript",
          code: `const mutation = useMutation({
  mutationFn: updateSchedule,
  onSuccess: () => {
    queryClient.invalidateQueries(['schedule'])
  }
})`,
        },
      },
    ],
    brandColor: "#2563EB",
    tags: ["#U-BDIA 아이디어상", "#실제 운영 중인 서비스"],
  },
  {
    slug: "nuri",
    name: "Nuri(누리)",
    tagline: "외국인 유학생을 위한 한국 문화 적응 서비스",
    description:
      "외국인 유학생의 한국 정착을 지원하는 플랫폼입니다. 하숙집 연결부터 생활 관리, 지역 모임까지 하나의 서비스에서 제공하여 낯선 환경에서의 적응을 돕습니다.",
    period: "2025.04. ~ 2025.11.",
    operatingPeriod: "2025.10. ~ 2025.11.",
    techStack: ["TypeScript", "Next.js", "TanStack Query", "GraphQL"],
    role: "Frontend Engineer",
    contributions: [
      "OAuth 로그인 및 멀티스텝 회원가입 구현",
      "홈 상세 조회 구조 설계",
      "하숙 업무 관리 구현",
      "모임 일정/멤버 관리 구현",
    ],
    features: [
      {
        title: "로그인 및 회원가입",
        description:
          "OAuth 기반 로그인 및 멀티스텝 회원가입 기능을 구현했습니다. JWT 인증 방식을 적용하고, token 만료 2분 전부터 재발급 대상으로 판단해 요청 시 선제적으로 토큰을 갱신하도록 처리했습니다.",
      },
      {
        title: "홈 화면 상세 조회 구조",
        description:
          "홈 화면에서 선택한 항목의 상세 정보를 조회하는 기능을 구현했습니다. Next.js의 Parallel Routes와 Intercepting Routes를 활용해 목록 페이지 위에서 상세 내용을 확인할 수 있도록 구성했으며, 직접 URL로 접근하는 경우에는 전체 페이지로 렌더링되도록 처리했습니다.",
      },
      {
        title: "제3자 하숙 관리",
        description:
          "캘린더에서 날짜를 선택하면 당일 업무를 조회하는 기능을 구현했습니다. Apollo Client를 활용해 데이터를 조회하고, 업무 완료 시 낙관적 업데이트를 적용해 UI에 즉시 반영되도록 처리했습니다. 요청 실패 시에는 이전 상태로 롤백해 상태 일관성을 유지했습니다.",
      },
      {
        title: "제3자 모임 관리",
        description:
          "모임 일정과 멤버를 관리하는 기능을 구현했습니다. Promise.all을 활용해 일정과 멤버 데이터를 병렬로 조회하고, 참가 수락/거절/추방 시 낙관적 업데이트로 UI에 즉시 반영되도록 구성했습니다. 요청 실패 시에는 전체 데이터를 재조회해 상태를 복구했습니다.",
      },
    ],
    troubleshooting: [
      {
        title: "Intercepting Routes 직접 접근 렌더링 문제 해결",
        problem:
          "홈 화면에서 상세 페이지를 Intercepting Routes로 구현했을 때, 목록에서 접근하는 경우와 직접 URL로 접근하는 경우의 렌더링 결과가 달라 일관되지 않은 UI가 표시되는 문제가 발생했습니다. 특히 직접 접근했을 때도 모달 형태로 렌더링되어 흐름이 어색한 문제가 있었습니다.",
        cause:
          "Intercepting Routes는 기존 페이지 위에 내용을 덮어쓰는 방식으로 동작하기 때문에, 접근 방식에 따라 동일한 페이지라도 다른 렌더링 결과가 발생했습니다. 이로 인해 \"모달로 보여야 하는 경우\"와 \"독립된 페이지로 보여야 하는 경우\"를 구분하지 못하는 구조였습니다.",
        solution:
          "일반 모달(useState) 방식은 클라이언트 접근 시에는 모달을 띄울 수 있지만, 직접 URL로 접근했을 때 동일한 UI를 제공할 수 없었습니다. Parallel Routes와 Intercepting Routes를 함께 활용하면 접근 방식에 따라 렌더링을 분리할 수 있어 이 조합을 선택했습니다. 목록에서 접근한 경우에는 모달 형태로, 직접 URL로 접근한 경우에는 전체 페이지로 렌더링되도록 구성했습니다.",
        result:
          "접근 방식에 관계없이 일관된 사용자 경험을 제공할 수 있게 되었으며, 페이지 구조를 상황에 맞게 유연하게 제어할 수 있도록 개선했습니다.",
        codeBefore: {
          lang: "typescript",
          code: `export default function DetailPage({ params }) {
  return (
    <Modal>
      <DetailContent id={params.id} />
    </Modal>
  );
}`,
        },
        codeAfter: {
          lang: "typescript",
          code: `// 목록 접근 → 모달
// app/(home)/@modal/(.)detail/[id]/page.tsx
export default function DetailModal({ params }) {
  return <Modal><DetailContent id={params.id} /></Modal>;
}

// 직접 접근 → 페이지
// app/detail/[id]/page.tsx
export default function DetailPage({ params }) {
  return <DetailContent id={params.id} />;
}`,
        },
      },
      {
        title: "JWT 재발급 과정에서 동시 요청 제어 문제 해결",
        problem:
          "여러 요청이 동시에 발생하는 상황에서 access token이 만료되면, 하나의 요청에서 401 응답이 발생한 이후 다른 요청들도 연달아 401을 반환하는 문제가 있었습니다. 이로 인해 일부 요청은 실패 상태로 남거나, 토큰 재발급 이전 상태에서 요청이 계속 진행되는 비효율적인 흐름이 발생했습니다.",
        cause:
          "토큰 만료 상황에서 요청 간 상태를 공유하지 못하고, 각 요청이 독립적으로 서버 응답을 처리하는 구조였습니다. 이로 인해 하나의 토큰 만료가 전체 요청 흐름에 반영되지 못하고, 이미 만료된 토큰으로 요청이 계속 진행되는 문제가 발생했습니다.",
        solution:
          "토큰이 만료된 상황에서 여러 요청이 동시에 발생하면 모든 요청이 각각 401을 받고 재발급을 시도해 불필요한 서버 부하가 발생했습니다. refreshLock을 구현해 최초 401 응답 시 재발급을 한 번만 수행하고, 나머지 요청은 재발급이 완료될 때까지 대기했다가 갱신된 토큰으로 한 번에 처리하도록 구성했습니다.",
        result:
          "토큰 만료 상황에서도 요청 흐름이 일관되게 유지되도록 개선했으며, 불필요한 401 응답과 요청 실패를 줄일 수 있었습니다.",
        codeBefore: {
          lang: "typescript",
          code: `if (status === 401) {
  await refreshAccessToken();
  return request();
}`,
        },
        codeAfter: {
          lang: "typescript",
          code: `let refreshLock: Promise<string | null> | null = null;

export async function withRefreshLock(refreshFn: () => Promise<string | null>) {
  if (refreshLock) return refreshLock;

  refreshLock = (async () => {
    try {
      return await refreshFn();
    } finally {
      refreshLock = null;
    }
  })();

  return refreshLock;
}`,
        },
      },
    ],
    brandColor: "#EC4899",
    tags: ["#교내 전공동아리 부스 운영"],
  },
  {
    slug: "m-adp",
    name: "M-ADP(마듭)",
    tagline: "교내 유휴 자원 활용 관리형 배포 클라우드 플랫폼",
    description:
      "AWS 등 클라우드 서비스를 처음 접하는 학생·선생님이 비용 걱정 없이 배포를 경험할 수 있도록, 교내 유휴 서버 자원을 활용한 관리형 클라우드 플랫폼입니다. 잘 모르고 사용하다가 요금이 발생하는 일 없이, 안전한 환경에서 배포를 연습할 수 있습니다.",
    period: "2025.12. ~ 2026.04",
    operatingPeriod: "2026.04 ~ 현재",
    techStack: ["TypeScript", "Next.js", "TanStack Query", "GraphQL"],
    role: "Frontend Engineer",
    contributions: [
      "Google/Github OAuth 연동 로그인 구현",
      "프로젝트 생성 구현",
      "프로젝트 대시보드 구현",
      "애플리케이션 생성 구현",
      "ChatOps 구현",
    ],
    features: [
      {
        title: "프로젝트 상세 조회",
        description:
          "애플리케이션 목록, CPU·Memory·Disk 자원 사용량, 멤버 정보를 관리하는 대시보드입니다. OWNER/VIEWER 역할에 따라 수정 권한을 분기 처리했습니다.",
      },
      {
        title: "애플리케이션 생성",
        description:
          "프로젝트 내 애플리케이션을 생성하는 화면입니다. 앱 이름 입력 시 한글·대문자를 실시간으로 제거해 백엔드 네이밍 규칙을 입력 단계에서 강제했습니다.",
      },
      {
        title: "ChatOps",
        description:
          "채팅으로 배포 환경을 제어하는 LLM 기반 인터페이스입니다. native EventSource는 Authorization 헤더를 지원하지 않아 fetch + ReadableStream으로 직접 SSE를 구현했습니다. 연결 실패 시 exponential backoff로 재연결하고, Last-Event-ID로 누락 이벤트를 복구했습니다.",
      },
      {
        title: "로그인",
        description:
          "Google OAuth와 GitHub OAuth를 순차적으로 연동하는 로그인 흐름을 구현했습니다. OAuth 인증 후 발급받은 code를 백엔드에 전달하고, 응답으로 받은 토큰을 쿠키에 저장했습니다. 응답의 is_authenticated 값으로 GitHub 연동 여부를 판단해, 이미 Google 로그인이 완료된 사용자는 GitHub 단계를 건너뛰도록 분기 처리했습니다.",
      },
    ],
    troubleshooting: [
      {
        title: "새로고침 시 인증 상태 소실 문제 해결",
        problem:
          "Zustand 메모리에만 토큰을 저장하고 있어, 새로고침 시 인증 상태가 초기화되며 로그인 페이지로 리다이렉트되는 문제가 있었습니다.",
        cause:
          "메모리에만 저장된 토큰은 새로고침 시 유지되지 않아, 인증이 필요한 페이지에서 토큰이 null로 판단되어 로그인 페이지로 강제 이동되는 구조였습니다.",
        solution:
          "localStorage는 JavaScript로 직접 접근 가능해 XSS에 취약하기 때문에 쿠키를 선택했습니다. refreshToken은 백엔드에서 httpOnly 쿠키로 설정해 JavaScript 접근을 차단하고, accessToken은 클라이언트 쿠키에 저장했습니다. 또한 인증 체크 로직을 Next.js 미들웨어로 옮겨 클라이언트 렌더링 이전 요청 단계에서 바로 검증하도록 구성했습니다.",
        result:
          "새로고침 이후에도 인증 상태가 유지되도록 개선했고, 불필요한 로그인 페이지 리다이렉트를 방지했습니다.",
        codeBefore: {
          lang: "typescript",
          code: `// authStore.ts
partialize: (state) => ({ step: state.step }), // token 미포함

// MainLayout.tsx
const token = useAuthStore((state) => state.token);
useEffect(() => {
  if (!isAuthPage && !token) { // 새로고침 → token === null
    router.replace('/login');
  }
}, [isAuthPage, token, router]);`,
        },
        codeAfter: {
          lang: "typescript",
          code: `// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}`,
        },
      },
      {
        title: "Authorization 헤더 미지원으로 인한 SSE 직접 구현",
        problem:
          "LLM 기반 ChatOps 기능에서 SSE로 응답을 스트리밍하려 했으나, native EventSource가 커스텀 헤더를 지원하지 않아 인증이 필요한 엔드포인트에 연결할 수 없었습니다.",
        cause:
          "EventSource는 브라우저 스펙상 GET 요청만 지원하고 헤더를 직접 설정할 수 없습니다. Authorization 헤더 없이는 인증된 스트리밍 연결 자체가 불가능한 구조였습니다.",
        solution:
          "fetch + ReadableStream으로 SSE를 직접 구현했습니다. Last-Event-ID를 헤더와 쿼리 파라미터 양쪽으로 전송해 프록시 환경에서도 누락 이벤트를 복구하고, exponential backoff(최대 5회)로 재연결하도록 구성했습니다. 4xx는 재시도하지 않아 잘못된 요청 반복을 방지했습니다.",
        result:
          "백엔드 롤링 배포 중에도 메시지 유실 없이 응답을 끝까지 수신할 수 있게 되었습니다. 4xx 분기 처리와 AbortController 정리로 불필요한 재시도와 좀비 커넥션을 방지했습니다.",
        codeBefore: {
          lang: "typescript",
          code: `const evtSource = new EventSource('/api/stream');
// Authorization 헤더 설정 불가`,
        },
        codeAfter: {
          lang: "typescript",
          code: `const res = await fetch('/api/stream', {
  headers: {
    Authorization: \`Bearer \${token}\`,
    'Last-Event-ID': lastSequenceRef.current,
  },
  signal: abortController.signal,
});
const reader = res.body!.getReader();`,
        },
      },
    ],
    brandColor: "#3B82F6",
    tags: ["#교내 AI 경진대회 출품작", "#AI EXPO 전시"],
  },
  {
    slug: "church",
    name: "순복음범천교회 웹사이트",
    tagline: "매주 바뀌는 주보와 월간 일정을 관리하는 교회 웹",
    description:
      "교회 소개, 예배 안내, 주보·월간 일정을 제공하는 웹사이트입니다. 담당자가 개발자 없이도 매주 콘텐츠를 직접 갱신할 수 있도록, 기획부터 백엔드 설계, 배포까지 진행했습니다.",
    period: "2026.01. ~ 2026.05.",
    operatingPeriod: "2026.05 ~ 현재",
    techStack: ["TypeScript", "Next.js", "TanStack Query", "GraphQL", "MySQL", "Docker"],
    role: "Full-Stack Engineer",
    contributions: [
      "교회 소개·예배 안내 등 전체 페이지 구현",
      "주보·월간 일정 어드민 페이지 구현",
      "FastAPI 기반 백엔드 API 설계",
      "MySQL 데이터베이스 스키마 설계",
      "Docker 컨테이너화 및 카페24 서버 배포",
    ],
    features: [],
    troubleshooting: [],
    brandColor: "#171717",
    tags: ["#교회 실사용 서비스", "#서비스 바로가기"],
  },
];
```

- [ ] **Step 2: 타입체크로 검증**

Run: `pnpm exec tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add src/lib/content.ts
git commit -m "feat: add portfolio content data"
```

---

### Task 3: 공용 컴포넌트 — ProjectCard, TroubleshootingBlock, shadcn 기본 컴포넌트

**Files:**
- Create: `src/components/project-card.tsx`
- Create: `src/components/troubleshooting-block.tsx`
- Create: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/badge.tsx` (shadcn CLI로 생성)

**Interfaces:**
- Consumes: `Project` 타입 (`@/lib/content`)
- Produces:
  - `<ProjectCard project={Project} />` — 랜딩 그리드용 카드, 클릭 시 `/projects/[slug]`로 이동
  - `<TroubleshootingBlock entry={TroubleshootingEntry} />` — Problem/Cause/Solution/Result + before/after 코드블록 렌더

- [ ] **Step 1: shadcn 기본 컴포넌트 설치**

```bash
pnpm dlx shadcn@latest add button card badge
```

- [ ] **Step 2: ProjectCard 작성**

`src/components/project-card.tsx`:
```typescript
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <Card
        className="h-full p-6 border-2 transition-transform group-hover:-translate-y-1"
        style={{ borderColor: project.brandColor }}
      >
        <h3 className="text-2xl font-bold" style={{ color: project.brandColor }}>
          {project.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{project.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 3: TroubleshootingBlock 작성**

`src/components/troubleshooting-block.tsx`:
```typescript
import type { TroubleshootingEntry } from "@/lib/content";

export function TroubleshootingBlock({ entry }: { entry: TroubleshootingEntry }) {
  return (
    <div className="border-t pt-8">
      <h4 className="text-xl font-bold">{entry.title}</h4>
      <div className="mt-4 grid gap-4">
        <div>
          <span className="font-semibold">Problem</span>
          <p className="mt-1 text-sm leading-relaxed">{entry.problem}</p>
        </div>
        <div>
          <span className="font-semibold">Cause</span>
          <p className="mt-1 text-sm leading-relaxed">{entry.cause}</p>
        </div>
        <div>
          <span className="font-semibold">Solution</span>
          <p className="mt-1 text-sm leading-relaxed">{entry.solution}</p>
        </div>
        <div>
          <span className="font-semibold">Result</span>
          <p className="mt-1 text-sm leading-relaxed">{entry.result}</p>
        </div>
      </div>
      {entry.codeBefore && entry.codeAfter && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <pre className="rounded-lg bg-neutral-900 p-4 text-xs text-neutral-100 overflow-x-auto">
            <code>{entry.codeBefore.code}</code>
          </pre>
          <pre className="rounded-lg bg-neutral-900 p-4 text-xs text-neutral-100 overflow-x-auto">
            <code>{entry.codeAfter.code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: 타입체크**

Run: `pnpm exec tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "feat: add ProjectCard and TroubleshootingBlock components"
```

---

### Task 4: 랜딩 페이지 (`/`)

**Files:**
- Modify: `src/app/page.tsx` (전면 재작성)
- Modify: `src/app/layout.tsx` (메타데이터, 폰트)

**Interfaces:**
- Consumes: `profile`, `projects` (`@/lib/content`), `<ProjectCard />`

- [ ] **Step 1: design-taste-frontend 스킬로 히어로 섹션 방향 확인**

`design-taste-frontend` 스킬을 사용해 아래 요구사항으로 히어로 섹션 비주얼 디테일(레이아웃, 컬러 팔레트, 타이포 조합, 여백)을 확정한다:
- 톤: 컬러풀, 플레이풀(장난기 있는), "스펀지 같은 개발자" 콘셉트
- 프로필 사진 + 소개 문구 + Awards/Certificate/Leader/Activity 타임라인
- 흔한 AI 생성 티(그라디언트 카드 남발, Inter/Space Grotesk 단독 사용, 뻔한 그림자) 지양

- [ ] **Step 2: 랜딩 페이지 작성**

`src/app/page.tsx`:
```typescript
import { profile, projects } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section>
        <p className="text-sm font-medium text-muted-foreground">Profile</p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">{profile.tagline}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {profile.bio}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
          <span>{profile.email}</span>
          <span>{profile.phone}</span>
          <span>{profile.school}</span>
        </div>
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold">Awards</h2>
          {profile.awards.map((group) => (
            <div key={group.year} className="mt-3">
              <p className="text-sm font-semibold text-muted-foreground">{group.year}</p>
              <ul className="mt-1 list-disc pl-5 text-sm">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-lg font-bold">Activity</h2>
          {profile.activities.map((group) => (
            <div key={group.year} className="mt-3">
              <p className="text-sm font-semibold text-muted-foreground">{group.year}</p>
              <ul className="mt-1 list-disc pl-5 text-sm">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-bold">Projects</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: 개발 서버로 확인**

Run: `pnpm dev` 후 `http://localhost:3000` 접속
Expected: 히어로 섹션 + Awards/Activity + 프로젝트 카드 4개 렌더링 확인 (`run` 스킬 사용해도 됨)

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "feat: build landing page with profile and project grid"
```

---

### Task 5: 프로젝트 상세 페이지 템플릿 + 4개 라우트

**Files:**
- Create: `src/components/project-detail.tsx` (공용 템플릿)
- Create: `src/app/projects/teachmon/page.tsx`
- Create: `src/app/projects/nuri/page.tsx`
- Create: `src/app/projects/m-adp/page.tsx`
- Create: `src/app/projects/church/page.tsx`

**Interfaces:**
- Consumes: `Project`, `<TroubleshootingBlock />`
- Produces: `<ProjectDetail project={Project} />`, 각 라우트 페이지에서 `notFound()` 처리 불필요(4개 slug 고정이므로 정적 데이터 직접 import)

- [ ] **Step 1: 공용 ProjectDetail 템플릿 작성**

`src/components/project-detail.tsx`:
```typescript
import { TroubleshootingBlock } from "@/components/troubleshooting-block";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/content";

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <main
      className="min-h-screen px-6 py-16"
      style={{ ["--brand" as string]: project.brandColor }}
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium" style={{ color: project.brandColor }}>
          {project.tagline}
        </p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">{project.name}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-6 text-sm md:grid-cols-4">
          <div>
            <dt className="font-semibold">제작 기간</dt>
            <dd className="mt-1 text-muted-foreground">{project.period}</dd>
          </div>
          <div>
            <dt className="font-semibold">운영 기간</dt>
            <dd className="mt-1 text-muted-foreground">{project.operatingPeriod}</dd>
          </div>
          <div>
            <dt className="font-semibold">Role</dt>
            <dd className="mt-1 text-muted-foreground">{project.role}</dd>
          </div>
          <div>
            <dt className="font-semibold">기술스택</dt>
            <dd className="mt-1 text-muted-foreground">{project.techStack.join(", ")}</dd>
          </div>
        </dl>

        {project.contributions.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold">기여</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {project.contributions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {project.features.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold">Main features & Contribution</h2>
            <div className="mt-4 space-y-6">
              {project.features.map((feature) => (
                <div key={feature.title}>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.troubleshooting.length > 0 && (
          <section className="mt-12 space-y-10">
            <h2 className="text-xl font-bold">Troubleshooting</h2>
            {project.troubleshooting.map((entry) => (
              <TroubleshootingBlock key={entry.title} entry={entry} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: 4개 라우트 페이지 작성**

`src/app/projects/teachmon/page.tsx`:
```typescript
import { ProjectDetail } from "@/components/project-detail";
import { projects } from "@/lib/content";

const project = projects.find((p) => p.slug === "teachmon")!;

export default function Page() {
  return <ProjectDetail project={project} />;
}
```

동일한 패턴으로 나머지 3개 생성 (slug만 교체):
- `src/app/projects/nuri/page.tsx` — `p.slug === "nuri"`
- `src/app/projects/m-adp/page.tsx` — `p.slug === "m-adp"`
- `src/app/projects/church/page.tsx` — `p.slug === "church"`

- [ ] **Step 3: design-taste-frontend 스킬로 프로젝트별 브랜드 무드 확정**

`design-taste-frontend` 스킬로 4개 페이지 각각에 `project.brandColor`를 헤더 액센트, 배지 보더, 링크 컬러 등에 반영해 페이지마다 다른 무드를 낸다. TeachMon=블루/다크, Nuri=핑크, M-ADP=블루/화이트, 교회=블랙/화이트 포멀 톤을 따른다.

- [ ] **Step 4: 4개 라우트 전부 개발 서버에서 확인**

Run: `pnpm dev` 후 `/projects/teachmon`, `/projects/nuri`, `/projects/m-adp`, `/projects/church` 각각 접속
Expected: 4페이지 모두 렌더링, 브랜드 컬러가 페이지마다 다르게 적용됨, 코드블록(TeachMon/Nuri/M-ADP) 정상 표시

- [ ] **Step 5: Commit**

```bash
git add src/components/project-detail.tsx src/app/projects
git commit -m "feat: add project detail pages for all 4 projects"
```

---

### Task 6: motion(framer-motion) 애니메이션 + Aceternity/Magic UI 컴포넌트 반영

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/project-card.tsx`
- Create: `src/components/motion-reveal.tsx`

**Interfaces:**
- Produces: `<MotionReveal>{children}</MotionReveal>` — 스크롤 시 fade+slide-up 리빌 래퍼

- [ ] **Step 1: motion 설치**

```bash
pnpm add motion
```

- [ ] **Step 2: MotionReveal 컴포넌트 작성**

`src/components/motion-reveal.tsx`:
```typescript
"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function MotionReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: 랜딩 페이지 프로젝트 그리드에 적용**

`src/app/page.tsx`의 프로젝트 카드 map을 `MotionReveal`로 감싼다:
```typescript
{projects.map((project, i) => (
  <MotionReveal key={project.slug} delay={i * 0.08}>
    <ProjectCard project={project} />
  </MotionReveal>
))}
```
(`import { MotionReveal } from "@/components/motion-reveal";` 추가)

- [ ] **Step 4: 필요 시 Aceternity UI / Magic UI에서 컴포넌트 발췌**

플레이풀한 디테일(스포트라이트 카드 hover 효과, 애니메이션 텍스트 등)이 더 필요하면 https://ui.aceternity.com/ 또는 Magic UI에서 컴포넌트 코드를 그대로 복사해 `src/components/ui/`에 추가하고 재사용한다. 처음부터 새로 만들지 않는다.

- [ ] **Step 5: 개발 서버에서 애니메이션 확인**

Run: `pnpm dev`, 랜딩 페이지 스크롤하며 카드 리빌 애니메이션 확인

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/motion-reveal.tsx src/app/page.tsx
git commit -m "feat: add scroll-reveal motion to landing page"
```

---

### Task 7: 검증 (impeccable, 빌드, 반응형)

**Files:** 없음 (검증만)

- [ ] **Step 1: 프로덕션 빌드**

Run: `pnpm build`
Expected: 에러 없이 빌드 성공, 5개 라우트(`/`, `/projects/teachmon`, `/projects/nuri`, `/projects/m-adp`, `/projects/church`) 모두 생성됨

- [ ] **Step 2: lint**

Run: `pnpm lint`
Expected: 에러 없음

- [ ] **Step 3: impeccable detect로 AI-티 패턴 검사**

Run: `npx impeccable@latest detect src/app/globals.css`
Run: `npx impeccable@latest detect src/app/page.tsx`
Run: `npx impeccable@latest detect src/components/project-detail.tsx`
Expected: 결과 확인 후 지적된 anti-pattern(과용 폰트, 뻔한 그라디언트 등) 있으면 수정

- [ ] **Step 4: `run` 스킬로 실제 브라우저 확인**

`run` 스킬을 사용해 `pnpm dev`로 앱을 띄우고 랜딩 + 프로젝트 4개 페이지를 모바일/데스크톱 너비에서 스크린샷으로 확인. 텍스트 잘림, 카드 레이아웃 깨짐, 코드블록 가로 스크롤 여부 점검.

- [ ] **Step 5: 발견된 이슈 수정 후 최종 커밋**

```bash
git add -A
git commit -m "fix: address impeccable and responsive review findings"
```
(수정 사항 없으면 이 스텝 스킵)

---

## Self-Review 결과

- **스펙 커버리지:** 랜딩(Task 4), 프로젝트 4개 상세 페이지(Task 5), 비주얼 시스템/라이브러리(Task 1, 3, 6), 검증(Task 7) — 스펙 전 항목 커버됨.
- **플레이스홀더 스캔:** 없음. 모든 코드/데이터는 실제 값.
- **타입 일관성:** `Project`, `TroubleshootingEntry` 타입을 Task 2에서 정의하고 Task 3, 4, 5에서 동일 이름/필드로 소비함. `project.slug`, `project.brandColor` 등 필드명 전 태스크에서 일치.
