import useCharStore from '@/store/useCharStore';
import CharProfile from './CharProfile';
import ExpBar from '@/components/ExpBar';
import CharCoin from './CharCoin';
import TownIcon from './TownIcon';
import EarthIcon from './EarthIcon';
import ShopIcon from './ShopIcon';

const CharBackground = () => {
  const { myChar, setMyChar } = useCharStore();
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-white'>
      <img
        src={myChar.backImg}
        alt='캐릭터_배경'
        className='w-full h-full object-cover'
      />
      {/* 내부 인터페이스 */}
      <div className='relative z-10 w-full h-full'>
        {/* 상단바 */}
        <div className='flex items-center justify-between p-6'>
          <CharProfile />
          <div className='ml-3'>
            <ExpBar current={15} max={100} />
          </div>
          <CharCoin />
        </div>
      </div>
      <div className='absolute left-12 sm:left-16 md:left-24 top-1/2 -translate-y-1/2 flex flex-col gap-8'>
        <TownIcon />
        <EarthIcon />
        <ShopIcon />
      </div>
    </div>
  );
};
export default CharBackground;
