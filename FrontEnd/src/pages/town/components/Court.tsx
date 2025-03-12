// 법원
import CourtModal from './CourtModal';
import courtImg from '@/assets/court.png';

const Court = () => {
  return (
    <div>
      <img src={courtImg} alt='법원' />
      {/* 법원 클릭 시 퀴즈 모달 */}
      <CourtModal />
    </div>
  );
};
export default Court;
