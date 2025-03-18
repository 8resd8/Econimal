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
    if (myChar && (myChar.id || myChar.userCharacterId)) {
      console.log('선택된 캐릭터:', myChar);
      console.log('캐릭터 ID 확인:', {
        id: myChar.id,
        userCharacterId: myChar.userCharacterId,
        name: myChar.name,
      });
    }
  }, [myChar]);

  useEffect(() => {
    if (infoData) {
      console.log('상세 정보 데이터:', infoData);
    }
  }, [infoData]);

  // 중요: ID가 0인지, undefined인지, 존재하는지 정확하게 확인
  const hasValidSelection =
    myChar?.name &&
    ((myChar.id !== undefined && myChar.id > 0) ||
      (myChar.userCharacterId !== undefined && myChar.userCharacterId > 0));

  if (!hasValidSelection) {
    return <CharacterCardsList />;
  }

  // 사용할 유효한 ID 결정 (0보다 큰 값 사용)
  const effectiveId =
    myChar.userCharacterId && myChar.userCharacterId > 0
      ? myChar.userCharacterId
      : myChar.id;

  return (
    <div className='flex flex-col m-8'>
      <h2 className='flex mb-6 flex-1 text-4xl text-center justify-center items-center'>
        {myChar.description.slice(0, -2)} "{myChar.name}"
      </h2>
      <div className='flex justify-center items-center gap-9'>
        <CharacterCards {...myChar} />
        <CharacterDetail
          id={effectiveId}
          name={myChar.name}
          subStory={myChar.subStory ? myChar.subStory : ''}
          detailStory={myChar.detailStory ? myChar.detailStory : ''}
        />
      </div>
    </div>
  );
};

export default PickChar;
