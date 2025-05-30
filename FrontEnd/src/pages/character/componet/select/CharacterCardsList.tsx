import CharacterCards from '../../feature/select/CharacterCards';
import { characterConfig } from '@/config/characterConfig';
import { useProcessedCharList } from '../../feature/hooks/reuse/useProcessedCharList';

const CharacterCardsList = () => {
  // 캐릭터 list 전달(가공 받은 데이터, 정적 + server)
  const { processedData, isLoading } = useProcessedCharList(); //가공한 데이터 -> 서버에서 fetching 받아온 데이터들 기반으로

  // 로딩중의 경우 로딩중임을 명시한다.
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>로딩 중...</div>
    );
  }

  // processedData를 우선적으로 사용하고, 값이 없을 경우 자체적으로 client에서 만든 characterConfig 데이터 활용
  // client 측에서 img와 일치화를 위해서 만들어 놓은 임의 데이터를 활용(기본, 기초 값)
  const dataToRender =
    processedData && processedData.length > 0 ? processedData : characterConfig;

  // processData나 characterConfig 자체가 값이 0라면? -> 캐릭터 정보 자체를 불러올 수 없음
  // (단, characterConfig가 0이 아니기 때문에 이러한 조건을 성립할 수가 없음)
  if (dataToRender.length === 0) {
    return (
      <div className='flex justify-center items-center h-64'>
        캐릭터 정보를 불러올 수 없습니다.
      </div>
    );
  }

  // 따라서 가공된 데이터의 processedData의 값을 하위에 mapping으로 뿌려줌
  // 서버에서 받은값을 우선적으로 진행하고 있음
  return (
    <div className='flex flex-col items-center min-h-screen px-4 py-8 overflow-auto'>
      {/* 제목 */}
      <h2 className='text-2xl sm:text-3xl font-bold text-center text-white mb-6 leading-snug'>
        🌎 환경 위기에서 구해줄 친구를 골라주세요!
      </h2>

      {/* 카드 리스트 */}
      <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-1 sm:gap-3 w-full max-w-4xl '>
        {dataToRender.map((item) => (
          <div
            key={item.userCharacterId || item.id || item.name}
            className='flex justify-center items-center'
          >
            <CharacterCards {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterCardsList;
