import { characterConfig } from '@/config/characterConfig';
import { CharacterTypes } from '../../../types/CharacterTypes';
import { useState } from 'react';
import CharacterCards from '../component/CharacterCards';

const PickChar = () => {
  const [selectChar, setSelectChar] = useState<CharacterTypes<string>>();

  return (
    <div>
      <h2 className='felx mb-6 flex-1 text-4xl'>
        환경 위기에서 구해줄 친구를 골라주세요!
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {characterConfig.map((item) => (
          <div
            key={item.name}
            className='flex-1 justify-center items-center gap-3'
          >
            <CharacterCards {...item} />
            {/* {item.name} - {item.description} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PickChar;
