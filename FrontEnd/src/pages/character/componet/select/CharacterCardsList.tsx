import CharacterCards from '../../feature/select/CharacterCards';
import { characterConfig } from '@/config/characterConfig';
import { useProcessedCharList } from '../../feature/hooks/useProcessedCharList';

const CharacterCardsList = () => {
  const { processedData, isLoading } = useProcessedCharList(); //가공한 데이터 -> 서버에서 fetching 받아온 데이터들 기반으로

  //로딩중의 경우 로딩중임을 명시한다.
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>로딩 중...</div>
    );
  }

  // processedData를 우선적으로 사용하고, 값이 없을 경우 자체적으로 client에서 만든 characterConfig 데이터 활용
  // client 측에서 img와 일치화를 위해서 만들어 놓은 임의 데이터를 활용(기본, 기초 값)
  const dataToRender =
    processedData && processedData.length > 0 ? processedData : characterConfig;

  //processData나 characterConfig 자체가 값이 0라면? -> 캐릭터 정보 자체를 불러올 수 없음
  // (단, characterConfig가 0이 아니기 때문에 이러한 조건을 성립할 수가 없음)
  if (dataToRender.length === 0) {
    return (
      <div className='flex justify-center items-center h-64'>
        캐릭터 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className='flex-col justify-center items-center'>
      <h2 className='flex mb-6 flex-1 text-4xl text-center justify-center items-center'>
        환경 위기에서 구해줄 친구를 골라주세요!
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {dataToRender.map((item) => (
          <div
            key={item.id || item.userCharacterId || item.name}
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
