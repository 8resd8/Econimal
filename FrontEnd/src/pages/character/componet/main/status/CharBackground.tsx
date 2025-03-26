import useCharStore from '@/store/useCharStore';
import CharProfile from './CharProfile';
import ExpBar from '@/components/ExpBar';
import CharCoin from './CharCoin';
import TownIcon from '../moveicon/TownIcon';
import EarthIcon from '../moveicon/EarthIcon';
import ShopIcon from '../moveicon/ShopIcon';
import CharMenu from '../../../feature/status/CharMenu';
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

//useEffect 조건부 이전 위치 -> 조건부 랜더링은 훅 호출 이후 진행
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

  //charsel을 하지 않았다고 판단되면 옮겨준다.
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
    //초기값이 0이기 때문에 체크에서 제외해야하기 때문에 undefined로 판단한다.
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
        {/* 상단바 */}
        <div className='flex items-center justify-between p-6'>
          {/* 왼쪽: 캐릭터 프로필 + 경험치 바 */}
          <div className='flex items-center gap-4'>
            <CharProfile level={level} profileImg={myChar.profileImg} />
            <ExpBar current={exp} max={100} />
          </div>

          {/* 오른쪽: 금 정보 + 햄버거 메뉴 */}
          <div className='flex items-center gap-4'>
            <CharCoin coin={coin} />
            <CharMenu />
          </div>
        </div>
      </div>

      {/* 아이콘들 */}
      <div className='absolute left-12 sm:left-16 md:left-24 top-[60%] -translate-y-1/2 flex flex-col gap-8 z-[100]'>
        {/* mouseEventHandler 기준 준수를 위해 e 사용 */}
        <TownIcon onClick={(e) => nav('/town')} />
        <EarthIcon onClick={(e) => nav('/earth')} />
        <ShopIcon onClick={(e) => nav('/shop')} />
      </div>
      {/* 캐릭터 */}
      <div className='absolute bottom-0 left-0 w-full'>
        <div className='relative bottom-24 left-[40%] -translate-x-1/2 w-64 md:w-80'>
          {/* 발판 이미지 === 추후 LevelChange로 활용될 내용*/}
          <img
            src={myChar.footImg}
            alt='발판'
            className='absolute bottom-[-50px] left-[50%] -translate-x-1/2 w-[90%] z-[1]'
          />
          {/* 캐릭터 이미지 */}
          <CharEmotionChange faceImg={faceImg} />
        </div>
      </div>
    </div>
  );
};

export default CharBackground;
