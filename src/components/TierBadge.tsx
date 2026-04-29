import type { Tier } from '../lib/event-state';

/**
 * 등급 배지 — sm/lg 통합
 *
 * - size='sm' (default): 헤더 N/7 카운터 옆 작은 알약
 * - size='lg': DoneScreen 큰 박스 (라벨 + 보조 문구)
 * - tier='none' + size='sm' → 미렌더 (기존 동작 유지)
 * - tier='none' + size='lg' → 'none' 변형으로 노출 (DoneScreen 영역 유지)
 */
type Props = {
  tier: Tier;
  size?: 'sm' | 'lg';
};

export function TierBadge({ tier, size = 'sm' }: Props) {
  if (size === 'sm' && tier === 'none') return null;

  const cls = `tier-badge tier-badge-${size} tier-badge-${tier}`;
  const label = tier === 'none' ? '-' : tier.toUpperCase();

  if (size === 'lg') {
    return (
      <div class={cls}>
        <div class="tier-badge-lg-label">{label}</div>
        <div class="tier-badge-lg-sub">최종 등급</div>
      </div>
    );
  }

  return <div class={cls}>{label}</div>;
}
