import { useLiveClock } from '../hooks/useLiveClock';
import { formatLiveClock } from '../lib/format';

/**
 * 라이브 클록 헤더 — 1초마다 현재 시각 갱신
 */
export function LiveClockHeader() {
  const now = useLiveClock();
  return <header class="clock">{formatLiveClock(now)}</header>;
}
