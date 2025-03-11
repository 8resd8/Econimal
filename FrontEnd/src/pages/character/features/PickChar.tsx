import { characterConfig } from '@/config/characterConfig';
import { characterTypes } from './../../../types/characterTypes';
import { useState } from 'react';

const PickChar = () => {
  const [selectChar, setSelectChar] = useState<characterTypes<string>>();

  return (
    <div>
      <div>CharacterSelect</div>
      <div>
        {characterConfig.map((item) => (
          <div key={item.name}>
            {item.name} - {item.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PickChar;
