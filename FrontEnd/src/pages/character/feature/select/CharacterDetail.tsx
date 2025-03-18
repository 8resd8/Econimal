import useCharStore from '@/store/useCharStore';
import { CharacterDetailProps } from '@/pages/character/types/CharacterDetailProps';
import { useNavigate } from 'react-router-dom';
import { useFetchMyChar } from '../hooks/useFetchMyChar';
import { useCharInfo } from './../hooks/useCharInfo';
import { useState } from 'react';
import CharacterDetailUI from '../../componet/select/CharacterDetailUI';

// 이제 필수인 id값, 그리고 작은 설명, 자세한 설명
const CharacterDetail = ({
  id,
  name,
  subStory: initialSubStory,
  detailStory: initialDetailStory,
}: CharacterDetailProps<number>) => {
  const { myChar, resetMyChar } = useCharStore(); //id 관련 값과 캐릭 관련 데이터가 저장될 공간

  //각 story들을 useState에 담은 이유는 캐릭터를 선택할 때 마다 스토리가 바뀌기 떄문
  //Q. 서버에서 바로 패칭되어서 받아오는 작업인데 상태를 관리할 필요가 있을지 의문인 부분
  const [subStory] = useState(initialSubStory);
  const [detailStory] = useState(initialDetailStory);

  //높은 확률로 현재 서버 패칭 데이터가 들어가있지 않은 myChar에 넣어질 data
  const { data, isLoading } = useCharInfo(); //캐릭터 상세정보 조회

  const { handleFetchMyChar, isPending } = useFetchMyChar(); //추후 서버에 id값을 보내기 위해 사용될 탠스택
  const nav = useNavigate();

  //해당 캐릭터 구하기
  const handleHelpChar = () => {
    const effectiveId = id; //zustand에 담긴 서버의 charId값
    const myCharId = myChar?.userCharacterId || myChar?.id;

    //모두 일치하다면 구하기
    if (effectiveId && effectiveId === myCharId) {
      handleFetchMyChar(); //탠스택 쿼리에서 사용될 데이터
      nav('/my');
    } else {
      console.warn('선택된 캐릭터와 현재 캐릭터 ID가 일치하지 않습니다.');
    }
  };

  //다른 캐릭터를 선택하면 zustand에 담긴 모든 데이터 날리기
  const handleHelpAnotherChar = () => {
    resetMyChar();
  };

  // 데이터가 로딩중일 때
  if (isLoading || isPending) {
    return (
      <div className='rounded-2xl p-14 bg-green-50 flex justify-center items-center'>
        <p className='text-xl text-primary'>로딩 중...</p>
      </div>
    );
  }

  return (
    <CharacterDetailUI
      id={id}
      name={name}
      subStory={subStory}
      detailStory={detailStory}
      handleHelpChar={handleHelpChar}
      handleHelpAnotherChar={handleHelpAnotherChar}
    />
  );
};

export default CharacterDetail;
