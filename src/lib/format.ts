/**
 * 공용 시간/날짜 포매터
 *
 * - 외부 라이브러리 의존 없음 (Intl도 사용하지 않음 — 약한 인터넷 환경 보수적 대응)
 * - 모든 결과는 한국식 표기 (YYYY-MM-DD HH:mm[:ss])
 */

const DOW = ['일', '월', '화', '수', '목', '금', '토'];

const pad = (n: number) => n.toString().padStart(2, '0');

/**
 * 라이브 클록용 포맷 — `YYYY-MM-DD (요일) HH:mm:ss`
 */
export function formatLiveClock(d: Date): string {
  const dow = DOW[d.getDay()];
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} (${dow}) ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * ISO 문자열을 `YYYY-MM-DD HH:mm`로 포맷.
 * 빈 입력/파싱 실패 시 '-'를 반환.
 */
export function formatDateTime(iso: string | undefined): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
