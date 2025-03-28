import PickChar from './feature/select/PickChar';
import bgThem from '../../assets/auth_background.png';
import useCharStore from '@/store/useCharStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const CharacterSelect = () => {
  //myChar이 있으면 뒤로 못가게
  const nav = useNavigate();
  const { myChar } = useCharStore();

  useEffect(() => {
    // 캐릭터 데이터 존재 여부 체크
    if (myChar?.characterId && myChar?.name) {
      nav('/', { replace: true }); // 뒤로가기 방지 옵션
    }
  }, [myChar, nav]);
  

  //캐릭터 선택란
  return (
    <div
      className='w-screen h-screen flex items-center justify-center bg-white relative'
      style={{
        backgroundImage: `url(${bgThem})`,
        backgroundSize: 'cover', // 이미지를 화면에 맞게 조정
        backgroundPosition: 'center', // 이미지를 가운데 정렬
        backgroundRepeat: 'no-repeat', // 이미지 반복 방지
      }}
    >
      {' '}
      <PickChar />
    </div>
  );
};

export default CharacterSelect;
