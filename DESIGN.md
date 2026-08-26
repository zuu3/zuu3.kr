# zuu3.kr Portfolio Design System

<!-- design-md:section experience -->
## 1. Experience

<!-- design-md:claim scope kind=product-surface lang=en -->
### Scope

고등학생 개발자 오주현의 개인 포트폴리오. 프로젝트를 가장 먼저 보여주고, 각 프로젝트는 스크롤에 따라 도입부 문장이 강조되며 드러난 뒤 기여/기능/트러블슈팅이 일반 텍스트로 이어지는 단일 페이지 서사 구조.
<!-- design-md:claim-end -->

<!-- design-md:claim primary-tasks kind=user-outcomes count=5 lang=en -->
### Primary tasks

- 방문자가 히어로에서 이름과 한 줄 소개를 빠르게 파악한다

- About에서 수상/활동/자격/리더십 이력을 연도순으로 훑어본다

- 각 프로젝트의 도입부(왜 만들었는지)를 스크롤 강조로 읽는다

- 프로젝트의 기여/기능/트러블슈팅을 이어서 읽는다

- 이메일로 연락한다
<!-- design-md:claim-end -->

### Design direction

- 타이포그래피가 주역 — 장식보다 크기·굵기·여백으로 위계를 만든다

- baemin 2.0의 밝은 민트는 실제 행동 지점(CTA 버튼)에만 쓰고 배경/보더/장식으로 확산시키지 않는다

- About과 히어로는 기본적으로 흑백/그레이스케일로 두고, 색은 프로젝트 섹션의 브랜드 컬러와 히어로 CTA 버튼에만 남긴다

### Principles

- primary(민트)는 실제 클릭 가능한 행동(CTA)에만 사용한다 — 배지, 보더, 장식용 프레임, 라벨 텍스트에 습관적으로 채워 넣지 않는다

- 각 프로젝트의 brandColor는 그 프로젝트 섹션 안에서만 강조로 쓰고 사이트 전역 톤을 바꾸지 않는다

- 본문/수치/기간 같은 사실 정보는 항상 명료하게 우선한다

- 여백과 타이포 크기 대비로 위계를 만들고, 색·배지·프레임 같은 장식적 강조 수단은 최후에 검토한다

### Avoid

- primary 컬러를 히어로 eyebrow 텍스트, About 사진 프레임, 카테고리 라벨처럼 매 섹션에 반복 사용하지 않는다

- 한글 디스플레이 헤딩에 음수 letter-spacing(tracking-tight)을 쓰지 않는다 — Paperlogy+한글 조합에서 글자가 뭉개진다

- 트러블슈팅을 problem/cause/solution/result 필드 구분 없이 하나의 문단으로 합치지 않는다

- 기술 스택을 프로젝트 섹션 맨 끝에 텍스트로만 나열하지 않는다 — 태그라인 아래 박스형 칩으로 배치한다

<!-- design-md:section foundations -->
## 2. Foundations

<!-- design-md:claim foundations kind=rules-or-constraints lang=en -->
### Semantic tokens

- **color.border**: `#e5e5e5` — 구분선, 카드/칩 보더
- **color.canvas**: `#ffffff` — 페이지 기본 배경
- **color.foreground**: `#171717` — 본문 텍스트
- **color.muted**: `#737373` — 보조 텍스트, 캡션, 라벨
- **color.primary**: `#0cefd3` — baemin 2.0 브라이트 민트. 실제 행동(CTA 버튼)에만 사용 — 배지/보더/장식 금지
- **radius.card**: `12px` — 기여 콜아웃 박스 등 카드형 컨테이너
- **radius.control**: `8px` — 버튼, 칩, 작은 컨트롤

### Contrast pairs

- color.foreground on color.canvas: minimum 7:1
- color.foreground on color.primary: minimum 4.5:1

### Reduced motion

Required.

### Foundation rules

- primary 민트는 사이트 전체에서 클릭 가능한 CTA 버튼 1곳에만 채움색으로 사용한다

- 본문 텍스트는 color.foreground, 보조 텍스트는 color.muted만 사용한다

- 히어로와 About 섹션은 프로젝트별 brandColor를 쓰지 않는다 — 색은 프로젝트 섹션 안에서만 등장한다
<!-- design-md:claim-end -->

<!-- design-md:section typography-assets -->
## 3. Typography & Assets

### Type roles

| Role | Usage | Family | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|---|
| display | 히어로/프로젝트/섹션 타이틀 | Paperlogy | clamp(1.5rem, 4vw, 3.75rem) | 900 | 1.15 | normal |
| body | 본문 텍스트 | Pretendard | 1rem | 400 | 1.6 |  |
| label | 라벨/캡션/칩 | Pretendard | 0.75rem | 700 | 1.3 | 0.02em |

### Assets

| Asset | Kind | Source status | License status | Notes |
|---|---|---|---|---|
| paperlogy | font | project-owned | verified | display 폰트, 로컬 woff2로 이미 프로젝트에 포함 |
| pretendard | font | project-owned | verified | 본문 폰트, 로컬 woff2로 이미 프로젝트에 포함 |

### Rules

- display 롤(Paperlogy)에는 한글 조합 시 음수 tracking을 적용하지 않는다 — 기본 tracking 유지

- baemin 공식 WORK 서체는 라이선스 미확보로 이식하지 않는다

<!-- design-md:section components-states -->
## 4. Components & States

### Component: hero-cta

**Semantics:** 히어로의 유일한 primary 색 사용처. 이메일 연락 액션

- Anatomy: label
- Variants: default
- States: default, hover, focus-visible
- Token references: color.primary, radius.control

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | applicable |  |
| focus-visible | applicable |  |
| disabled | not-applicable | 항상 활성 상태인 mailto 링크 |
| loading | not-applicable | 페이지 이동 없는 즉시 액션 |
| error | not-applicable | 실패 상태가 없는 mailto 링크 |
| success | not-applicable | 성공 상태 표시가 없는 mailto 링크 |

### Component: project-hook

**Semantics:** 프로젝트 섹션 상단, 스크롤 고정된 채 도입부 문장이 순차 강조되는 영역. 문장이 2개 이하이면 강조 애니메이션 없이 그대로 표시

- Anatomy: index, period, name, tagline, tech-chip-row, hook-sentences
- Variants: default
- States: default
- Token references: radius.control

- Interaction kind: non-interactive
- Interaction reason: 스크롤에 반응하는 표시 영역이며 클릭 가능한 컨트롤이 아니다

### Component: contribution-callout

**Semantics:** 기여 목록을 담는 프로젝트 brandColor 5% 틴트 배경의 카드

- Anatomy: heading, item-list
- Variants: default
- States: default
- Token references: radius.card

- Interaction kind: non-interactive
- Interaction reason: 정보 표시 전용 카드

### Component: troubleshooting-entry

**Semantics:** problem/solution은 진하게, cause/result는 보조 톤으로 표시해 핵심을 우선 노출하는 트러블슈팅 항목

- Anatomy: title, problem, cause, solution, result
- Variants: default
- States: default

- Interaction kind: non-interactive
- Interaction reason: 정보 표시 전용 항목

### Rules

- 인터랙티브 컴포넌트는 hover와 focus-visible 상태를 시각적으로 구분한다

<!-- design-md:section layout-platforms -->
## 5. Layout & Platforms

### Responsive constraints

- Minimum supported width: 320px
- Reflow target: 200% zoom

### Layout rules

- 전체 폭 컨테이너 없이 각 섹션은 max-w-3xl~5xl 내부 컨텐츠 폭을 사용한다

- 프로젝트 도입부 pin 스크롤은 prefers-reduced-motion에서 비활성화하고 즉시 전체 텍스트를 표시한다

### Platform: web

- 반응형 브레이크포인트는 Tailwind 기본값(sm/md/lg)을 따른다

<!-- design-md:section content-locales -->
## 6. Content & Locales

### Voice

- direct

- concise

- personal

### Terminology

| Term | Preferred form |
|---|---|
| 수상 | award |
| 프로젝트 | project |

### Locale: ko (supported)

- 모든 UI 카피는 한국어 우선

<!-- design-md:section governance -->
## 7. Governance

<!-- design-md:claim authority kind=project-system lang=en -->
### Authority

This document is the project design contract for the declared scope.
<!-- design-md:claim-end -->

<!-- design-md:claim application-priority order=prompt-fact,repository-fact,system-contract,reference-inspiration lang=en -->
### Application priority

1. Direct user instructions for the requested scope.
2. Repository facts.
3. This system contract.
4. Reference inspiration.
<!-- design-md:claim-end -->

<!-- design-md:claim unknowns policy=absent-at-smallest-unresolved-boundary lang=en -->
### Unknowns

Omit only the smallest unresolved value or group. Do not replace it with a plausible default.
<!-- design-md:claim-end -->

<!-- design-md:claim changes policy=review-record-validate-before-adoption lang=en -->
### Changes

Record, review, and validate changes before adoption.
<!-- design-md:claim-end -->

### Project priority details

1. experience

2. foundations

3. typography-assets

4. components-states

5. layout-platforms

6. content-locales

### Additional change rules

- 색상/타이포 토큰 변경은 DESIGN.md 갱신 후 적용한다

### Decision provenance

- foundations.tokens.color.primary — agent-proposed-greenfield-decision; evidence: baemin reference catalog verified_v2 2026-07-12, tokens.colors.primary; 사용자 승인 하에 프로젝트 브랜드로 채택
- experience.avoid — prompt-fact; evidence: 사용자 피드백: 'primary를 계속 넣으려 하니까 그런거같음' — 히어로/About에 민트를 과도하게 반복 사용해 결과물이 나빠짐
- typography_assets.rules — prompt-fact; evidence: 사용자 피드백: '폰트가 못생겼다' — tracking-tight가 한글+Paperlogy 조합에서 글자를 뭉개뜨림을 확인 후 제거
