# 박람회 이벤트 참여·경품 지급 웹앱

박람회 현장에서 사용자가 QR/단축URL로 진입해 7개 미션을 수행하고 등급별 경품을 받는 모바일 웹앱.

## 특징

- **무가입, 비수집**: 백엔드 0, localStorage만 사용
- **PWA**: vite-plugin-pwa, 약한 인터넷 환경 대비
- **모바일 우선**: 시스템 폰트, 외부 의존성 최소화
- **12시간 자동 삭제**: 다음 날 재참여 의도된 동작
- **등급**: 미션 0개=none / 1~3개=bronze / 4~6개=silver / 7개=gold

## 기술 스택

- Vite + Preact + TypeScript
- Vanilla CSS + CSS variables (Tailwind 미사용)
- vite-plugin-pwa (Service Worker)
- 라우팅 라이브러리 미사용 (상태 enum 분기)
- 배포 타깃: Cloudflare Pages

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 (기본 포트 5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 타입체크만
npm run type-check
```

## 폴더 구조

```
fair-event/
├── public/                 # 정적 자산
├── src/
│   ├── components/         # UI 컴포넌트 (다음 단계)
│   ├── hooks/              # 커스텀 훅 (다음 단계)
│   ├── lib/
│   │   ├── constants.ts    # 도메인 상수
│   │   ├── missions.ts     # 미션 외부 URL 목록
│   │   └── event-state.ts  # 상태 도메인 모듈 (생성/저장/만료/등급)
│   ├── app.tsx             # 화면 분기 골격
│   ├── main.tsx            # 엔트리
│   └── index.css           # 글로벌 스타일 + 등급 토큰
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── package.json
```

## 도메인 상수 (`src/lib/constants.ts`)

| 상수 | 값 | 의미 |
| --- | --- | --- |
| `MISSION_COUNT` | 7 | 미션 개수 |
| `MISSION_DURATION_MS` | 2시간 | 미션 수행 가능 시간 |
| `AUTO_DELETE_MS` | 12시간 | 자동 삭제 시간 |
| `LOCK_DELAY_MS` | 1초 | 미션 잠금 지연 |
| `CLOCK_TICK_MS` | 1초 | 시계 틱 주기 |
| `STORAGE_KEY` | `fair-event-state` | localStorage 키 |
# fair-event
