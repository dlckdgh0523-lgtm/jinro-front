
# 진로나침반 Frontend

학생 맞춤형 진로 탐색, 학습 관리, 입시 정보 분석을 지원하는 AI 기반 진로·진학 플랫폼의 프론트엔드입니다.

진로나침반 프론트엔드는 학생과 교사가 각자의 역할에 맞는 화면에서 성적, 목표, 상담, 학습 계획, 알림, AI 진로 상담 기능을 사용할 수 있도록 구성되어 있습니다.

---

## 프로젝트 소개

진로나침반은 학생이 자신의 성적과 목표를 기반으로 진로를 설계하고, 교사가 학생의 학습·상담·진학 흐름을 함께 관리할 수 있도록 돕는 서비스입니다.

프론트엔드는 단순한 화면 구현이 아니라, 실제 교육 현장에서 사용할 수 있는 흐름을 목표로 다음과 같은 경험을 제공합니다.

- 학생 / 교사 역할 분리
- 성적 변화 시각화
- 목표 설정 및 학습 계획 관리
- 상담 요청 및 메모 확인
- 실시간 알림
- AI 진로 상담
- 입시 정보 조회

---

## 주요 화면 / 기능

### 학생 기능
- 로그인 / 회원가입
- Google 로그인
- 대시보드
- 성적 입력
- 성적 변화 추이 확인
- 입시 데이터 조회
- 목표 설정
- AI 진로 상담
- 상담 요청
- 교사 메모 확인
- 주간 학습 계획 / 완료 체크
- 성장 리포트
- 마이페이지
- 문의/건의사항 등록
- 회원탈퇴

### 교사 기능
- 로그인 / 회원가입
- Google 로그인
- 대시보드
- 학생 목록 조회
- 학생 상세 조회
- 학생 성적 변화 확인
- 상담 요청 수락 / 거절 / 관리
- 상담 메모 관리
- 알림 확인

---

## 기술 스택

- React
- TypeScript
- Vite
- React Router
- Radix UI
- MUI
- Recharts
- React Hook Form

---

## 폴더 구조

```bash
.
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ components/      # 공통 UI 컴포넌트
│  │  ├─ context/         # 알림, 학습계획 등 전역 상태
│  │  ├─ pages/           # 학생/교사/인증 화면
│  │  ├─ utils/           # API 유틸, 인증 유틸
│  │  └─ ...
├─ index.html
├─ vite.config.ts
├─ amplify.yml
└─ package.json
실행 방법
1. 패키지 설치
npm install
2. 환경변수 설정

.env.example을 참고해 .env.local 또는 .env를 설정합니다.

cp .env.example .env.local
3. 개발 서버 실행
npm run dev
4. 빌드
npm run build
환경변수 예시
VITE_API_BASE_URL=

예시:

VITE_API_BASE_URL=https://your-backend-domain.com
배포 정보
Frontend Repository
https://github.com/dlckdgh0523-lgtm/jinro-front
Backend Repository
https://github.com/dlckdgh0523-lgtm/jinro-backend
Live URL
https://www.jinro.it.kr
사용자 흐름
학생

회원가입 → 성적 입력 → 목표 설정 → AI 상담 → 학습 계획 관리 → 상담 신청 → 성장 추이 확인

교사

회원가입 → 학생 연결 → 학생 목록 확인 → 성적 및 상담 상태 확인 → 메모 작성 및 상담 관리

프로젝트 특징
학생 / 교사 역할 분리 기반 UI
실제 API 연동을 전제로 한 구조
성적/상담/학습/알림 흐름 통합
AI 기반 진로·진학 지원 경험 제공
교육 현장에서 바로 사용할 수 있는 흐름 중심 설계
향후 개선 방향
추천 기능 고도화
실시간 알림 안정성 개선
입시 데이터 연동 확장
AI 상담 품질 향상
운영 기능 보강


