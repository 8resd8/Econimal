import CharacterCards from './CharacterCards';
import useCharStore from '@/store/useCharStore';
import CharacterCardsList from '../../componet/select/CharacterCardsList';
import CharacterDetail from './CharacterDetail';

const PickChar = () => {
  const { myChar } = useCharStore();
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
          subStory={myChar.subStory ? myChar.subStory : ''}
          detailStory={myChar.detailStory ? myChar.detailStory : ''}
        />
      </div>
    </div>
  );
};

export default PickChar;
