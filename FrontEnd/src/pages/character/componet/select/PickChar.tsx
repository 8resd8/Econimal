import { characterConfig } from '@/config/characterConfig';
import CharacterCards from '../../feature/select/CharacterCards';
import useCharStore from '@/store/useCharStore';
import CharacterCardsList from './CharacterCardsList';
import CharacterDetail from '../../feature/select/CharacterDetail';

const PickChar = () => {
  // store값의 유무에 따라서 return 값이 달라지는 것
  const { myChar, setMyChar } = useCharStore();

  if (!myChar.name) {
    return <CharacterCardsList />;
  }

  return (
    <div className='flex flex-col m-8'>
      <h2 className='flex mb-6 flex-1 text-4xl text-center justify-center items-center'>
        {myChar.description.slice(0, -2)} "{myChar.name}"
      </h2>
      <div className='flex justify-center items-center gap-9'>
        <CharacterCards {...myChar} />
        <CharacterDetail
          name={myChar.name}
          subStory={myChar.subStory}
          detailStory={myChar.detailStory}
        />
      </div>
    </div>
  );
};

export default PickChar;
