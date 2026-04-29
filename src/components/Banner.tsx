/**
 * 안내/만료 배너
 *
 * - expired=false: 보라 톤 안내 — "동일 브라우저 진행" 문구
 * - expired=true: 빨간 톤 — "참여 시간이 종료되었습니다."
 */
type Props = {
  expired: boolean;
};

export function Banner({ expired }: Props) {
  return (
    <div class={expired ? 'banner banner-expired' : 'banner'}>
      {expired
        ? '참여 시간이 종료되었습니다.'
        : '이벤트는 반드시 동일한 브라우저에서 진행해주시기 바랍니다.'}
    </div>
  );
}
