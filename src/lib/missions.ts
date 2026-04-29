import { MISSION_COUNT } from './constants';

/**
 * 미션 외부 URL 목록
 *
 * placeholder. 실 URL은 행사 직전 교체.
 * 테스트용으로 실제 동작하는 URL 사용.
 */
export const MISSION_URLS: readonly string[] = [
  'https://www.naver.com',
  'https://www.daum.net',
  'https://www.google.com',
  'https://www.youtube.com',
  'https://www.kakao.com',
  'https://www.coupang.com',
  'https://www.11st.co.kr',
];

// 컴파일 타임 검증: MISSION_URLS 길이가 MISSION_COUNT와 일치해야 함
if (MISSION_URLS.length !== MISSION_COUNT) {
  throw new Error(
    `[fair-event] MISSION_URLS.length (${MISSION_URLS.length}) !== MISSION_COUNT (${MISSION_COUNT})`,
  );
}
