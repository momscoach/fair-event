import type { ComponentChildren } from 'preact';

/**
 * 공용 CTA 버튼
 *
 * - variant: 'primary'(보라 채움) | 'secondary'(흰 + 회색 테두리)
 * - fullWidth: 기본 true (.btn-full)
 * - 모달 안에서는 .modal-buttons 컨테이너 flex로 자동 균등 분배
 */
type Props = {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ComponentChildren;
  type?: 'button' | 'submit';
  ariaLabel?: string;
};

export function Button({
  variant = 'primary',
  fullWidth = true,
  disabled = false,
  onClick,
  children,
  type = 'button',
  ariaLabel,
}: Props) {
  const cls = [
    'btn',
    `btn-${variant}`,
    fullWidth ? 'btn-full' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      class={cls}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
