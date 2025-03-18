import CharacterCards from './CharacterCards';
import useCharStore from '@/store/useCharStore';
import CharacterCardsList from '../../componet/select/CharacterCardsList';
import CharacterDetail from './CharacterDetail';
import { useCharInfo } from '../hooks/useCharInfo';
import { useEffect } from 'react';

const PickChar = () => {
  const { myChar } = useCharStore(); //사용자가 선택한 나의 캐릭터 데이터들이 담긴 store
  const { data: infoData } = useCharInfo();

  // 중요: ID가 0인지, undefined인지, 존재하는지 정확하게 확인
  // 내부적으로 local에서 세팅한 id와 서버에서 fetching 받은 id 값의 여부를 확인
  const hasValidSelection =
    myChar?.name &&
    ((myChar.id !== undefined && myChar.id > 0) ||
      (myChar.userCharacterId !== undefined && myChar.userCharacterId > 0));

  if (!hasValidSelection) {
    //그렇다면, 선택을 하지 않은 것으로 간주되기 떄문에 전체 캐릭터 리스트 확인
    return <CharacterCardsList />;
  }

  // 사용할 유효한 ID 결정 (0보다 큰 값 사용)
  const effectiveId =
    myChar.userCharacterId && myChar.userCharacterId > 0
      ? myChar.userCharacterId
      : myChar.id;

  // 사용자가 캐릭터를 선택했을 때 나타나는 내용들
  return (
    <div className='flex flex-col m-8'>
      <h2 className='flex mb-6 flex-1 text-4xl text-center justify-center items-center'>
        {myChar.description.slice(0, -2)} "{myChar.name}"
      </h2>
      <div className='flex justify-center items-center gap-9'>
        <CharacterCards {...myChar} />
        {/* detail에 id값이 정확하게 전달되는 것이 중요함 : 추후 서버에 id값을 보내야하기 때문에*/}
        <CharacterDetail
          id={effectiveId}
          name={myChar.name}
          subStory={
            myChar.subStory
              ? myChar.subStory
              : '안녕, 우린 에코니멀의 친구들이야'
          }
          detailStory={
            myChar.detailStory
              ? myChar.detailStory
              : '자세한 이야기는 추 후 업데이트 될 예정이야'
          }
        />
      </div>
    </div>
  );
};

export default PickChar;
