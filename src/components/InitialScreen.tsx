import { createState, saveState } from '../lib/event-state';
import { Button } from './Button';

/**
 * 진입/시작 화면 (와이어프레임 00번)
 *
 * - 무가입/비수집 안내 노출
 * - [이벤트 참여] 버튼 클릭 시 새 EventState 생성 후 저장
 * - onStart 콜백으로 부모(app.tsx)에서 useEntryGuard.refresh() 호출
 */
type Props = {
  onStart: () => void;
};

export function InitialScreen({ onStart }: Props) {
  const handleStart = () => {
    saveState(createState());
    onStart();
  };

  return (
    <div class="initial-screen">
      <header class="initial-header">
        <h1 class="initial-title">박람회 이벤트 참여</h1>
        <p class="initial-subtitle">
          [이벤트 참여] 버튼을 누르면 참여가 시작됩니다
        </p>
      </header>

      <Button variant="primary" onClick={handleStart}>
        이벤트 참여
      </Button>

      <ul class="initial-notice">
        <li>회원가입·인증 없음</li>
        <li>어떤 개인정보도 수집하지 않습니다</li>
        <li>이 기기 안에서만 진행 상태가 저장됩니다</li>
      </ul>
    </div>
  );
}
