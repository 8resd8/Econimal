import PickChar from './feature/select/PickChar';
import bgThem from '../../assets/auth_background.png';

const CharacterSelect = () => {
  //캐릭터 선택란
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-white'>
      <PickChar />
    </div>
  );
};

export default CharacterSelect;
