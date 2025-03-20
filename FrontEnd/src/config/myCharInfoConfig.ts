//추후 상태 저장 관리 -> zustand에 있는 내용이랑 일치 여부 판단해야하니까.
//추후 서버 패칭 로직과 일치 여부를 판단할 데이터

//기본
import tur_basic from '../assets/char/emotion/tur_basic.png';
import tur_sad from '../assets/char/emotion/tur_sad.png';
import tur_happy from '../assets/char/emotion/tur_happy.png';
import peng_basic from '../assets/char/emotion/peng_basic.png';
import peng_sad from '../assets/char/emotion/peng_sad.png';
import peng_happy from '../assets/char/emotion/peng_happy.png';
import horang_basic from '../assets/char/emotion/horang_basic.png';
import horang_sad from '../assets/char/emotion/horang_sad.png';
import horang_happy from '../assets/char/emotion/horang_happy.png';

//발판 배경
import tur_1 from '../assets/char/level/tur_1.png';
import tur_2 from '../assets/char/level/tur_2.png';
import tur_3 from '../assets/char/level/tur_3.png';
import peng_1 from '../assets/char/level/peng_1.png';
import peng_2 from '../assets/char/level/peng_2.png';
import peng_3 from '../assets/char/level/peng_3.png';
import horang_1 from '../assets/char/level/horang_1.png';
import horang_2 from '../assets/char/level/horang_2.png';
import horang_3 from '../assets/char/level/horang_3.png';

export const myCharInfoConfig = [
  {
    userCharacterId: 757,
    name: '부기부기',
    expression: [
      { face: 'JOY', turtleImg: tur_happy },
      { face: 'SADNESS', turtleImg: tur_sad },
      { face: 'NEUTRAL', turtleImg: tur_basic },
    ],
    level: [
      { num: 1, footImg: tur_1 },
      { num: 2, footImg: tur_2 },
      { num: 3, footImg: tur_3 },
    ],
  },
  {
    userCharacterId: 758,
    name: '팽글링스',
    expression: [
      { face: 'JOY', turtleImg: peng_happy },
      { face: 'SADNESS', turtleImg: peng_sad },
      { face: 'NEUTRAL', turtleImg: peng_basic },
    ],
    level: [
      { num: 1, footImg: peng_1 },
      { num: 2, footImg: peng_2 },
      { num: 3, footImg: peng_3 },
    ],
  },
  {
    userCharacterId: 759,
    name: '호랭이',
    expression: [
      { face: 'JOY', turtleImg: horang_happy },
      { face: 'SADNESS', turtleImg: horang_sad },
      { face: 'NEUTRAL', turtleImg: horang_basic },
    ],
    level: [
      { num: 1, footImg: horang_1 },
      { num: 2, footImg: horang_2 },
      { num: 3, footImg: horang_3 },
    ],
  },
];
