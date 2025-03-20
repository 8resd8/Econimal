import useCharStore from '@/store/useCharStore';
import CharProfile from './CharProfile';
import ExpBar from '@/components/ExpBar';
import CharCoin from './CharCoin';
import TownIcon from '../moveicon/TownIcon';
import EarthIcon from '../moveicon/EarthIcon';
import ShopIcon from '../moveicon/ShopIcon';
import CharMenu from '../../../feature/status/CharMenu';
import { useMyCharInfo } from '@/pages/character/feature/hooks/useMyCharInfo';
import { useEffect, useState } from 'react';
import { myCharInfoConfig } from '@/config/myCharInfoConfig';

const CharBackground = () => {
  const { myChar } = useCharStore();
  const { data, isLoading, isError } = useMyCharInfo();
  const [faceImg, setFaceImg] = useState('');

  // 2. useEffect는 조건문 이전에 위치
  useEffect(() => {
    console.log(data);
    if (data) console.log(data.level);
  }, [data]);

  //일단 현재 캐릭터의 감정 확인하기
  useEffect(() => {
    //감정 fetching에 따라서 이미지 상태가 계속 바뀌는 것
    if (data && data.expression) {
      //expression 값에 따른 변경
      const serverExpression = data.expression;
      const charInfo = myCharInfoConfig.find(
        (item) => item.name === myChar.name,
      );
      // console.log(charInfo);
      const charExpression = charInfo?.expression.find(
        (item) => item.face === serverExpression,
      );
      console.log(charExpression);
      setFaceImg(charExpression?.faceImg);

      // myCharInfoConfig.forEach((char) => {
      //   charExpression = char.expression.find(
      //     (item) => item.face === serverExpression && ,
      //   );
      // });
      // setFaceImg(charExpression);
      // console.log(charExpression, 'charExpression');
    }
  }, [data]);

  // 3. 조건부 렌더링은 Hook 호출 이후에
  if (isLoading) return <div>...로딩중</div>;
  if (isError) return <div>데이터 불러오기 실패</div>;
  if (!data || !data.level) return <div>필수 데이터 없음</div>;

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
            <CharProfile level={data.level} />
            <ExpBar current={data.exp} max={100} />
          </div>

          {/* 오른쪽: 금 정보 + 햄버거 메뉴 */}
          <div className='flex items-center gap-4'>
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
            // src={myChar.img}
            src={faceImg}
            alt='캐릭터'
            className='absolute bottom-[30px] left-[50%] -translate-x-1/2 w-full h-auto z-[2]'
          />
        </div>
      </div>
    </div>
  );
};

export default CharBackground;
