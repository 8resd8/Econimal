import useCharStore from '@/store/useCharStore';
import { CharacterTypes } from '@/pages/character/types/CharacterTypes';
import CharacterCardsUI from './../../componet/select/CharacterCardsUI';

//실상 가공된 데이터에서 필요한 정보 => 카드 선택과 추후 캐릭터 배경과 연관
const CharacterCards = ({
  id,
  userCharacterId,
  name,
  description,
  img,
  backImg,
  profileImg,
  footImg,
  subStory,
  detailStory,
}: CharacterTypes<number>) => {
  const { myChar, setMyChar, resetMyChar } = useCharStore();
  const effectiveId = userCharacterId || id || 0; //여기도 보면 server에서 받아온 userId 우선

  //선택 여부(기존에는 myChar.name으로 했었지만, 현재는 확실한 유효성아이디를 기반으로 진행)
  //0만 아니면 됨 -> post요청을 보낼때를 고려하면 0이 오면 안됨
  const isSelected =
    myChar &&
    (myChar.userCharacterId === effectiveId || myChar.id === effectiveId);

  //버튼 클릭 관련 -> 하위에 내려줄 데이터, store 데이터를 기반으로 검증
  const handlePickChar = () => {
    if (isSelected) {
      // 이미 선택된 캐릭터면 선택 해제
      resetMyChar();
    } else {
      // 선택되지 않은 캐릭터면 선택
      // 선택 상태 일관성 보장을 위해서 id와 userCharacterId 서버에서 전달받은 내용을 기반으로 입력
      const charData: CharacterTypes<number> = {
        id: effectiveId,
        userCharacterId: effectiveId,
        name,
        description,
        img,
        backImg,
        profileImg,
        footImg,
        subStory: subStory || '', //detail fetching 전 데이터일 수 있기 때문, 확률상 낮긴 함
        detailStory: detailStory || '',
      };
      setMyChar(charData); //store에 데이터 저장
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
