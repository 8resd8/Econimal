import PickChar from './features/PickChar';
import bgThem from '../../assets/auth_background.png';

const CharacterSelect = () => {
  //캐릭터 선택란
  return (
    // h-screen은 무엇?
    <div>
      {/* <img src={bgThem} className='object-cover w-full h-full' alt='bgThem' /> */}
      <PickChar />
    </div>
  );
};

export default CharacterSelect;
