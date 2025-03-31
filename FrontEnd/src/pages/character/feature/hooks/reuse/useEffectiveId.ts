import { useEffect, useState } from 'react';
import { CharacterTypes } from '@/pages/character/types/CharacterTypes';

//훅에 직접적인 zustand 사용X -> hooks 규칙 위반!
export const useEffectiveId = (characterId: number) => {
  // 캐릭터 선택 유무 => false일 경우 : 선택하지 않았음을 의미
  const [hasValidSelection, setHasValidSelection] = useState<boolean>(false);
  const [effectiveId, setEffectiveId] = useState<number | null>(null); //초기에 빈값 설정
  // 상태값 설정 -> 들어올 수 있는 값에 대한 타입 설정

  // 내가 선택한 값이 있다면?
  useEffect(() => {
    if (characterId) {
      // myChar이 있어야 함 => 빈문자열일 수 있으니 Boolean 타입으로 감싸줌
      // 내부적으로 local에서 세팅한 id와 서버에서 fetching 받은 id 값의 여부를 확인
      const valid = Boolean(characterId && characterId > 0);
      setHasValidSelection(valid); //유효 여부 참&거짓 할당

      // 유효하면? -> 비동기 이슈로 인해서 자체 valid로 판단함
      // 사용할 유효한 ID 결정 (0보다 큰 값 사용, 현재 서버 fetching Id값 : 758~)
      // 서버에서 fetching 받은 id값 우선적으로 사용하고, 부득이하게 사용되지 못할 경우 내부적으로 만들어놓은 id 데이터 활용
      if (valid) {
        console.log(characterId, 'characterId 유효성?'); //잘 담기는 것 확인
        setEffectiveId(characterId); //id값 할당
      } else {
        setEffectiveId(null); //그냥 방치해도 되긴 하지만, id값이 만약 한 번 들어갔을 경우에도 초기화
      }
    } else {
      //상기 내용과 동일
      setHasValidSelection(false);
      setEffectiveId(null);
    }
  }, [characterId]);

  return {
    hasValidSelection,
    effectiveId,
  };
};
