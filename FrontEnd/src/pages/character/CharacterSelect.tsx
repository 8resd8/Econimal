import PickChar from './feature/select/PickChar';
import bgThem from '../../assets/auth_background.png';
import useCharStore from '@/store/useCharStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const CharacterSelect = () => {
  //myChar이 있으면 뒤로 못가게
  const nav = useNavigate();
  const { myChar } = useCharStore(); //myChar, store에 캐릭터를 선택한 정보가 있는지 확인

  // 모바일 환경에서 필요는 없으나 뒤로가기 방지
  useEffect(() => {
    // 캐릭터 데이터 존재 여부 체크
    if (myChar?.characterId && myChar?.name) {
      nav('/', { replace: true }); // 뒤로가기 방지 옵션
    }
  }, [myChar, nav]);

  // 팽글링스, 호랭이, 부기부기 캐릭터 선택 초기 페이지
  return (
    // 배경 이미지를 동적으로 조정하는 경우 Tailwind만으로 할 수 없기 때문에
    <div
      className='w-screen h-screen flex items-center justify-center bg-white relative'
      style={{
        backgroundImage: `url(${bgThem})`,
        backgroundSize: 'cover', // 이미지를 화면에 맞게 조정
        backgroundPosition: 'center', // 이미지를 가운데 정렬
        backgroundRepeat: 'no-repeat', // 이미지 반복 방지
      }}
    >
      {/* 배경위에 랜더링 되게 하기 위해서 setting */}
      <PickChar />
    </div>
  );
};

export default CharacterSelect;
