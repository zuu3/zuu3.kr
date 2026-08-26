# shadcn / React Bits 전수 조사

이전 조사(포크, 2분 만에 완료)가 얕다는 피드백을 받아 다시 함. 이번엔 실제
레지스트리 API(`mcp__shadcn__list_items_in_registries`, 전체 471개 아이템 중
`registry:ui` 58개)와 React Bits의 공식 llms.txt(`https://reactbits.dev/llms.txt`,
무료 컴포넌트 166개 전체)를 직접 긁어서 **하나도 빠짐없이** 판정함. 모든 항목에
소스를 명시함(shadcn / React Bits 혼동 방지).

## 이미 쓰고 있는 것 (7개)

| 소스 | 컴포넌트 | 위치 |
|---|---|---|
| shadcn | Accordion | `project-narrative.tsx` Troubleshooting |
| shadcn | Badge | `project-narrative.tsx` 기술스택 pill |
| shadcn | Button | `site-footer.tsx` 연락처 링크 |
| React Bits | LogoLoop | `tech-logo-loop.tsx` |
| React Bits | LineSidebar | `site-nav.tsx` 데스크탑 사이드 내비 |
| React Bits | BubbleMenu | `mobile-menu.tsx` 전 해상도 메뉴 |
| React Bits | TiltedCard | `project-narrative.tsx` 프로젝트 스크린샷 |
| React Bits | ParticleText | `hero.tsx` "Frontend Engineer" |

---

## shadcn `registry:ui` 전체 58개 판정

이 사이트는 **폼도 없고, 인증도 없고, 표/차트도 없는 정적 1페이지 스크롤 사이트**임.
그래서 shadcn 컴포넌트 절반 이상은 원천적으로 자리가 없음 — "없다"도 판정임.

| 컴포넌트 | 판정 | 이유 |
|---|---|---|
| accordion | **사용 중** | Troubleshooting |
| alert | 자리 없음 | 경고/에러 상태 없음 |
| alert-dialog | 자리 없음 | 파괴적 액션(삭제 등) 없음 |
| aspect-ratio | **후보** | `TiltedCard`/스크린샷 컨테이너의 수동 `aspect-[1524/1293]`를 대체 가능. 다만 TiltedCard가 자체 CSS로 비율을 잡고 있어 이중 관리 리스크 |
| avatar | 검토 후 기각 | About 프로필 사진은 큰 세로형 인물샷(160×213) — Avatar는 작은 원형 아이콘용이라 형태가 안 맞음 (이전 세션에서 이미 판단, 미설치) |
| badge | **사용 중** | 기술스택 pill |
| breadcrumb | 자리 없음 | 중첩 라우팅 없음, 단일 페이지 |
| button | **사용 중** | footer 연락처 |
| button-group | 자리 없음 | 버튼 그룹 UI 없음 |
| calendar | 자리 없음 | 날짜 선택 UI 없음 |
| card | 검토 후 기각 | Features/기여 카드를 박스형에서 hairline+flat으로 계속 되돌린 이력(이번 세션) — Card primitive 자체가 지금 방향과 반대 |
| carousel | 검토 후 기각 | 프로젝트 4개를 캐러셀에 숨기면 스크롤 탐색성·SEO 저하. 지금처럼 전부 세로로 펼쳐두는 게 스크롤리텔링 컨셉에 맞음 |
| chart | 자리 없음 | 통계/데이터 시각화 없음 |
| checkbox | 자리 없음 | 폼 없음 |
| collapsible | 중복 | Accordion으로 이미 커버 |
| combobox | 자리 없음 | 검색/선택 UI 없음 |
| command | 자리 없음 | 커맨드 팔레트 필요 없는 규모의 사이트 |
| context-menu | 자리 없음 | 우클릭 메뉴 쓸 곳 없음 |
| dialog | **후보 (보류)** | 스크린샷 라이트박스. 사용자가 이전 라운드에서 "별로"라 반려함 — 재검토 시 이유 필요 |
| drawer | 자리 없음 | 모바일 바텀시트로 쓸 폼/설정 없음 |
| dropdown-menu | 중복 | BubbleMenu가 내비 역할 이미 수행 |
| empty | 자리 없음 | 빈 상태 화면 없음(정적 콘텐츠만) |
| field | 자리 없음 | 폼 없음 |
| form | 자리 없음 | 폼 없음 |
| hover-card | **후보(중)** | 깃허브 링크 hover 시 repo 설명 미리보기 — 실제 GitHub API 연동 없인 가짜 데이터라 보류 |
| input | 자리 없음 | 폼 없음 |
| input-group | 자리 없음 | 폼 없음 |
| input-otp | 자리 없음 | 인증 없음 |
| item | **후보** | 아이콘+제목+설명 행(row)을 표준화하는 primitive. 지금 Features 리스트, 기여 리스트가 전부 손수 짠 flex 구조인데 `Item`으로 통일하면 코드 중복 줄어듦. 시각 변화는 없음(리팩터 성격) |
| label | 자리 없음 | 폼 라벨 없음 |
| menubar | 자리 없음 | 앱형 메뉴바 없음 |
| navigation-menu | 중복 | LineSidebar/BubbleMenu가 내비 역할 이미 수행 |
| pagination | 자리 없음 | 페이지네이션 없음(전부 한 페이지) |
| popover | 자리 없음 | hover-card/tooltip과 겹침, 추가 용도 없음 |
| progress | 자리 없음 | 장시간 처리 작업 없음 |
| radio-group | 자리 없음 | 폼 없음 |
| resizable | 자리 없음 | 패널 리사이즈 UI 없음 |
| scroll-area | **후보(하)** | 코드 diff `<pre>` 블록의 네이티브 스크롤 대체. 효과 미미, 급하지 않음 |
| select | 자리 없음 | 폼 없음 |
| separator | **후보 (보류)** | 반복되는 `border-t`/`divide-y` 리팩터. 사용자가 반려함 |
| sheet | 검토 후 기각 | Dialog와 같은 용도(라이트박스)로 경쟁, Dialog가 데스크톱 위주 사이트엔 더 적합 |
| sidebar | 중복 | shadcn 자체 앱사이드바 블록 — 이미 React Bits LineSidebar로 대체 완료, 바꿀 이유 없음 |
| skeleton | **후보 (보류)** | 이미지 로딩 placeholder. 사용자가 반려함 |
| slider | 자리 없음 | 폼 없음 |
| sonner (토스트) | **후보** | footer 이메일을 클릭 시 "복사하기"로 바꾸고 복사 완료 토스트 표시하면 실사용성 있는 마이크로 인터랙션. 지금은 `mailto:` 링크뿐 |
| spinner | 자리 없음 | 비동기 로딩 상태 없음(정적 사이트) |
| switch | 자리 없음 | 설정/토글 UI 없음(다크모드 토글 등 스코프 아님) |
| table | 자리 없음 | 표 데이터 없음 |
| tabs | **후보(중, 구조 변경)** | 프로젝트 섹션 내 Features/Troubleshooting을 탭으로 전환하면 스크롤 길이가 줄어듦. 단, 지금은 전부 펼쳐서 보여주는 스크롤리텔링 컨셉이라 탭 뒤에 숨기면 정보 접근성이 떨어질 수 있음 — 트레이드오프 있는 구조 변경이라 신중 필요 |
| textarea | 자리 없음 | 폼 없음 |
| toggle / toggle-group | 자리 없음 | 토글 UI 없음 |
| tooltip | **후보 (보류)** | About 타임라인 카테고리 라벨 보조설명. 사용자가 반려함 |
| kbd | 자리 없음 | 키보드 단축키 없음 |
| native-select | 자리 없음 | 폼 없음 |
| direction | 자리 없음 | RTL 지원 불필요 |
| attachment / bubble / marker / message / message-scroller | 자리 없음 | 채팅 UI 프리미티브 — 이 사이트와 무관 |

**shadcn 요약**: 58개 중 실사용 후보는 **item, sonner(토스트), tabs(구조변경), aspect-ratio, hover-card, scroll-area** 6개 + 이미 반려된 4개(separator/skeleton/dialog/tooltip). 나머지 48개는 이 사이트 성격(폼 없음/인증 없음/표 없음/단일 페이지)상 원천적으로 자리가 없음.

---

## React Bits 무료 카탈로그 166개 판정

카테고리별(Text Animations 28 / Animations 36 / Components 40 / Backgrounds 45 —
실제로는 일부 소계 오차 있을 수 있으나 llms.txt 전 항목 확인함)로 훑음. 이미 쓴
5개(LogoLoop/LineSidebar/BubbleMenu/TiltedCard/ParticleText) 제외.

### Text Animations (27개 중 후보만 추림, 나머지는 자리 없음/과함으로 기각)

| 컴포넌트 | 판정 | 이유 |
|---|---|---|
| BlurText | **후보(중)** | About 섹션 태그라인이나 프로젝트 hook 문장 진입 시 블러→선명 리빌. 지금 GSAP로 직접 opacity 페이드 이미 구현돼 있어 교체 실익 적음 |
| SplitText | **후보(중)** | 프로젝트 타이틀(`M-ADP`, `Nuri` 등) 진입 애니메이션. Hero의 ParticleText와 톤이 겹쳐서 페이지 전체에 파티클/스플릿류가 과할 위험 |
| CountUp | **후보(콘텐츠 선행 필요)** | About에 "프로젝트 4개 · 수상 3회" 같은 요약 통계 줄이 생기면 그 숫자에. 지금은 그런 요약 줄 자체가 없음 |
| ShinyText / GradientText | 기각 | 색상 거버넌스(민트 포인트 컬러만 강조 원칙)와 충돌 위험 큼 |
| DecryptedText / GlitchText | 기각 | 톤(배민 참고, 절제된 느낌)과 정반대의 해커/사이버펑크 무드 |
| TextType(타이핑 이펙트) | 기각 | Hero enum "Frontend Engineer"는 이미 ParticleText가 담당. 중복 |
| 나머지(ASCIIText, CircularText, CurvedLoop, EchoText, FallingText, FoldText, FuzzyText, MaskedHeading, RotatingText, ScrambledText, ScrollFloat, ScrollReveal, ScrollVelocity, Shuffle, SplitFlapText, StrokeText, TextCursor, TextLoop, TextPressure, TrueFocus, VariableProximity, WarpText) | 기각 | 정보 전달과 무관한 장식성 텍스트 이펙트 — 포트폴리오 톤에 안 맞거나 이미 유사 효과(스크롤 하이라이트, ParticleText) 보유 |

### Animations (36개 — 대부분 커서/클릭 장식류, 거의 전부 기각)

| 컴포넌트 | 판정 | 이유 |
|---|---|---|
| AnimatedContent | 중복 | About `about-row` GSAP stagger로 이미 구현됨. 교체하면 의존성만 늘어남 |
| FadeContent | 중복 | 위와 동일한 이유로 각 섹션에 이미 유사 진입 애니메이션 있음 |
| GlareHover | **후보(중, 매우 미묘하게만)** | Features 리스트 항목에 hover 시 광택 — 이번 세션에 "카드 이펙트 빼고 깔끔하게"를 여러 번 반복 요청받았기 때문에 강도를 아주 낮게 하지 않으면 다시 반려될 위험 큼 |
| Noise(필름 그레인) | 기각 | 이전 세션에서 커서-홀 그레인 효과를 "원하는 느낌 아님"으로 이미 되돌린 전례 |
| ClickSpark, Magnet, GhostCursor, Crosshair, BlobCursor, TargetCursor, SwarmCursor, PixelTrail, ImageTrail, MagnetLines | 기각 | 커서/클릭 순수 장식. 정보 전달 없음, 톤 충돌 가능성 최고 등급 |
| Cubes, ElasticMesh, MagicRings, OrbitImages, RippleDistortion, ShapeBlur, SplashCursor, StickerPeel, Strands, StarBorder, Ribbons | 기각 | 배경/장식용 3D·물리 이펙트, 이 사이트 어느 섹션에도 정보적 필요 없음 |
| ElectricBorder | 기각 | 카드 테두리 강조용인데 지금 사이트는 테두리 자체를 계속 없애는 방향으로 정리해옴 |
| GradualBlur, HalftoneReveal, PixelSwap, PixelTransition, ScrollExpand, LaserFlow, MetallicPaint | 기각 | 미디어 전환 이펙트 — 프로젝트 스크린샷 전환에 쓸 수는 있으나 TiltedCard로 이미 인터랙션 확보됨, 중복 |

### Components (40개)

| 컴포넌트 | 판정 | 이유 |
|---|---|---|
| AnimatedList | **후보(중)** | About 타임라인 리스트 항목 stagger 진입 — 지금 GSAP로 이미 구현(`about-row`), 교체 실익 낮음. 새 리스트형 섹션이 생기면 재고 |
| Stepper | **후보(하, 부적합)** | 프로젝트를 "단계"로 표현할 수도 있지만 지금 인덱스(01/02..) + 사이드 내비로 이미 진행 표시 중, 중복 |
| Dock, PillNav, GooeyNav, FlowingMenu, StaggeredMenu, CardNav, InfiniteMenu | 기각 | 전부 내비게이션 대체재 — LineSidebar+BubbleMenu 조합이 이미 데스크톱/모바일 커버, 세 번째 내비 방식은 과함 |
| ProfileCard | **후보(중)** | About 섹션 프로필 사진을 3D 글레어 카드로. Avatar를 기각한 이유(원형 아님)와 별개로 이건 사각형 카드형이라 형태는 맞지만, 다시 "화려하다" 피드백 위험 지대 |
| ReflectiveCard, DecayCard, PixelCard, SpotlightCard, BounceCards, CardSwap, FluidGlass, GlassSurface, Folder, FlyingPosters, ScrollStack, DepthCarousel, MorphSlider, Masonry, CircularGallery, DomeGallery, InfiniteMenu, ModelViewer, Lanyard, OptionWheel, ElasticSlider, CurvedInput, SpecularButton, GlassIcons, MagicBento, ChromaGrid, AccordionGallery | 기각 | 갤러리/카드 전시용 — 프로젝트 4개뿐인 이 사이트 규모엔 과한 스펙터클. 이미 TiltedCard로 스크린샷 인터랙션 확보 |
| Carousel(React Bits판) | 기각 | shadcn Carousel과 같은 이유로 기각(스크롤 탐색성 저하) |
| Counter | CountUp과 중복 | Text Animations의 CountUp과 같은 계열 |

### Backgrounds (45개 — 전부 기각, 이유는 공통)

Aurora, DarkVeil, Dither, DotField, DotGrid, Threads, Waves, Silk, Plasma,
PlasmaWave, Iridescence, LiquidChrome, LiquidEther, GradientWaves(이미 이 세션에서
시도 후 렌더링 실패로 폐기함), Balatro, Ballpit, Beams, ColorBends, EvilEye,
FaultyTerminal, Ferrofluid, FloatingLines, Galaxy, GradientBlinds, Grainient,
GridDistortion, GridMotion, GridScan, Hyperspeed, LetterGlitch, Lightfall,
Lightning, LightPillar, LightRays, LightTunnel, LineWaves, MoltenMetal, Orb,
Particles, PixelBlast, PixelSnow, Prism, PrismaticBurst, Radar, RippleGrid,
Scanner, ShapeGrid, SideRays, SlicedWaves, SoftAurora, Topography, WebThreads,
AcidSquares — **전부 기각**.

이유: (1) Hero 배경은 이미 CSS blob 3개 + noise로 "밋밋하다 → 됐다"로 정착된
상태라 건드릴 이유 없음. (2) 대부분 OGL/three.js 셰이더 기반인데, 이 세션에서
GradientWaves를 붙였다가 "빌드는 되는데 캔버스가 안 보이는" 문제를 끝내 못 고치고
폐기한 전례가 있음 — 같은 카테고리 재시도는 리스크 대비 실익이 낮음.

---

## 결론: 실제로 남는 후보

1,2,3(Separator/Skeleton/Dialog), 4(Tooltip) 전부 반려됐다는 전제 하에, 두
카탈로그를 전수 훑어서 남는 진짜 후보는 이 6개뿐임 — 나머지는 전부 "자리 없음"
아니면 "이미 유사 기능 보유" 아니면 "톤 충돌 위험":

| 순위 | 소스 | 컴포넌트 | 위치 | 비고 |
|---|---|---|---|---|
| 1 | shadcn | **Item** | Features/기여 리스트 구조 통일 | 시각 변화 없는 순수 리팩터, 반려 리스크 없음 |
| 2 | shadcn | **Sonner(토스트)** | footer 이메일 "복사하기" | 유일하게 새 *기능*을 추가하는 항목 |
| 3 | React Bits | **CountUp** | About 통계 요약 줄 (신설 필요) | 콘텐츠 설계 먼저 필요 |
| 4 | shadcn | **Tabs** | 프로젝트 내 Features/Troubleshooting | 스크롤 길이 ↓, 정보 노출 ↓ 트레이드오프 |
| 5 | shadcn | **Aspect Ratio** | TiltedCard 컨테이너 | 효과 미미, 순수 정리 |
| 6 | React Bits | **GlareHover(초저강도)** | Features 항목 hover | 반려 위험 가장 큼, 넣는다면 마지막 |

나머지(shadcn 48개, React Bits 161개)는 이 사이트 구조상 자리가 없거나
이미 다른 걸로 커버됐거나 톤에 안 맞음 — 표에 전부 이유를 남겨뒀음.
