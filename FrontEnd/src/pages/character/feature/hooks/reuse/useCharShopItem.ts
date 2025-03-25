import { shopConfig } from '@/config/shopConfig';
import { useEffect, useState } from 'react';
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
        item.productId === shopConfig[idx].productId ||
        item.characterName === shopConfig[idx].characterName
      ) {
        return {
          productId: item.productId,
          characterName: item.characterName,
          image: shopConfig[idx].img,
          owned: item.owned,
        };
      }
      return shopConfig[idx];
    });

    setCharShopList(resultData);
  }, [data]);

  return { charShopList };
};
