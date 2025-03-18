// const { data, isLoading } = useCharList();
import { CharacterTypes } from '@/pages/character/types/CharacterTypes';
import { useCharList } from '@/pages/character/feature/hooks/useCharList';
// import { useEffect } from 'react';

//캐릭터
import turtleImg from '../assets/char/char_bugi.png';
import pengImg from '../assets/char/char_peng.png';
import horangImg from '../assets/char/char_horang.png';
//백그라운드
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
//config.ts는 데이터를 정의하는 파일 === 주로 상수나 초기값을 설정

//----------------------------------------
// useEffect(() => {
//   if (data && data.characters) {
//     //data에 대한 검증로직을 더 추가해야함
//     data.characters.slice(0, 3).map((item, idx) => {
//       if (item.characterName === characterConfig[idx].name) {
//         characterConfig[idx].id = item.userCharacterId;
//         characterConfig[idx].name = item.characterName; //서버 제공-캐릭터 이름
//         characterConfig[idx].description = item.summary; //서버 제공-캐릭터 설명
//       }
//     });
//   }

//   //data가 바뀔때마다?
// }, [data]);

//----------------------------------------

export const characterConfig: CharacterTypes<number>[] = [
  {
    name: '부기부기',
    description: '바다에 사는 바다 거북이에요',
    img: turtleImg,
    backImg: turbackImg,
    profileImg: turProfile,
    footImg: turfoot,
    subStory: '안녕, 나는 바다의 쓰레기를 줄여야 한다고 생각해.',
    detailStory: `여러분 도와주세요!. 바다의 플라스틱 쓰레기 때문에 바다 거북이들이 위험해지고 있어요. 여러분이 저희를 함께 도와주면 바다의 깨끗한 환경을 만들 수 있을 거예요`,
    // id: 1,
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
    // id: 2,
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
    // id: 3,
  },
];
