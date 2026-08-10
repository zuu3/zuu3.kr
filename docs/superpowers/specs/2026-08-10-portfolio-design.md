# 포트폴리오 웹사이트 설계

## 목적
프론트엔드 개발자 취업용 포트폴리오. 기존 create-next-app 기본 템플릿을 걷어내고 새로 만든다. AI가 만든 티 나는 뻔한 랜딩페이지가 아니라, 프로필의 "스펀지 같은 개발자" 콘셉트를 담은 컬러풀하고 장난기 있는(playful) 무드로 간다.

## 콘텐츠 소스
`/Users/juhyun/Desktop/취업/회사별자료/CV3/오주현_포트폴리오_CV3.pdf` (가장 최신본, 2026-08-09)

- Profile: 이름, 한 줄 소개("스펀지 같은 개발자"), 연락처, Awards/Certificate/Leader/Activity
- 프로젝트 4개, 각각 개요/제작기간/운영기간/기술스택/기여/Main features & Contribution/Troubleshooting(Problem-Cause-Solution-Result + 코드블록):
  1. **TeachMon(티치몬)** — 교내 방과후 자습/이석 관리 서비스, 블루/다크 브랜드
  2. **Nuri(누리)** — 외국인 유학생 한국 문화 적응 플랫폼, 핑크 브랜드
  3. **M-ADP(마듭)** — 교내 유휴 자원 관리형 배포 클라우드 플랫폼, 블루/화이트 브랜드
  4. **순복음범천교회 웹사이트** — 주보/일정 관리 교회 웹, 블랙/화이트 포멀 브랜드

## 구조
- `/` — 랜딩: 프로필 히어로(프로필 사진, 소개, Awards/Activity 등) + 프로젝트 4개 카드 그리드
- `/projects/teachmon`, `/projects/nuri`, `/projects/m-adp`, `/projects/church` — 프로젝트별 독립 상세 페이지. 각 페이지는 해당 프로젝트의 실제 브랜드 컬러/로고 톤을 그대로 가져와 서로 다른 무드를 준다(개성). 콘텐츠는 PDF의 개요/기여/Main features/Troubleshooting(코드블록 포함)을 그대로 옮긴다.

## 비주얼 시스템
- 랜딩은 컬러풀·플레이풀 톤. 프로젝트 상세 페이지는 각 프로젝트 고유 브랜드 컬러를 사용해 페이지마다 무드가 달라짐.
- 폰트: 본문은 Pretendard, 헤드라인은 개성 있는 별도 서체(예: Paperlogy 계열)로 페어링 — Arial 등 흔한 폰트 지양(impeccable 스킬로 검증됨).
- shadcn/ui로 카드/배지/버튼 등 기본 컴포넌트 구성.
- motion(framer-motion)으로 스크롤 리빌, 카드 호버, 페이지 전환 애니메이션.
- Aceternity UI / Magic UI 등 공개된 컴포넌트를 가져다 써서 파티클, 애니메이션 텍스트, 스포트라이트 카드 같은 디테일 처리. 전부 새로 만들지 않는다.

## 기술 스택
기존 seabass 프로젝트(Next.js App Router + TypeScript) 그대로 유지. 새 의존성: shadcn/ui, motion, 필요한 Aceternity/Magic UI 컴포넌트.

## 비범위(Out of scope)
- 백엔드/CMS 없음 — 콘텐츠는 정적으로 코드에 박아넣는다.
- 다국어 지원 없음.
- 블로그/기타 섹션 없음, 위 5페이지(랜딩+프로젝트 4개)만.

## 검증
- `npx impeccable@latest detect` 각 페이지 스타일에 대해 실행, AI-티 패턴 없는지 확인.
- 반응형(모바일) 확인.
- 각 프로젝트 상세 페이지 Troubleshooting 코드블록 문법 강조 정상 렌더 확인.
