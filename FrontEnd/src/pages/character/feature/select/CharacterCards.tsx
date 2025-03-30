import { useMyCharacterId, userMyCharActions } from '@/store/useMyCharStore';
import useCharStore from '@/store/useCharStore';
import { CharacterTypes } from '@/pages/character/types/CharacterTypes';
import CharacterCardsUI from './../../componet/select/CharacterCardsUI';
import { useCharacterActions } from '@/store/useCharStatusStore';

//실상 가공된 데이터에서 필요한 정보 => 카드 선택과 추후 캐릭터 배경과 연관
const CharacterCards = ({
  id,
  userCharacterId,
  userBackgroundId,
  name,
  description,
  img,
  backImg,
  profileImg,
  footImg,
  subStory,
  detailStory,
}: CharacterTypes<number>) => {
  const myCharacterId = useMyCharacterId();
  const { setResetData, setAllData } = userMyCharActions();

  const { myChar, setMyChar, resetMyChar } = useCharStore(); //zustand에 저장된 데이터와 zustand에 저장하기 위한 로직
  // const { myChar, setMyChar, resetMyChar } = useCharStore(); //zustand에 저장된 데이터와 zustand에 저장하기 위한 로직
  // 해당 내용은 서버에 확실하게 전달하기 전에 사용됨 (선택할 시에 활성화되게 됨)

  const effectiveId = userCharacterId || id || 0; //여기도 보면 server에서 받아온 userId 우선
  // 카드별로 characterId가 부여되는데 그게 effectiveId가 됨

  // 확실하게 서버에서 준 userCharacterId를 기반으로 진행함 (가공된 데이터를 고려해보았을 때)
  // 기존에 선택된 내용인지 여부를 판단하는 isSelected 함수
  // const isSelected =
  //   myChar &&
  //   (myChar.userCharacterId === effectiveId || myChar.id === effectiveId);
  const isSelected = myCharacterId && myCharacterId === effectiveId;

  // 버튼 클릭 관련 -> 하위에 내려줄 데이터, store 데이터를 기반으로 검증
  // 캐릭터 선택 함수 핸들러 실행 (zustand와 서버에 fetching으로 내려보내줄 아이)
  const handlePickChar = () => {
    if (isSelected) {
      // 이미 선택된 캐릭터면 선택 해제
      // resetMyChar();
      setResetData();
    } else {
      // 선택되지 않은 캐릭터면 선택 -> myChar에 저장하고, 서버 자체에 fetching으로 보낼 데이터
      const charData: CharacterTypes<number> = {
        userCharacterId: effectiveId,
        userBackgroundId, // 추후 서버에서 제공할 수 있음
        name,
        description,
        img,
        backImg,
        profileImg,
        footImg,
        subStory: subStory || '',
        detailStory: detailStory || '',
      };
      // //myChar에 저장하게 될 store 데이터
      // setMyChar(charData); //store에 데이터 저장
      setAllData(charData);
    }
  };

  return (
    <CharacterCardsUI
      name={name}
      description={description}
      img={img}
      handlePickChar={handlePickChar}
      isSelected={isSelected}
    />
  );
};

export default CharacterCards;
