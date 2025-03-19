import { useEffect, useState } from 'react';
import { useCharList } from '../useCharList';
import { CharacterTypes } from '../../../types/CharacterTypes';
import { characterConfig } from '@/config/characterConfig';

// 캐릭터 목록 데이터를 처리하는 커스텀 훅
// 서버에서 받은 캐릭터 목록과 정적 리소스를 병합.
export const useProcessedCharList = () => {
  const { data: listData, isLoading: listLoading } = useCharList(); //가공을 위해 필요한 데이터들
  //새로 만들고 반환할 데이터들 -> 따라서 기존데이터와 서버 데이터 활용
  const [processedData, setProcessedData] = useState<CharacterTypes<number>[]>(
    [],
  );

  useEffect(() => {
    if (listData?.characters) {
      //listData.characters까지 접근해야 서버 데이터 활용 가능

      //1차 가공
      const processed = listData.characters
        .map((serverItem) => {
          //구조 분해 할당을 통해서 필요한 데이터 확보
          const { userCharacterId, characterName, summary } = serverItem;

          // ID값 활용이 가장 중요하기 때문에 유효 여부 판단
          if (!userCharacterId) {
            console.warn(
              `${characterName}의 ID가 유효하지 않습니다:`,
              userCharacterId,
            );
            return null; //없을 경우 null값으로 일단 선 전달
          }

          // config에서 정적 리소스 찾기(클라이언트 측에서 설정해놓은 내용)
          // 아이디값을 일단 일치시켜놓긴 했지만, 이름이 같기 때문에 이름 기준으로 값 찾기
          const configItem = characterConfig.find(
            //같은 값을 configItem으로 담음
            (config) => config.name === characterName,
          );

          if (!configItem) {
            console.warn(
              `${characterName}에 대한 config 데이터를 찾을 수 없습니다`,
            );
            return null; //데이터가 없으면 null반환
          }

          // 캐릭터 데이터 병합
          const processedItem: CharacterTypes<number> = {
            //서버 데이터 활용
            id: userCharacterId,
            userCharacterId: userCharacterId,
            name: characterName as string,
            description: summary as string,

            //그 외적으로는 정적 파일 데이터 활용함
            img: configItem.img,
            backImg: configItem.backImg,
            profileImg: configItem.profileImg,
            footImg: configItem.footImg,
            subStory: configItem.subStory,
            detailStory: configItem.detailStory,
          };
          return processedItem;
        })
        .filter(Boolean) as CharacterTypes<number>[]; //참인 값들만 필터링하는 것 - null/undefined 필터링X
      // const arr = [1, 2, null, 3, undefined, 4]; => null과 undefined는 나타나지 않게 하는
      setProcessedData(processed);
    }
  }, [listData]);

  return {
    processedData,
    isLoading: listLoading,
  };
};
