import { MISSION_URLS } from '../lib/missions';
import type { EventState } from '../lib/event-state';
import { MissionButton } from './MissionButton';

/**
 * 7개 미션 그리드 (4+3 레이아웃은 CSS .missions가 담당)
 */
type Props = {
  state: EventState;
  expired: boolean;
  onComplete: (idx: number) => void;
};

export function MissionGrid({ state, expired, onComplete }: Props) {
  return (
    <section class="missions">
      {state.missions.map((done, i) => (
        <MissionButton
          key={i}
          index={i}
          url={MISSION_URLS[i]}
          done={done}
          expired={expired}
          onComplete={onComplete}
        />
      ))}
    </section>
  );
}
