import CharacterCards from './CharacterCards';
import useCharStore from '@/store/useCharStore';
import CharacterCardsList from '../../componet/select/CharacterCardsList';
import CharacterDetail from './CharacterDetail';
import { useEffectiveId } from '../hooks/reuse/useEffectiveId';

const PickChar = () => {
  //맨처음에는 myChar에 대한 정보가 없을 것
  const { myChar } = useCharStore(); //사용자가 선택한 나의 캐릭터 데이터들이 담긴 store
  const { effectiveId, hasValidSelection } = useEffectiveId(myChar);

  if (!hasValidSelection) {
    //그렇다면, 선택을 하지 않은 것으로 간주되기 떄문에 전체 캐릭터 리스트 확인 가능(캐릭 선택)
    return <CharacterCardsList />;
  }

  // 사용자가 캐릭터를 선택했을 때 나타나는 내용들
  const description = myChar?.description || '';

  return (
    <div className='flex flex-col m-8'>
      <h2 className='flex mb-6 flex-1 text-4xl text-center justify-center items-center text-white'>
        {/* {myChar.description.slice(0, -2)} "{myChar.name}" */}
        {description.slice(0, -2)} "{myChar?.name}"
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
