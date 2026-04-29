import type { Countdown as CountdownState } from '../hooks/useCountdown';

/**
 * 카운트다운 — REMAINING TIME (HH:MM:SS)
 * 만료 시 회색 톤으로 죽임 (.countdown-expired)
 */
type Props = {
  countdown: CountdownState;
};

export function Countdown({ countdown }: Props) {
  return (
    <section class={countdown.isExpired ? 'countdown countdown-expired' : 'countdown'}>
      <div class="countdown-label">REMAINING TIME</div>
      <div class="countdown-time">
        {countdown.hh}:{countdown.mm}:{countdown.ss}
      </div>
    </section>
  );
}
