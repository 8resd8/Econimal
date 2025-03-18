import { useEffect, useState } from 'react';
import { useCharList } from './useCharList';
import { CharacterTypes } from '../../types/CharacterTypes';
import { characterConfig } from '@/config/characterConfig';
import { useCharInfo } from './useCharInfo';

/**
 * 캐릭터 목록 데이터를 처리하는 커스텀 훅
 * 서버에서 받은 캐릭터 목록과 정적 리소스를 병합합니다.
 */
export const useProcessedCharList = () => {
  const { data: listData, isLoading: listLoading } = useCharList();
  const [processedData, setProcessedData] = useState<CharacterTypes<number>[]>(
    [],
  );

  useEffect(() => {
    if (listData?.characters) {
      // 서버 데이터 로깅 (디버깅용)
      console.log('서버에서 받은 캐릭터 목록:', listData.characters);

      // 데이터 가공 시작
      const processed = listData.characters
        .map((serverItem) => {
          const { userCharacterId, characterName, summary } = serverItem;

          // ID 값 확인
          if (!userCharacterId) {
            console.warn(
              `${characterName}의 ID가 유효하지 않습니다:`,
              userCharacterId,
            );
            return null;
          }

          // config에서 정적 리소스 찾기
          const configItem = characterConfig.find(
            (config) => config.name === characterName,
          );

          if (!configItem) {
            console.warn(
              `${characterName}에 대한 config 데이터를 찾을 수 없습니다`,
            );
            return null;
          }

          // 캐릭터 데이터 병합
          const processedItem: CharacterTypes<number> = {
            id: userCharacterId,
            userCharacterId: userCharacterId,
            name: characterName,
            description: summary,
            img: configItem.img,
            backImg: configItem.backImg,
            profileImg: configItem.profileImg,
            footImg: configItem.footImg,
            subStory: configItem.subStory,
            detailStory: configItem.detailStory,
          };

          console.log(`처리된 캐릭터:`, {
            name: processedItem.name,
            id: processedItem.id,
            userCharacterId: processedItem.userCharacterId,
          });

          return processedItem;
        })
        .filter(Boolean) as CharacterTypes<number>[];

      setProcessedData(processed);
    }
  }, [listData]);

  return {
    processedData,
    isLoading: listLoading,
  };
};
