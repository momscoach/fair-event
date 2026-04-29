/**
 * 박람회 이벤트 도메인 상수
 *
 * - 무가입, 비수집, localStorage만 사용
 * - 12시간 자동 삭제 (다음 날 재참여 의도)
 */

/** localStorage 키 */
export const STORAGE_KEY = 'fair-event-state';

/** 미션 개수 */
export const MISSION_COUNT = 7;

/** 미션 수행 가능 시간 (2시간) */
export const MISSION_DURATION_MS = 2 * 60 * 60 * 1000;

/** 자동 삭제 시간 (12시간) */
export const AUTO_DELETE_MS = 12 * 60 * 60 * 1000;

/** 미션 잠금 지연 (1초) */
export const LOCK_DELAY_MS = 1000;

/** 시계 틱 주기 (1초) */
export const CLOCK_TICK_MS = 1000;

/** 12h 만료 자동 삭제 체크 주기 (1분) — useEntryGuard에서 setInterval로 사용 */
export const EXPIRY_CHECK_INTERVAL_MS = 60 * 1000;
