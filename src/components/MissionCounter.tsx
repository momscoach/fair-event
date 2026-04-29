import type { Tier } from '../lib/event-state';
import { TierBadge } from './TierBadge';

/**
 * N/7 카운터 + 등급 배지(sm)
 */
type Props = {
  completed: number;
  total: number;
  tier: Tier;
};

export function MissionCounter({ completed, total, tier }: Props) {
  return (
    <section class="counter">
      <div class="counter-count">
        {completed}/{total}
      </div>
      <div class="counter-label">MISSION COMPLETED</div>
      <TierBadge tier={tier} size="sm" />
    </section>
  );
}
