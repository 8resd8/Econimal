import MyHouse from './components/MyHouse';
import RecyclingCenter from './components/RecyclingCenter';
import SewageTreatmentCenter from './components/SewageTreatmentCenter';
import Vehicle from './components/Vehicle';
import Court from './components/Court';
import town from '@/assets/town.png';

const Town = () => {
  return (
    // <div className='w-full h-full relative'>
    <div className='w-full h-screen'>
      {/* 배경 이미지 */}
      <img src={town} alt='마을' className='w-full h-full object-cover' />

      {/* 환영 메시지와 컴포넌트들을 위한 오버레이 컨테이너 */}
      <div className='inset-0 z-10'>
        {/* 환영 메시지 */}
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2 bg-white'>
          🏙️ 마을에 온 걸 환영해
        </div>

        {/* 각 건물/시설 컴포넌트들 - 이미지의 특정 위치에 고정 */}
        <div className='absolute top-[5%] left-[20%] z-10'>
          <MyHouse />
        </div>

        <div className='absolute top-[20%] right-[5%] z-10'>
          <RecyclingCenter />
        </div>

        <div className='absolute bottom-[30%] left-[30%] z-10'>
          <SewageTreatmentCenter />
        </div>

        <div className='absolute bottom-[25%] right-[30%] z-10'>
          <Vehicle />
        </div>

        <div className='absolute top-[75%] left-[30%] transform z-10'>
          <Court />
        </div>
      </div>
    </div>
  );
};

export default Town;
