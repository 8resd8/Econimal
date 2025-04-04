// CharBackground.tsx - 배경 표시 부분만 수정
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
import { useEffect, useState } from 'react';
import {
  useCharacterCoin,
  useCharacterExp,
  useCharacterExpression,
  useCharacterLevel,
} from '@/store/useCharStatusStore';
import { useFootChange } from '@/pages/character/feature/hooks/reuse/useFootChange';
import { useProcessedCharList } from '@/pages/character/feature/hooks/reuse/useProcessedCharList';
import {
  useMyCharacterId,
  useMyCharName,
  useBackImg,
} from '@/store/useMyCharStore';

const CharBackground = () => {
  // const { myChar } = useCharStore();
  const { isLoading, isError } = useMyCharInfo();
  const level = useCharacterLevel();
  const exp = useCharacterExp();
  const coin = useCharacterCoin();
  const expression = useCharacterExpression();
  const myCharacterId = useMyCharacterId();
  const name = useMyCharName();
  const customBackImg = useBackImg(); // 직접 저장된 배경 이미지

  const { processedData } = useProcessedCharList();
  const [myCharacterInfo, setMyCharacterInfo] = useState();

  const { footImg, isFootLoading } = useFootChange({
    data: { level, exp, coin, expression },
    myChar: myCharacterInfo?.name,
  });
  const { faceImg, isLoading: isEmotionLoading } = useEmotionChange({
    data: { level, exp, coin, expression },
    myChar: myCharacterInfo?.name,
  });

  const nav = useNavigate();

  useEffect(() => {
    if (processedData) {
      const myCharInfo = processedData.find(
        (item) => item.userCharacterId === myCharacterId,
      );
      if (myCharInfo) {
        setMyCharacterInfo(myCharInfo);
      } else if (myCharacterId && processedData.length > 0) {
        // 캐릭터 ID는 있지만 processedData에서 찾을 수 없는 경우
        console.warn('캐릭터 정보를 찾을 수 없습니다:', myCharacterId);
      }
    }
  }, [processedData, myCharacterId]);

  // 캐릭터 선택 확인 - 약간 지연시키기
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!myCharacterId && processedData && processedData.length > 0) {
        nav('/charsel');
      }
    }, 500); // 0.5초 지연

    return () => clearTimeout(timer);
  }, [myCharacterId, nav, processedData]);

  // -------계속 여기로 보내지는문제

  if (isLoading || isEmotionLoading || isFootLoading)
    return <div>...로딩중</div>;

  if (isError) return <div>데이터 불러오기 실패</div>;

  if (
    level === undefined ||
    exp === undefined ||
    coin === undefined ||
    !expression ||
    // !myChar ||
    !myCharacterId ||
    !myCharacterInfo
  ) {
    return <div>필수 데이터 없음</div>;
  }

  // 배경 이미지 결정 (저장된 배경 이미지 우선, 없으면 캐릭터 기본 배경)
  const displayBackgroundImage = customBackImg || myCharacterInfo.backImg;

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-white'>
      {/* 배경 이미지 */}
      <img
        src={displayBackgroundImage}
        alt='캐릭터_배경'
        className='absolute inset-0 w-full h-full object-cover z-0'
      />

      {/* 내부 인터페이스 */}
      <div className='relative z-10 w-full h-full'>
        {/* 상단 UI (한 줄 정렬) */}
        <div className='flex items-center justify-between px-5 md:px-6 py-4 md:py-5 w-full fixed top-0 left-0 z-50'>
          {/* 왼쪽: 프로필 + 경험치바 */}
          <div className='relative flex items-center gap-2 md:gap-3 flex-shrink-0'>
            <CharProfile
              level={level}
              profileImg={myCharacterInfo.profileImg}
            />
            <div className='relative'>
              <ExpBar current={exp} max={100} className='absolute top-[5px]' />
            </div>
          </div>

          <div className='flex items-baseline gap-4 md:gap-5 flex-shrink-0'>
            <div className='flex items-baseline'>
              <CharCoin
                coin={coin}
                className='w-[120px] h-[30px] md:w-[140px] md:h-[32px] flex items-baseline justify-center'
              />
            </div>
            <CharMenu />
          </div>
        </div>

        {/* 왼쪽 이동 버튼 */}
        <div className='absolute left-5 md:left-12 top-[65%] -translate-y-1/2 flex flex-col gap-2 md:gap-3 z-[100] scale-[0.65] md:scale-[0.75]'>
          <TownIcon
            onClick={() => nav('/town')}
            className='w-[35px] h-[35px] md:w-[40px] md:h-[40px]'
          />
          <EarthIcon
            onClick={() => nav('/earth')}
            className='w-[35px] h-[35px] md:w-[40px] md:h-[40px]'
          />
          <ShopIcon
            onClick={() => nav('/shop')}
            className='w-[35px] h-[35px] md:w-[40px] md:h-[40px]'
          />
        </div>

        {/* 캐릭터 & 발판 */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 w-36 md:w-40 scale-90 md:scale-100'>
          <div className='relative flex flex-col items-center'>
            {/* 캐릭터 이미지 */}
            <CharEmotionChange faceImg={faceImg} className='z-10' />

            {/* 발판 이미지 */}
            <img
              src={footImg}
              alt='발판'
              className='relative bottom-[-4px] w-full z-0'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharBackground;
