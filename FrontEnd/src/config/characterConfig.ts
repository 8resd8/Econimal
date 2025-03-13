import turtleImg from '../assets/char_bugi.png';
import turbackImg from '../assets/tur_back.png';
import pengImg from '../assets/char_peng.png';
import pengbackImg from '../assets/peng_back.png';
import horangImg from '../assets/char_horang.png';
import hobackImg from '../assets/horang_back.png';
import { CharacterTypes } from '@/pages/character/types/CharacterTypes';

export const characterConfig: CharacterTypes<string>[] = [
  {
    name: '부기부기',
    description: '바다에 사는 바다 거북이에요',
    img: turtleImg,
    backImg: turbackImg,
    subStory: '안녕, 나는 바다의 쓰레기를 줄여야 한다고 생각해.',
    detailStory: `여러분 도와주세요!. 바다의 플라스틱 쓰레기 때문에 바다 거북이들이 위험해지고 있어요. 여러분이 저희를 함께 도와주면 바다의 깨끗한 환경을 만들 수 있을 거예요`,
  },
  {
    name: '팽글링스',
    description: '남극에 사는 펭귄이에요',
    img: pengImg,
    backImg: pengbackImg,
    subStory: '안녕, 나는 수영보다 걷기를 좋아하는 펭귄이야.',
    detailStory:
      '여러분 도와주세요!. 남극의 펭귄 친구들은 빙하가 녹아 힘들어하고 있어요. 여러분이 저희를 함께 도와주면 펭귄들이 행복하게 살 수 있는 환경을 만들 수 있을 거예요',
  },
  {
    name: '호랭이',
    description: '산 속에 사는 호랑이에요',
    img: horangImg,
    backImg: hobackImg,
    subStory: '안녕, 나는 숲의 보존이 중요하다고 생각해.',
    detailStory:
      '여러분 도와주세요!. 산림 파괴로 인해 호랑이의 서식지가 줄어들고 있어요. 여러분이 저희를 함께 도와주면 호랑이들이 안전하게 살 수 있는 숲을 지킬 수 있을 거예요',
  },
];
