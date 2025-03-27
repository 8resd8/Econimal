import useCharStore from '@/store/useCharStore';
import CharProfile from './CharProfile';
import ExpBar from '@/components/ExpBar';
import CharCoin from './CharCoin';
import TownIcon from '../moveicon/TownIcon';
import EarthIcon from '../moveicon/EarthIcon';
import ShopIcon from '../moveicon/ShopIcon';
import CharMenu from '../../../feature/status/CharMenu'; // 햄버거 메뉴 추가
import { useMyCharInfo } from '@/pages/character/feature/hooks/useMyCharInfo';
import { useEmotionChange } from '@/pages/character/feature/hooks/reuse/useEmotionChange';
import CharEmotionChange from './CharEmotionChange';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  useCharacterCoin,
  useCharacterExp,
  useCharacterExpression,
  useCharacterLevel,
} from '@/store/useCharStatusStore';

const CharBackground = () => {
  const { myChar } = useCharStore();
  const { isLoading, isError } = useMyCharInfo();
  const level = useCharacterLevel();
  const exp = useCharacterExp();
  const coin = useCharacterCoin();
  const expression = useCharacterExpression();
  const { faceImg, isLoading: isEmotionLoading } = useEmotionChange({
    data: { level, exp, coin, expression },
    myChar: myChar,
  });
  const nav = useNavigate();

  useEffect(() => {
    console.log('실시간 상태 변화 확인', level, exp, coin, expression);
  }, [level, exp, coin, expression]);

  useEffect(() => {
    if (!myChar || Object.keys(myChar).length === 0) {
      nav('/charsel');
    } else {
      console.log('myChar exists:', myChar);
    }
  }, [myChar, nav]);

  if (isLoading || isEmotionLoading) return <div>...로딩중</div>;
  if (isError) return <div>데이터 불러오기 실패</div>;
  if (
    level === undefined ||
    exp === undefined ||
    coin === undefined ||
    !expression ||
    !myChar
  ) {
    return <div>필수 데이터 없음</div>;
  }

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
        {/* 🟢 상단바 (높이 정렬 조정) */}
        <div className='flex items-center justify-between px-6 py-2 w-full fixed top-0 left-0 bg-white/80 backdrop-blur-md z-50'>
          {/* 🔵 왼쪽: 캐릭터 프로필 + 경험치 바 */}
          <div className='flex items-center gap-3'>
            <CharProfile level={level} profileImg={myChar.profileImg} />
            <ExpBar current={exp} max={100} />
          </div>

          {/* 🔴 오른쪽: 코인 정보 + 햄버거 메뉴 (정렬 조정) */}
          <div className='flex items-center gap-3'>
            <CharCoin coin={coin} />
            <CharMenu />
          </div>
        </div>

        {/* 🟠 왼쪽 이동 버튼 (위치 수정) */}
        <div className='absolute left-6 md:left-16 top-[60%] -translate-y-1/2 flex flex-col gap-3 z-[100] scale-75'>
          <TownIcon onClick={() => nav('/town')} />
          <EarthIcon onClick={() => nav('/earth')} />
          <ShopIcon onClick={() => nav('/shop')} />
        </div>

        {/* 🟡 캐릭터 & 발판 */}
        <div className='absolute bottom-10 left-1/2 -translate-x-1/2 w-40 md:w-52 scale-75'>
          <div className='relative flex flex-col items-center'>
            {/* 캐릭터 이미지 */}
            <CharEmotionChange faceImg={faceImg} className='z-10' />

            {/* 발판 이미지 */}
            <img
              src={myChar.footImg}
              alt='발판'
              className='relative bottom-[-5px] w-full z-0'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharBackground;
