import CharacterCards from './CharacterCards';
import useCharStore from '@/store/useCharStore';
import CharacterCardsList from '../../componet/select/CharacterCardsList';
import CharacterDetail from './CharacterDetail';
import { useCharInfo } from '../hooks/useCharInfo';
import { useEffect } from 'react';
const PickChar = () => {
  const { myChar } = useCharStore();
  const { data: infoData } = useCharInfo();

  // 디버깅용 로그
  useEffect(() => {
    if (myChar.id) {
      console.log('선택된 캐릭터:', myChar);
    }
  }, [myChar]);

  useEffect(() => {
    if (infoData) {
      console.log('상세 정보 데이터:', infoData);
    }
  }, [infoData]);

  if (!myChar.name || myChar.id === undefined) {
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
          id={myChar.id}
          name={myChar.name}
          subStory={myChar.subStory ? myChar.subStory : ''}
          detailStory={myChar.detailStory ? myChar.detailStory : ''}
        />
      </div>
    </div>
  );
};

export default PickChar;
