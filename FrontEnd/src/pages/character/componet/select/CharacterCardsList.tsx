import { characterConfig } from '@/config/characterConfig';
//이제 가공된 데이터를 뿌려줘야함

import CharacterCards from '../../feature/select/CharacterCards';
// import { useProcessedCharList } from '../../feature/hooks/useProcessedCharList';

const CharacterCardsList = () => {
  // const { processedData, isLoading } = useProcessedCharList();
  // if (isLoading) {
  //   return <div>로딩 중...</div>;
  // }

  return (
    <div className='flex-col justify-center items-center'>
      <h2 className='flex mb-6 flex-1 text-4xl text-center justify-center items-center'>
        환경 위기에서 구해줄 친구를 골라주세요!
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* {processedData.map((item) => ( */}
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
