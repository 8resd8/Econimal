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
      <img
        src={town}
        alt='마을'
        className='w-full h-full object-cover absolute inset-0'
      />

      {/* 환영 메시지와 컴포넌트들을 위한 오버레이 컨테이너 */}
      <div className='absolute inset-0 z-10'>
        {/* 환영 메시지 */}
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2 '>
          🏙️ 마을에 온 걸 환영해
        </div>

        {/* 각 건물/시설 컴포넌트들의 위치 지정 */}
        <div className='absolute top-1/4 left-1/4'>
          <MyHouse />
        </div>

        <div className='absolute top-1/3 right-1/4'>
          <RecyclingCenter />
        </div>

        <div className='absolute bottom-1/4 left-1/3'>
          <SewageTreatmentCenter />
        </div>

        <div className='absolute bottom-1/3 right-1/3'>
          <Vehicle />
        </div>

        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <Court />
        </div>
      </div>
    </div>
  );
};

export default Town;

// const Town = () => {
//   return (
//     <div className='w-full h-full flex flex-col items-center justify-center'>
//       {/* <img src={town} alt='마을' className='w-full h-full object-cover' /> */}
//       <img src={town} alt='마을' className='w-full object-cover flex-grow' />
//       <div className='z-40'>
//         <div>🏙️ 마을에 온 걸 환영해</div>
//         <MyHouse />
//         <RecyclingCenter />
//         <SewageTreatmentCenter />
//         <Vehicle />
//         <Court />
//       </div>
//     </div>
//   );
// };
// export default Town;
