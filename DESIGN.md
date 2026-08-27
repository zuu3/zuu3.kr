# zuu3.kr Portfolio Design System

<!-- design-md:section experience -->
## 1. Experience

<!-- design-md:claim scope kind=product-surface lang=en -->
### Scope

고등학생 개발자 오주현의 개인 포트폴리오. 프로젝트를 가장 먼저 보여주고, 각 프로젝트는 스크롤에 따라 도입부 문장이 강조되며 드러난 뒤 기여/기능/트러블슈팅이 일반 텍스트로 이어지는 단일 페이지 서사 구조.
<!-- design-md:claim-end -->

<!-- design-md:claim primary-tasks kind=user-outcomes count=5 lang=en -->
### Primary tasks

- 방문자가 히어로에서 role을 빠르게 파악한다

- About에서 이름·태그라인·수상/활동/자격/리더십 이력을 연도순으로 훑어본다

- 각 프로젝트의 도입부(왜 만들었는지)를 스크롤 강조로 읽는다

- 프로젝트의 기여/기능/트러블슈팅(코드 diff 포함)을 이어서 읽는다

- 이메일로 연락한다
<!-- design-md:claim-end -->

### Design direction

- 타이포그래피가 주역 — 장식보다 크기·굵기·여백으로 위계를 만든다

- 당근마켓(Karrot) 캐럿 오렌지를 사이트 전역 accent 컬러로 사용한다 — 배경용/텍스트용을 구분하지 않고 단일 hex로 통일한다

- About과 히어로는 기본적으로 흑백/그레이스케일로 두고, 색은 프로젝트 섹션의 브랜드 컬러와 히어로 CTA 버튼에만 남긴다

- 이름은 About의 태그라인 헤드라인으로 노출한다 — 별도 라벨로 이름만 반복하지 않는다

### Principles

- primary(오렌지)는 accent가 필요한 곳(활성 내비 상태, 강조 버튼, 브랜드 포인트)에 단일 hex로 일관되게 사용한다

- 각 프로젝트의 brandColor는 그 프로젝트 섹션 안에서만 강조로 쓰고 사이트 전역 톤을 바꾸지 않는다

- 본문/수치/기간 같은 사실 정보는 항상 명료하게 우선한다

- 여백과 타이포 크기 대비로 위계를 만들고, 색·배지·프레임 같은 장식적 강조 수단은 최후에 검토한다

- 본문 속 실제 코드/API 식별자는 인라인 코드 스타일로 구분해 스캔 포인트를 만든다

### Avoid

- 한글 디스플레이 헤딩에 음수 letter-spacing(tracking-tight)을 쓰지 않는다 — Paperlogy+한글 조합에서 글자가 뭉개진다

- 트러블슈팅을 problem/cause/solution/result 필드 구분 없이 하나의 문단으로 합치지 않는다

- 기술 스택을 프로젝트 섹션 맨 끝에 텍스트로만 나열하지 않는다 — 태그라인 아래 박스형 칩으로 배치한다

- 기여(Contribution) 목록을 틴트 배경 카드로 감싸지 않는다 — 기능/트러블슈팅과 같은 평문 리스트로 유지한다

- Before/After 코드를 별도 박스 두 개로 나란히 배치하지 않는다 — 하나의 diff 블록(삭제 빨강 -, 추가 초록 +)으로 합친다

<!-- design-md:section foundations -->
## 2. Foundations

<!-- design-md:claim foundations kind=rules-or-constraints lang=en -->
### Semantic tokens

- **color.border**: `#e5e5e5` — 구분선, 카드/칩 보더
- **color.canvas**: `#ffffff` — 페이지 기본 배경
- **color.foreground**: `#171717` — 본문 텍스트
- **color.muted**: `#737373` — 보조 텍스트, 캡션, 라벨
- **color.primary**: `#ff6f0f` — Karrot(당근마켓) SEED v2 carrot-500. 배경/텍스트 구분 없이 사이트 전역에서 단일 hex로 사용
- **color.surface**: `#fafafa` — 트러블슈팅 카드 등 옅은 패널 배경 (neutral-50)
- **radius.card**: `12px` — 트러블슈팅 Problem/Cause/Solution/Result 패널 등 카드형 컨테이너
- **radius.control**: `8px` — 버튼, 칩, 작은 컨트롤, 코드 diff 블록

### Contrast pairs

- color.foreground on color.canvas: minimum 7:1
- color.foreground on color.primary: 사용자 승인 하에 일부 텍스트-on-white 사용처는 WCAG AA(4.5:1) 미달을 허용한다 — 배경용/텍스트용 hex를 분리하지 않기 위한 트레이드오프
- color.foreground on color.surface: minimum 7:1

### Reduced motion

Required.

### Foundation rules

- primary 오렌지는 사이트 전역에서 단일 hex(`#ff6f0f`)로 통일해서 사용한다 — 배경용/텍스트용 톤 분리 금지

- 본문 텍스트는 color.foreground, 보조 텍스트는 color.muted만 사용한다

- 히어로와 About 섹션은 프로젝트별 brandColor를 쓰지 않는다 — 색은 프로젝트 섹션 안에서만 등장한다

- 히어로 배경의 그레인 텍스처는 SVG feTurbulence로 구현하고 WebGL/외부 라이브러리를 쓰지 않는다
<!-- design-md:claim-end -->

<!-- design-md:section typography-assets -->
## 3. Typography & Assets

### Type roles

| Role | Usage | Family | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|---|
| display | 히어로 타이틀, 프로젝트 이름 | Paperlogy | clamp(1.5rem, 4vw, 3.75rem) | 900 | 1.15 | normal |
| display-secondary | About 태그라인 헤드라인(이름 포함) | Paperlogy | 1.75rem | 700 | 1.35 | normal |
| body-display | About bio 문단 | Paperlogy | 1rem | 500 | 1.6 |  |
| body | 본문 텍스트 | Pretendard | 1rem | 400 | 1.6 |  |
| label | 라벨/캡션/칩 | Pretendard | 0.75rem | 700 | 1.3 | 0.02em |
| inline-code | 본문 속 코드/API 식별자 | monospace | 0.9em | 400 |  |  |

### Assets

| Asset | Kind | Source status | License status | Notes |
|---|---|---|---|---|
| paperlogy | font | project-owned | verified | display 폰트. src/app/fonts/paperlogy/에 100~900 전체 9웨이트 self-host, 실제 렌더는 500/700/900만 사용 |
| pretendard | font | project-owned | verified | 본문 폰트, 로컬 woff2로 이미 프로젝트에 포함 |

### Rules

- display 롤(Paperlogy)에는 한글 조합 시 음수 tracking을 적용하지 않는다 — 기본 tracking 유지

- 본문 단락은 body-display(Paperlogy 500) 또는 body(Pretendard 400) 중 섹션 성격에 맞게 선택하고 Paperlogy Black(900)을 문단에 쓰지 않는다

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

### Component: about-profile

**Semantics:** About 좌측 프로필 패널. 태그라인(이름 포함)이 헤드라인 역할을 한다

- Anatomy: photo, eyebrow, tagline-headline, bio, birthdate, school, email, phone
- Variants: default
- States: default
- Token references: radius.control

- Interaction kind: non-interactive
- Interaction reason: 정보 표시 전용 패널

### Component: about-timeline

**Semantics:** Award/Activity/Certificate/Leadership을 하나로 합쳐 연도 역순으로 정렬한 리스트. 카테고리별로 분리된 4개 박스를 쓰지 않는다

- Anatomy: year, category-label, item
- Variants: default
- States: default

- Interaction kind: non-interactive
- Interaction reason: 정보 표시 전용 리스트

### Component: project-hook

**Semantics:** 프로젝트 섹션 상단, 스크롤 고정된 채 도입부 문장이 순차 강조되는 영역. 문장이 2개 이하이면 강조 애니메이션 없이 그대로 표시. "Name(alias)" 형식의 프로젝트명은 영문 메인 이름을 brandColor로 크게, 괄호 안 한글 alias는 작고 muted하게 분리해 표시한다

- Anatomy: index, period, name, alias, tagline, tech-chip-row, hook-sentences
- Variants: default
- States: default
- Token references: radius.control

- Interaction kind: non-interactive
- Interaction reason: 스크롤에 반응하는 표시 영역이며 클릭 가능한 컨트롤이 아니다

### Component: contribution-list

**Semantics:** 기여(Contribution) 목록. 카드/틴트 배경 없이 기능·트러블슈팅과 동일한 평문 리스트로 표시한다

- Anatomy: heading, item-list
- Variants: default
- States: default

- Interaction kind: non-interactive
- Interaction reason: 정보 표시 전용 리스트

### Component: troubleshooting-entry

**Semantics:** Problem/Cause/Solution/Result를 옅은 회색 카드(radius.card, color.surface)로 감싼다. Problem/Solution은 진하게, Cause/Result는 보조 톤. 본문 속 코드/API 식별자는 inline-code로 표시하고 각 필드의 마지막 문장은 semibold로 강조한다. codeBefore/codeAfter가 있으면 카드 아래 단일 diff 블록(radius.control)을 붙인다

- Anatomy: title, problem, cause, solution, result, code-diff
- Variants: default
- States: default
- Token references: radius.card, color.surface

- Interaction kind: non-interactive
- Interaction reason: 정보 표시 전용 항목

### Component: troubleshooting-code-diff

**Semantics:** codeBefore/codeAfter를 Before/After 두 박스로 나누지 않고, 삭제 줄은 빨간 배경 + '-' 마커, 추가 줄은 초록 배경 + '+' 마커로 하나의 다크 코드 블록에 이어 붙인다

- Anatomy: removed-lines, added-lines
- Variants: default
- States: default
- Token references: radius.control

- Interaction kind: non-interactive
- Interaction reason: 정보 표시 전용 코드 블록

### Rules

- 인터랙티브 컴포넌트는 hover와 focus-visible 상태를 시각적으로 구분한다

<!-- design-md:section layout-platforms -->
## 5. Layout & Platforms

### Responsive constraints

- Minimum supported width: 320px
- Reflow target: 200% zoom

### Layout rules

- 전체 폭 컨테이너 없이 각 섹션은 max-w-2xl~6xl 내부 컨텐츠 폭을 사용한다 — About은 max-w-6xl, 트러블슈팅 카드는 max-w-2xl로 줄 길이를 좁혀 가독성을 우선한다

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

- 모든 UI 카피는 한국어 우선. 프로젝트 섹션 소제목(기여/기능/트러블슈팅)은 Contribution/Features/Troubleshooting 영문으로 표기한다

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

- foundations.tokens.color.primary — prompt-fact; evidence: .claude/data/references/karrot/DESIGN.md tokens.colors.primary(carrot-500, `#ff6f0f`), verified_v2 2026-07-11; 사용자 지시로 baemin 민트에서 Karrot 오렌지로 리브랜드, 배경/텍스트 hex 분리 없이 단일 값 사용하도록 승인
- experience.avoid — prompt-fact; evidence: 사용자 피드백 누적: primary 과다 사용, 트러블슈팅 카드 스타일, diff 코드블록, contribution 카드 제거 등
- typography_assets.rules — prompt-fact; evidence: 사용자 피드백: About 영역 폰트가 다른 헤딩과 안 어울림 — Paperlogy Black 단일 웨이트만 있어 굵기 조절이 불가능했던 게 원인. 100~900 전체 웨이트를 내려받아 해결
- components_states.components — repository-fact; evidence: src/components/about-section.tsx, project-narrative.tsx, hero.tsx 현재 구현 (2026-08-26 기준)
