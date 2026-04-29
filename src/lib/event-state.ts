import {
  AUTO_DELETE_MS,
  MISSION_COUNT,
  MISSION_DURATION_MS,
  STORAGE_KEY,
} from './constants';

/**
 * 이벤트 도메인 상태 모듈
 *
 * - localStorage만 사용 (백엔드 0)
 * - 모든 함수는 SSR-safe (window 가드)
 * - 불변성: 변경 함수는 새 객체를 반환
 */

export type Tier = 'none' | 'bronze' | 'silver' | 'gold';

export type EventState = {
  /** 익명 참여자 식별자 (crypto.randomUUID) */
  uuid: string;
  /** 참여 시작 시각 (ISO 8601) */
  started_at: string;
  /** 미션 완료 플래그 배열 (length === MISSION_COUNT) */
  missions: boolean[];
  /** 종료 처리 여부 */
  is_finished: boolean;
  /** 종료 시각 (is_finished=true일 때만 기록) */
  finished_at?: string;
};

// ============================================================
// 내부 헬퍼
// ============================================================

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function generateUuid(): string {
  // crypto.randomUUID는 모던 브라우저(2022+) 표준이지만
  // 만약을 대비한 폴백 (RFC4122 v4 형식)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // eslint-disable-next-line no-bitwise
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function isValidEventState(value: unknown): value is EventState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;

  if (typeof v.uuid !== 'string' || v.uuid.length === 0) return false;
  if (typeof v.started_at !== 'string' || v.started_at.length === 0) return false;
  if (!Array.isArray(v.missions)) return false;
  if (v.missions.length !== MISSION_COUNT) return false;
  if (!v.missions.every((m) => typeof m === 'boolean')) return false;
  if (typeof v.is_finished !== 'boolean') return false;
  if (v.finished_at !== undefined && typeof v.finished_at !== 'string') return false;

  // started_at 파싱 가능 여부
  if (Number.isNaN(Date.parse(v.started_at))) return false;

  return true;
}

// ============================================================
// State 생성/입출력
// ============================================================

/** 새 EventState 생성 (저장하지는 않음) */
export function createState(): EventState {
  return {
    uuid: generateUuid(),
    started_at: new Date().toISOString(),
    missions: new Array(MISSION_COUNT).fill(false) as boolean[],
    is_finished: false,
  };
}

/** localStorage에서 상태 로드. 없거나 파싱/스키마 검증 실패 시 null. */
export function loadState(): EventState | null {
  if (!hasStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidEventState(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** localStorage에 상태 저장 */
export function saveState(s: EventState): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // QuotaExceeded 등은 조용히 실패. 도메인은 이미 새 객체를 가지고 있음.
  }
}

/** localStorage에서 상태 삭제 */
export function clearState(): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ============================================================
// State 변환 (불변)
// ============================================================

/**
 * 미션 idx를 완료 처리한 새 상태를 반환.
 * - idx 범위 밖이면 원본 그대로 반환
 * - 이미 true인 경우에도 원본 그대로 반환 (불필요한 새 객체 생성 방지)
 */
export function markMission(s: EventState, idx: number): EventState {
  if (!Number.isInteger(idx) || idx < 0 || idx >= MISSION_COUNT) {
    return s;
  }
  if (s.missions[idx] === true) {
    return s;
  }
  const nextMissions = s.missions.slice();
  nextMissions[idx] = true;
  return {
    ...s,
    missions: nextMissions,
  };
}

/**
 * 종료 상태로 마킹한 새 상태를 반환.
 * - 이미 종료된 경우 원본 그대로 반환
 */
export function markFinished(s: EventState): EventState {
  if (s.is_finished) return s;
  return {
    ...s,
    is_finished: true,
    finished_at: new Date().toISOString(),
  };
}

// ============================================================
// 시간 계산
// ============================================================

function startedAtMs(s: EventState): number {
  return Date.parse(s.started_at);
}

/** 미션 수행 시간(2h) 만료 여부 */
export function isExpired2h(s: EventState): boolean {
  const start = startedAtMs(s);
  if (Number.isNaN(start)) return true;
  return start + MISSION_DURATION_MS < Date.now();
}

/** 자동 삭제 시간(12h) 만료 여부 */
export function isExpired12h(s: EventState): boolean {
  const start = startedAtMs(s);
  if (Number.isNaN(start)) return true;
  return start + AUTO_DELETE_MS < Date.now();
}

/** 미션 수행 시간 기준 남은 ms (음수면 0) */
export function remainingMs(s: EventState): number {
  const start = startedAtMs(s);
  if (Number.isNaN(start)) return 0;
  const remaining = start + MISSION_DURATION_MS - Date.now();
  return remaining > 0 ? remaining : 0;
}

// ============================================================
// 등급/카운트
// ============================================================

/** 완료 미션 개수 */
export function completedCount(missions: boolean[]): number {
  let count = 0;
  for (const m of missions) {
    if (m === true) count += 1;
  }
  return count;
}

/**
 * 완료 개수 기준 등급 산출
 * - 0개:   none
 * - 1~3개: bronze
 * - 4~6개: silver
 * - 7개:   gold
 */
export function computeTier(missions: boolean[]): Tier {
  const n = completedCount(missions);
  if (n <= 0) return 'none';
  if (n <= 3) return 'bronze';
  if (n <= 6) return 'silver';
  return 'gold';
}
