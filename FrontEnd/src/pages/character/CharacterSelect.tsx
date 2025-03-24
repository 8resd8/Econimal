import PickChar from './feature/select/PickChar';
import bgThem from '../../assets/auth_background.png';

const CharacterSelect = () => {
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
