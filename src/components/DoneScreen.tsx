import { useEffect } from 'preact/hooks';
import { computeTier, type EventState } from '../lib/event-state';
import { TierBadge } from './TierBadge';
import { Summary } from './Summary';

/**
 * 완료/결과 화면 (와이어프레임 07번)
 *
 * - 마운트 시 body[data-tier] set + 언마운트 시 cleanup
 *   (MainScreen과 동일 메커니즘 — 등급별 배경 트랜지션 적용)
 * - TierBadge size="lg" 노출 (tier === 'none'도 'none' 변형으로 표시)
 * - Summary 컴포넌트로 요약 박스 분리
 */
type Props = {
  state: EventState;
};

export function DoneScreen({ state }: Props) {
  const tier = computeTier(state.missions);

  useEffect(() => {
    document.body.dataset.tier = tier;
    return () => {
      delete document.body.dataset.tier;
    };
  }, [tier]);

  return (
    <div class="done-screen">
      <TierBadge tier={tier} size="lg" />

      <section class="done-message">
        <h1 class="thanks-title">
          참여해 주셔서<br />감사합니다.
        </h1>
        <p class="thanks-sub">경품 수령이 완료되었습니다.</p>
      </section>

      <Summary state={state} />
    </div>
  );
}
