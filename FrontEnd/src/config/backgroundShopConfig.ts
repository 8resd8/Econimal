import bugi from '../assets/char/background/tur_back.png';
import peng from '../assets/char/background/peng_back.png';
import horang from '../assets/char/background/horang_back.png';
import bugiv2 from '../assets/char/background/bugi_seaver1.png';
import pengv2 from '../assets/char/background/peng_icever1.png';
import horangv2 from '../assets/char/background/horang_yeildver1.png';

export const backgroundShopConfig = [
  {
    productId: 101,
    characterName: '바다',
    image: bugi,
    price: 0,
    owned: true,
  },
  {
    productId: 102,
    characterName: '빙하',
    image: peng,
    price: 0,
    owned: true,
  },
  {
    productId: 103,
    characterName: '초원',
    image: horang,
    price: 0,
    owned: true,
  },
  {
    productId: 104,
    characterName: '더 넓은 바다',
    image: bugiv2,
    price: 1000,
    owned: false,
  },
  {
    productId: 105,
    characterName: '더 큰 빙하',
    image: pengv2,
    price: 1000,
    owned: false,
  },
  {
    productId: 106,
    characterName: '더 넓은 초원',
    image: horangv2,
    price: 1000,
    owned: false,
  },
];
