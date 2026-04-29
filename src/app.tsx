import { useCallback } from 'preact/hooks';
import { useEntryGuard } from './hooks/useEntryGuard';
import { InitialScreen } from './components/InitialScreen';
import { MainScreen } from './components/MainScreen';
import { DoneScreen } from './components/DoneScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  loadState,
  saveState,
  markMission,
  markFinished,
} from './lib/event-state';

/**
 * 화면 라우팅
 *
 * - useEntryGuard가 localStorage를 읽어 initial/main/done을 결정
 * - 모든 상태 변경(start/mission/payout)은 saveState 후 refresh()로 재평가
 * - 'expired' / 'locked'와 같은 세부 분기는 화면 내부 상태로 처리 (MainScreen의 isExpired 등)
 */
export function App() {
  const { screen, state, refresh } = useEntryGuard();

  const handleStart = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleMissionDone = useCallback(
    (idx: number) => {
      const s = loadState();
      if (!s) return;
      saveState(markMission(s, idx));
      refresh();
    },
    [refresh],
  );

  const handlePayout = useCallback(() => {
    const s = loadState();
    if (!s) return;
    saveState(markFinished(s));
    refresh();
  }, [refresh]);

  return (
    <ErrorBoundary>
      <div class="app-shell">
        {screen === 'initial' && <InitialScreen onStart={handleStart} />}
        {screen === 'main' && state && (
          <MainScreen
            state={state}
            onMissionDone={handleMissionDone}
            onPayout={handlePayout}
          />
        )}
        {screen === 'done' && state && <DoneScreen state={state} />}
      </div>
    </ErrorBoundary>
  );
}
