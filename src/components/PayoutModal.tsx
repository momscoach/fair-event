import { useEffect } from 'preact/hooks';
import { Button } from './Button';

/**
 * 지급 완료 확인 모달 (와이어프레임 06번)
 *
 * - 백드롭 클릭 / ESC 키 → 취소
 * - [확인] → 부모가 markFinished 후 done 화면으로 라우팅 → 자동 unmount
 * - ARIA: role="dialog" + aria-modal="true" (minimal)
 * - 취소/확인 모두 공용 Button 사용 (.modal-buttons flex로 동일 너비)
 */
type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export function PayoutModal({ onConfirm, onCancel }: Props) {
  // ESC 키 → 취소
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      class="modal-backdrop"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div class="modal" onClick={(e: MouseEvent) => e.stopPropagation()}>
        <h2 class="modal-title">지급 완료 처리</h2>
        <p class="modal-message">
          지급 완료 처리하시겠습니까?
          <br />
          되돌릴 수 없습니다.
        </p>
        <div class="modal-buttons">
          <Button variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
