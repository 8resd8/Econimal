import bugi from '../assets/char/char_bugi.png';
import horang from '../assets/char/char_horang.png';
import peng from '../assets/char/char_peng.png';

//추후 내가 가지고 있는 배경에 대한 값을 확인하기 위해서는 backgroundId가 필요하다고 판단됨..
//이게 아닌가?
export const charShopConfig = [
  {
    productId: 1,
    characterName: '부기부기',
    image: bugi,
    price: 100,
    owned: true,
    userCharacterId: 835,
  },
  {
    productId: 2,
    characterName: '팽글링스',
    image: peng,
    price: 100,
    owned: true,
    userCharacterId: 836,
  },
  {
    productId: 3,
    characterName: '호랭이',
    image: horang,
    price: 100,
    owned: true,
    userCharacterId: 837,
  },
];
