import { useEffect, useState } from 'preact/hooks';
import {
  completedCount,
  computeTier,
  type EventState,
} from '../lib/event-state';
import { useCountdown } from '../hooks/useCountdown';
import { MISSION_COUNT } from '../lib/constants';
import { LiveClockHeader } from './LiveClockHeader';
import { Banner } from './Banner';
import { MissionCounter } from './MissionCounter';
import { MissionGrid } from './MissionGrid';
import { Countdown } from './Countdown';
import { Button } from './Button';
import { PayoutModal } from './PayoutModal';

/**
 * 미션 진행 화면 (와이어프레임 01-05번)
 *
 * - LiveClockHeader / Banner / MissionCounter / MissionGrid / Countdown 컴포넌트 조합
 * - 만료 시 미션 버튼 disabled, 배너 문구 변경, 카운트다운 표시 변경
 * - [지급 완료 처리] 버튼은 만료 무관 1개 이상이면 활성
 * - [지급 완료 처리] 클릭 시 PayoutModal 노출 → 확인 시에만 onPayout 호출
 */
type Props = {
  state: EventState;
  onMissionDone: (idx: number) => void;
  onPayout: () => void;
};

export function MainScreen({ state, onMissionDone, onPayout }: Props) {
  const cd = useCountdown(state);
  const completed = completedCount(state.missions);
  const tier = computeTier(state.missions);
  const [showModal, setShowModal] = useState(false);

  // 등급 변동에 따라 body[data-tier] 토글
  useEffect(() => {
    document.body.dataset.tier = tier;
    return () => {
      delete document.body.dataset.tier;
    };
  }, [tier]);

  const handleConfirm = () => {
    // onPayout()이 markFinished + refresh → done 화면 전환되며 자동 unmount
    onPayout();
    setShowModal(false);
  };

  return (
    <>
      <div class="main-screen">
        <LiveClockHeader />
        <Banner expired={cd.isExpired} />
        <MissionCounter
          completed={completed}
          total={MISSION_COUNT}
          tier={tier}
        />
        <MissionGrid
          state={state}
          expired={cd.isExpired}
          onComplete={onMissionDone}
        />
        <Countdown countdown={cd} />
        <p class="privacy">
          사생활 보호 모드 — 어떤 데이터도 수집·저장하지 않습니다
        </p>
        <Button
          variant="primary"
          disabled={completed === 0}
          onClick={() => setShowModal(true)}
        >
          [ 지급 완료 처리 ]
        </Button>
      </div>
      {showModal && (
        <PayoutModal
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
