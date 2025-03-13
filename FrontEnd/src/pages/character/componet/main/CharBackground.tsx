import useCharStore from '@/store/useCharStore';
import CharProfile from './CharProfile';
import ExpBar from '@/components/ExpBar';
import CharCoin from './CharCoin';
import TownIcon from './TownIcon';
import EarthIcon from './EarthIcon';
import ShopIcon from './ShopIcon';
import CharMenu from './CharMenu';

const CharBackground = () => {
  const { myChar } = useCharStore();

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-white'>
      {/* 배경 이미지 */}
      <img
        src={myChar.backImg}
        alt='캐릭터_배경'
        className='absolute inset-0 w-full h-full object-cover z-0'
      />

      {/* 내부 인터페이스 */}
      <div className='relative z-10 w-full h-full'>
        {/* 상단바 */}
        <div className='flex items-center justify-between p-6'>
          {/* 왼쪽: 캐릭터 프로필 + 경험치 바 */}
          <div className='flex items-center gap-4'>
            <CharProfile />
            <ExpBar current={85} max={100} />
          </div>

          {/* 오른쪽: 금 정보 + 햄버거 메뉴 */}
          <div className='flex items-center gap-4'>
            <CharCoin />
            <CharMenu />
          </div>
        </div>
      </div>

      {/* 아이콘들 */}
      <div className='absolute left-12 sm:left-16 md:left-24 top-[60%] -translate-y-1/2 flex flex-col gap-8'>
        <TownIcon />
        <EarthIcon />
        <ShopIcon />
      </div>

      {/* 캐릭터 */}
      <div className='absolute bottom-0 left-0 w-full'>
        <div className='absolute bottom-24 left-[40%] -translate-x-1/2 w-64 h-64 md:w-80 md:h-80'>
          <img src={myChar.img} alt='캐릭터' className='absolute' />
        </div>
      </div>
    </div>
  );
};

export default CharBackground;
