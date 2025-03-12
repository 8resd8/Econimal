import { characterConfig } from '@/config/characterConfig';
import CharacterCards from '../component/CharacterCards';
import useCharStore from '@/store/useCharStore';
import CharacterCardsList from '../component/CharacterCardsList';
import CharacterDetail from '../component/CharacterDetail';

const PickChar = () => {
  // store값의 유무에 따라서 return 값이 달라지는 것
  const { myChar, setMyChar } = useCharStore();

  if (!myChar.name) {
    return <CharacterCardsList />;
  }

  return (
    <div>
      <h2>
        {myChar.description.slice(0, -2)}-{myChar.name}
      </h2>
      <div className='flex flex-1 justify-center items-center gap-3'>
        <CharacterCards {...myChar} />
        <CharacterDetail
          subStory={myChar.subStory}
          detailStory={myChar.detailStory}
        />
      </div>
    </div>
  );
};

export default PickChar;
