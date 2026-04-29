import { useState, useEffect, useCallback } from 'preact/hooks';
import { loadState, clearState, isExpired12h, type EventState } from '../lib/event-state';
import { EXPIRY_CHECK_INTERVAL_MS } from '../lib/constants';

/**
 * 진입 분기 훅
 *
 * - 저장된 상태가 없으면 initial
 * - 12시간 경과했으면 자동 삭제 후 initial
 * - 종료 처리되어 있으면 done
 * - 그 외에는 main
 *
 * refresh()를 호출하여 외부 변경(미션 마킹, 종료 처리 등) 후 재평가.
 *
 * Phase F:
 * - mount 시 1회 평가 + 1분 주기 setInterval로 12h 만료 자동 감지
 *   (사용자가 페이지를 켜둔 채로 12h 경과 → 자동으로 initial 화면 + clearState)
 */
export type Screen = 'initial' | 'main' | 'done';

export function useEntryGuard() {
  const [state, setState] = useState<EventState | null>(null);
  const [screen, setScreen] = useState<Screen>('initial');

  const evaluate = useCallback(() => {
    const s = loadState();
    if (!s) {
      setState(null);
      setScreen('initial');
      return;
    }
    if (isExpired12h(s)) {
      clearState();
      setState(null);
      setScreen('initial');
      return;
    }
    if (s.is_finished) {
      setState(s);
      setScreen('done');
      return;
    }
    setState(s);
    setScreen('main');
  }, []);

  useEffect(() => {
    // mount 시 1회 평가
    evaluate();
    // 1분 주기로 재평가 → 12h 만료 자동 처리
    const id = window.setInterval(() => {
      evaluate();
    }, EXPIRY_CHECK_INTERVAL_MS);
    return () => {
      window.clearInterval(id);
    };
  }, [evaluate]);

  return { screen, state, refresh: evaluate };
}
