import { useEffect, useState } from 'react';
import { charShopConfig } from '@/config/charShopConfig';
import {
  ShopItemTypes,
  ShopItemRes,
} from '@/pages/character/types/shop/ShopItemTypes';

export const useCharShopItem = (data: ShopItemRes) => {
  //list기 때문에 하나만 찾는게 아님
  //data자체를 loop를 돌고 shopconfig와 확인
  const [charShopList, setCharShopList] = useState<ShopItemTypes[]>([]);
  useEffect(() => {
    if (!data || !data.products) return;

    const resultData = data.products.map((item: ShopItemTypes, idx: number) => {
      if (
        item.productId === charShopConfig[idx].productId ||
        item.characterName === charShopConfig[idx].characterName
      ) {
        return {
          productId: item.productId,
          characterName: item.characterName,
          price: item.price,
          image: charShopConfig[idx].img,
          owned: item.owned,
        };
      }
      return charShopConfig[idx]; //item 데이터를 못받아 올경우 config 더미 데이터(정적 데이터) 활용
    });

    setCharShopList(resultData);
  }, [data]);

  return { charShopList };
};
