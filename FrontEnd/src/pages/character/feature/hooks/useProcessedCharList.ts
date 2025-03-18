import { useEffect, useState } from 'react';
import { useCharList } from './useCharList';
import { CharacterTypes } from '../../types/CharacterTypes';
import { characterConfig } from '@/config/characterConfig';
import { useCharInfo } from './useCharInfo';

export const useProcessedCharList = () => {
  const { data: listData, isLoading: listLoading } = useCharList();
  const { data: infoData, isLoading: infoLoading } = useCharInfo();
  const [processedData, setProcessedData] = useState<CharacterTypes<number>[]>(
    [],
  );

  // 서버 데이터 로깅
  useEffect(() => {
    if (listData?.characters) {
      console.log('서버에서 받은 캐릭터 리스트:', listData.characters);
      listData.characters.forEach((char) => {
        console.log(`캐릭터 ${char.characterName}: ID=${char.userCharacterId}`);
      });
    }
  }, [listData]);

  // 기본 데이터 처리
  useEffect(() => {
    if (listData?.characters) {
      console.log('캐릭터 데이터 처리 시작');

      const processed = listData.characters
        .map((listItem) => {
          // ID 확인 및 로깅
          console.log(
            `처리 중: ${listItem.characterName}, 서버 ID: ${listItem.userCharacterId}`,
          );

          // 이름으로 config 항목 찾기 (정적 리소스)
          const configItem = characterConfig.find(
            (c) => c.name === listItem.characterName,
          );

          if (!configItem) {
            console.warn(
              `${listItem.characterName}에 대한 config 데이터를 찾을 수 없습니다`,
            );
            return null;
          }

          // 서버 ID 명시적으로 설정 (중요!)
          const serverID = listItem.userCharacterId;

          // 데이터 병합
          const processedItem: CharacterTypes<number> = {
            id: serverID, // 서버 ID를 로컬 ID로 설정
            userCharacterId: serverID, // 서버 ID 명시적 보존
            name: listItem.characterName,
            description: listItem.summary,
            img: configItem.img,
            backImg: configItem.backImg,
            profileImg: configItem.profileImg,
            footImg: configItem.footImg,
            subStory: configItem.subStory, // 기본값은 config에서
            detailStory: configItem.detailStory, // 기본값은 config에서
          };

          console.log(
            `처리된 캐릭터: ${processedItem.name}, ID: ${processedItem.id}, userCharacterId: ${processedItem.userCharacterId}`,
          );
          return processedItem;
        })
        .filter(Boolean) as CharacterTypes<number>[];

      console.log('캐릭터 기본 처리 완료:', processed);
      setProcessedData(processed);
    }
  }, [listData]);

  // 상세 정보 추가 처리 (필요시)
  useEffect(() => {
    if (processedData.length > 0 && infoData?.characters) {
      console.log('캐릭터 상세 정보 업데이트');

      const updatedData = processedData.map((character) => {
        const infoItem = infoData.characters.find(
          (info) => info.userCharacterId === character.userCharacterId,
        );

        if (infoItem) {
          return {
            ...character,
            subStory: infoItem.summary || character.subStory,
            detailStory: infoItem.description || character.detailStory,
          };
        }

        return character;
      });

      console.log('캐릭터 상세 처리 완료');
      setProcessedData(updatedData);
    }
  }, [infoData, processedData]);

  return {
    processedData,
    isLoading: listLoading,
    isFullyLoaded: !listLoading && !infoLoading,
  };
};
