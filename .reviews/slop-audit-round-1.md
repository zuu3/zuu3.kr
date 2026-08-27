# omd:slop-audit — round 1

**Design read:** 1인 개발자 포트폴리오. 독자는 채용 담당자/동료 개발자. 핵심 행동은 프로젝트 스크롤 탐색 + 이메일 연락. 보존해야 할 동작: 스크롤 강조 hook, StickyScroll 코드 패널, GSAP pin. 브랜드 근거: DESIGN.md (Karrot 오렌지 단일 accent, 프로젝트별 brandColor, Pretendard 단일 서체, 타이포 위계 중심).

**검사 방법:** 정적 코드 read + Playwright로 실제 라우트(`/`)를 4개 프로젝트 전부 스크롤하며 desktop 1440px 스크린샷 촬영, 실제 콘텐츠 확인.

## Summary

- BLOCK · QUALITY: 0
- WARN · SLOP: 0
- FYI: 2

이번 세션에 이미 `omd:designer-review`(2라운드) + `omd:feel`이 같은 화면을 돌며 패턴/토큰 위반을 대부분 잡아서, 남는 slop cluster 표면이 얇음. 새로 발견한 패턴 수렴 cluster는 없음 — 각 프로젝트 섹션이 실제 프로젝트마다 다른 코드/스크린샷/트러블슈팅 내용으로 채워져 있고(EVIDENCE 축 통과), 카드·아이콘 타일·그라데이션 같은 장식 패턴이 반복되지 않음.

## Findings

### [FYI · QUALITY-adjacent] CodeBlock 긴 코드 라인이 스크롤 힌트 없이 잘림
- **위치:** `src/components/project-narrative-demos.tsx:44-50` (`CodeBlock`의 `customStyle`)
- **화면 근거:** M-ADP "ChatOps" feature 코드 패널 — `const headers: Record<string, string> = { Accept: 'text/...` 줄이 패널 오른쪽 끝에서 단어 중간에 그대로 잘림, fade-out이나 스크롤바 흔적 없음
- **문맥:** `overflowX: "auto"`가 이미 걸려 있어 기능적으로는 스크롤 가능하지만(맥OS 오버레이 스크롤바라 정적 스크린샷엔 안 보임), 잘린 지점에 아무 시각적 신호가 없어 "더 있다"는 걸 알아채기 어려움. slop cluster는 아니고(반복 패턴이 아니라 단일 컴포넌트 이슈) 접근성 결함도 아니라 QUALITY BLOCK으로 올리진 않음 — 다만 "코드 볼 때 좌우스크롤 최소화"가 이 세션 초반 명시적 요구사항이었던 만큼 FYI로 남김
- **개선 방향(선택):** 우측 끝에 `mask-image: linear-gradient(to right, black calc(100% - 24px), transparent)` 같은 fade 힌트 추가, 또는 `white-space: pre-wrap`으로 줄바꿈 허용(코드 정확성이 우선이라 trade-off 필요)

### [FYI · PREFERENCE] Contribution 리스트가 옅은 회색 틴트 카드(`bg-[#f3f4f5]`)
- **위치:** `src/components/project-narrative.tsx:284`
- **문맥:** DESIGN.md `contribution-list` 컴포넌트는 "카드/틴트 배경 없이 기능·트러블슈팅과 동일한 평문 리스트"를 명시하는데 실제 구현은 틴트 카드 그리드. 이미 `.omd/preferences.md`에 `pref_mt9teb9l_10b6aaeb` 등으로 pending 잡혀 있는 기존 drift라 새 finding으로 카운트하지 않음 — 다음 `omd:designer-review`/`omd:learn` 라운드에서 "지금 구현대로 채택"인지 "평문 리스트로 되돌리기"인지 결정 필요.

## Verdict

새로 막을 slop cluster 없음. 위 두 건은 FYI — 원하면 CodeBlock fade-hint만 가볍게 추가 가능(디자인 판단 불필요, 순수 CSS).
