import turtleImg from '../assets/char_bugi.png';
import pengImg from '../assets/char_peng.png';
import horangImg from '../assets/char_horang.png';
import { CharacterTypes } from '@/types/CharacterTypes';

export const characterConfig: CharacterTypes<string>[] = [
  {
    name: '부기부기',
    description: '바다에 사는 바다 거북이에요',
    img: turtleImg,
  },
  { name: '팽글링스', description: '남극에 사는 펭귄이에요', img: pengImg },
  { name: '호랭이', description: '산 속에 사는 호랑이에요', img: horangImg },
];
