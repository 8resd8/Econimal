import { characterConfig } from '@/config/characterConfig';
import CharacterCards from '../../feature/select/CharacterCards';

const CharacterCardsList = () => {
  return (
    <div className='flex-col justify-center items-center'>
      <h2 className='flex mb-6 flex-1 text-4xl text-center justify-center items-center'>
        환경 위기에서 구해줄 친구를 골라주세요!
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {characterConfig.map((item) => (
          <div
            key={item.name}
            className='flex-1 justify-center items-center gap-3'
          >
            <CharacterCards {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterCardsList;
