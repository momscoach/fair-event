import { completedCount, type EventState } from '../lib/event-state';
import { MISSION_COUNT } from '../lib/constants';
import { formatDateTime } from '../lib/format';

/**
 * DoneScreen 요약 박스 — 완료 미션 / 참여 시각 / 지급 시각
 */
type Props = {
  state: EventState;
};

export function Summary({ state }: Props) {
  const completed = completedCount(state.missions);
  return (
    <section class="summary">
      <div class="summary-row">
        <span class="summary-key">완료 미션</span>
        <span class="summary-val">
          {completed} / {MISSION_COUNT}
        </span>
      </div>
      <div class="summary-row">
        <span class="summary-key">참여 시각</span>
        <span class="summary-val">{formatDateTime(state.started_at)}</span>
      </div>
      {state.finished_at && (
        <div class="summary-row">
          <span class="summary-key">지급 시각</span>
          <span class="summary-val">{formatDateTime(state.finished_at)}</span>
        </div>
      )}
    </section>
  );
}
