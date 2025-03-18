import { characterConfig } from '@/config/characterConfig';
//이제 가공된 데이터를 뿌려줘야함

import CharacterCards from '../../feature/select/CharacterCards';
import { useProcessedCharList } from '../../feature/hooks/useProcessedCharList';
import { useEffect } from 'react';

const CharacterCardsList = () => {
  const { processedData, isLoading } = useProcessedCharList();

  // 디버깅을 위한 로그 추가
  useEffect(() => {
    console.log('캐릭터 설정 확인:', characterConfig);

    // 각 캐릭터마다 ID 값이 올바르게 설정되어 있는지 확인
    characterConfig.forEach((char, index) => {
      const hasValidId = char.id && char.id > 0;
      const hasValidUserId = char.userCharacterId && char.userCharacterId > 0;

      console.log(`캐릭터 ${index + 1} - ${char.name}:`, {
        id: char.id,
        userCharacterId: char.userCharacterId,
        hasValidId,
        hasValidUserId,
      });

      // 경고: ID가 없거나 0인 경우
      if (!hasValidId && !hasValidUserId) {
        console.warn(`경고: ${char.name} 캐릭터에 유효한 ID가 없습니다!`);
      }
    });
  }, []);

  useEffect(() => {
    if (processedData && processedData.length > 0) {
      console.log('서버에서 가져온 캐릭터 데이터:', processedData);

      // 서버 데이터의 ID 유효성 검사
      processedData.forEach((char) => {
        console.log(
          `서버 데이터 - ${char.name}: id=${char.id}, userCharacterId=${char.userCharacterId}`,
        );
      });
    }
  }, [processedData]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>로딩 중...</div>
    );
  }

  // 중요: characterConfig 대신 processedData 사용
  // 하지만 processedData가 비어있을 경우 characterConfig로 폴백
  const dataToRender =
    processedData && processedData.length > 0 ? processedData : characterConfig;

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
