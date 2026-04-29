import { useState, useEffect } from 'preact/hooks';
import { CLOCK_TICK_MS } from '../lib/constants';

/**
 * 라이브 클록 훅
 *
 * - 1초마다 현재 Date를 갱신해 반환
 * - 마운트 시 즉시 현재 시각을 초기값으로 사용
 * - 언마운트 시 setInterval cleanup
 * - SSR-safe: useEffect 안에서만 window 접근
 */
export function useLiveClock(): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date());
    }, CLOCK_TICK_MS);
    return () => {
      window.clearInterval(id);
    };
  }, []);

  return now;
}
