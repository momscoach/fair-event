import { useState, useEffect } from 'preact/hooks';
import { CLOCK_TICK_MS } from '../lib/constants';
import { remainingMs, isExpired2h, type EventState } from '../lib/event-state';

export type Countdown = {
  /** 남은 ms (음수 없음, 만료 시 0) */
  remaining: number;
  /** 2시간 만료 여부 */
  isExpired: boolean;
  /** 'HH' (zero-padded) */
  hh: string;
  /** 'MM' */
  mm: string;
  /** 'SS' */
  ss: string;
};

const pad = (n: number) => n.toString().padStart(2, '0');

function compute(state: EventState): Countdown {
  const ms = remainingMs(state);
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  return {
    remaining: ms,
    isExpired: isExpired2h(state),
    hh: pad(Math.floor(totalSec / 3600)),
    mm: pad(Math.floor((totalSec % 3600) / 60)),
    ss: pad(totalSec % 60),
  };
}

/**
 * 미션 수행 카운트다운 훅
 *
 * - started_at + 2h 까지 남은 시간을 1초마다 갱신
 * - 만료 시 0으로 고정 + isExpired=true
 * - dep은 state.started_at만 사용 (정상 케이스에서 변경되지 않음)
 */
export function useCountdown(state: EventState): Countdown {
  const [tick, setTick] = useState<Countdown>(() => compute(state));

  useEffect(() => {
    // mount/started_at 변경 시 즉시 한 번 갱신
    setTick(compute(state));
    const id = window.setInterval(() => {
      setTick(compute(state));
    }, CLOCK_TICK_MS);
    return () => {
      window.clearInterval(id);
    };
    // started_at만 dep으로: 동일 참여 중 안정적으로 동일 인터벌 유지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.started_at]);

  return tick;
}
