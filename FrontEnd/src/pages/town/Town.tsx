import MyHouse from './components/MyHouse';
import RecyclingCenter from './components/RecyclingCenter';
import SewageTreatmentCenter from './components/SewageTreatmentCenter';
import Vehicle from './components/Vehicle';
import Court from './components/Court';
import town from '@/assets/town.png';
import TownName from './components/TownName';

const Town = () => {
  // 마을 전체 이벤트 조회

  return (
    // <div className='w-full h-full relative'>
    <div className='fixed inset-0 overflow-hidden'>
      {/* 배경 이미지 */}
      <div>
        <img src={town} alt='마을' className='w-screen h-screen object-cover' />
      </div>

      {/* 환영 메시지와 컴포넌트들을 위한 오버레이 컨테이너 */}
      <div className='absolute inset-0'>
        {/* 환영 메시지 */}
        {/* -translate-x-1/2: 요소를 X축 기준으로 왼쪽으로 50% 이동 */}
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg text-3xl z-20'>
          <TownName />
        </div>

        {/* 각 건물/시설 컴포넌트들 - 이미지의 특정 위치에 고정 */}
        <div className='absolute top-[-2%] left-[28%] z-10'>
          <MyHouse />
        </div>

        <div className='absolute bottom-[30%] left-[30%] z-10'>
          <SewageTreatmentCenter />
        </div>

        <div className='absolute top-[75%] left-[30%] transform z-10'>
          <Court />
        </div>

        {/* <div className='absolute top-[20%] right-[5%] z-10'>
          <RecyclingCenter />
        </div> */}

        {/* <div className='absolute bottom-[25%] right-[30%] z-10'>
          <Vehicle />
        </div> */}
      </div>
    </div>
  );
};

export default Town;
