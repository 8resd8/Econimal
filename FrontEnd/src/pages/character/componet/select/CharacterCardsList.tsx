import { characterConfig } from '@/config/characterConfig';
//이제 가공된 데이터를 뿌려줘야함

import CharacterCards from '../../feature/select/CharacterCards';
import { useProcessedCharList } from '../../feature/hooks/useProcessedCharList';
import { useEffect } from 'react';

const CharacterCardsList = () => {
  const { processedData, isLoading } = useProcessedCharList();
  
  // 디버깅을 위한 로그 추가
  useEffect(() => {
    if (processedData && processedData.length > 0) {
      console.log('가공된 데이터 확인:', processedData);
      processedData.forEach((char) => {
        console.log(
          `${char.name}: id=${char.id}, userCharacterId=${char.userCharacterId}`,
        );
      });
    }
  }, [processedData]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>로딩 중...</div>
    );
  }

  if (!processedData || processedData.length === 0) {
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
        {/* {processedData.map((item) => ( */}
        {characterConfig.map((item) => (
          <div
            key={item.id || item.name} // id가 없을 경우 name을 사용
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
