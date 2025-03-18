import useCharStore from '@/store/useCharStore';
import CharProfile from './CharProfile';
import ExpBar from '@/components/ExpBar';
import CharCoin from './CharCoin';
import TownIcon from '../moveicon/TownIcon';
import EarthIcon from '../moveicon/EarthIcon';
import ShopIcon from '../moveicon/ShopIcon';
import CharMenu from '../../../feature/status/CharMenu';
import { useMyCharInfo } from '@/pages/character/feature/hooks/useMyCharInfo';

const CharBackground = () => {
  const { myChar } = useCharStore();
  const { data, isLoading } = useMyCharInfo(); //여기서 level, exp, coin, express

  if (isLoading) {
    return <div>...로딩중</div>;
  }

  //data 로딩되는게 위에서 확인되면 -> 이제 밑에서 하나씩 생길 것

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
            {/* profile은 myChar에 있는 profile이미지를 가져오게 되고,  
            data의 level과  */}
            {/* <CharProfile /> */}
            <CharProfile level={data.level} />
            {/* ExpBar은 data의 경험치 */}
            {/* <ExpBar current={85} max={100} /> */}
            <ExpBar current={data.exp} max={100} />
          </div>

          {/* 오른쪽: 금 정보 + 햄버거 메뉴 */}
          <div className='flex items-center gap-4'>
            {/* data의 coin의 정보 */}
            {/* <CharCoin /> */}
            <CharCoin coin={data.coin} />
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
        <div className='relative bottom-24 left-[40%] -translate-x-1/2 w-64 md:w-80'>
          {/* 발판 이미지 */}
          <img
            src={myChar.footImg}
            alt='발판'
            className='absolute bottom-[-50px] left-[50%] -translate-x-1/2 w-[90%] z-[1]'
          />
          {/* 캐릭터 이미지 */}
          <img
            src={myChar.img}
            alt='캐릭터'
            className='absolute bottom-[30px] left-[50%] -translate-x-1/2 w-full h-auto z-[2]'
          />
        </div>
      </div>
    </div>
  );
};

export default CharBackground;
