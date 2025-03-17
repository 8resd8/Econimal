//캐릭터터
import turtleImg from '../assets/char/char_bugi.png';
import pengImg from '../assets/char/char_peng.png';
import horangImg from '../assets/char/char_horang.png';
//백그라운드드
import turbackImg from '../assets/char/background/tur_back.png';
import pengbackImg from '../assets/char/background/peng_back.png';
import horangbackImg from '../assets/char/background/horang_back.png';
//footIcon
import turfoot from '../assets/char/footitem/bugi_item.png';
import pengfoot from '../assets/char/footitem/peng_item.png';
import horang from '../assets/char/footitem/horang_item.png';
//프로필
import turProfile from '../assets/char/profile/char_bugiface.png';
import pengProfile from '../assets/char/profile/char_pengface.png';
import horangProfile from '../assets/char/profile/char_horangface.png';

import { CharacterTypes } from '@/pages/character/types/CharacterTypes';
import { useCharList } from '@/pages/character/feature/hooks/useCharList';

// 근데 여기 값 로직 추가 할 것 같은데,, -> 그런데 useCharListdata쓰는방법?
// 이거 fetch로 받은것 type설정 추후에 한다고 치고고
const { data } = useCharList(); //이렇게가 맞는지? 구조분해할당
//일단 캐릭터 3개에 대해서만 한다면? => object객체에 id값 접근해서 추가
data.characters.slice(0, 3).map((item, idx) => {
  if (item.name === characterConfig[idx].name) {
    characterConfig[idx].id = item.characterId;
  }
});

export const characterConfig: CharacterTypes<string>[] = [
  {
    name: '부기부기',
    description: '바다에 사는 바다 거북이에요',
    img: turtleImg,
    backImg: turbackImg,
    profileImg: turProfile,
    footImg: turfoot,
    subStory: '안녕, 나는 바다의 쓰레기를 줄여야 한다고 생각해.',
    detailStory: `여러분 도와주세요!. 바다의 플라스틱 쓰레기 때문에 바다 거북이들이 위험해지고 있어요. 여러분이 저희를 함께 도와주면 바다의 깨끗한 환경을 만들 수 있을 거예요`,
    id: '',
  },
  {
    name: '팽글링스',
    description: '남극에 사는 펭귄이에요',
    img: pengImg,
    backImg: pengbackImg,
    profileImg: pengProfile,
    footImg: pengfoot,
    subStory: '안녕, 나는 수영보다 걷기를 좋아하는 펭귄이야.',
    detailStory:
      '여러분 도와주세요!. 남극의 펭귄 친구들은 빙하가 녹아 힘들어하고 있어요. 여러분이 저희를 함께 도와주면 펭귄들이 행복하게 살 수 있는 환경을 만들 수 있을 거예요',
    id: '',
  },
  {
    name: '호랭이',
    description: '산 속에 사는 호랑이에요',
    img: horangImg,
    backImg: horangbackImg,
    profileImg: horangProfile,
    footImg: horang,
    subStory: '안녕, 나는 숲의 보존이 중요하다고 생각해.',
    detailStory:
      '여러분 도와주세요!. 산림 파괴로 인해 호랑이의 서식지가 줄어들고 있어요. 여러분이 저희를 함께 도와주면 호랑이들이 안전하게 살 수 있는 숲을 지킬 수 있을 거예요',
    id: '',
  },
];
