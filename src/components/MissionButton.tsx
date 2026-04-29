import { useState, useRef, useEffect } from 'preact/hooks';
import { LOCK_DELAY_MS } from '../lib/constants';

/**
 * 미션 버튼 (Phase D 핵심 로직)
 *
 * 기획서 04 CORE LOGIC 그대로:
 * - <a target="_blank" rel="noopener noreferrer">로 사용자 제스처 100% 인정
 * - onClick에서 e.preventDefault() 사용 금지 (disabled 상태 제외)
 * - window.open API 절대 금지 (인앱 브라우저 차단/무시 위험)
 * - onClick에 setTimeout(LOCK_DELAY_MS=1000) 등록 → 1초 후 markMission(idx)
 *
 * Phase G에서 검증 필요:
 * - 카카오톡 / 인스타그램 / 라인 / 네이버 인앱 브라우저
 * - 새 탭 열린 후 메인 탭 살아있는지
 * - 1초 후 카운트 정상 누적되는지
 */

type Props = {
  index: number; // 0~6
  url: string;
  done: boolean; // state.missions[i]
  expired: boolean; // 카운트다운 만료
  onComplete: (idx: number) => void;
};

type Status = 'done' | 'locking' | 'idle' | 'disabled';

export function MissionButton({
  index,
  url,
  done,
  expired,
  onComplete,
}: Props) {
  const [locking, setLocking] = useState(false);
  const timerRef = useRef<number | null>(null);

  // unmount 시 타이머 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const disabled = done || locking || expired;
  const status: Status = done
    ? 'done'
    : locking
      ? 'locking'
      : expired
        ? 'disabled'
        : 'idle';

  const handleClick = (e: MouseEvent) => {
    // 비활성 상태(완료/잠금중/만료)에서 클릭 → 새 탭도 안 열리게 차단
    // CSS의 pointer-events:none이 1차 방어, 이건 2차 방어 (Safari/구형 인앱 등)
    if (disabled) {
      e.preventDefault();
      return;
    }

    // 사용자 제스처 인정 → <a>가 자연스럽게 새 탭 열게 둠 (preventDefault 호출 X)
    setLocking(true);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      onComplete(index);
      // setLocking(false) 불필요:
      // 부모가 markMission(idx)을 호출하면 done=true로 리렌더 → status='done' 분기
    }, LOCK_DELAY_MS);
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      class={`mission mission-${status}`}
      aria-disabled={disabled}
      onClick={handleClick}
    >
      <span class="mission-label">미션{index + 1}</span>
      {status === 'done' && (
        <span class="mission-check" aria-hidden="true">
          ✓
        </span>
      )}
      {status === 'locking' && (
        <span class="mission-dots" aria-hidden="true">
          ...
        </span>
      )}
    </a>
  );
}
