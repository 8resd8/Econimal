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

    const resultData = data.products.map((item: ShopItemTypes) => {
      const configData = charShopConfig.find(
        (char) => char.productId === item.productId,
      );
      if (item !== undefined) {
        return {
          productId: item.productId,
          owned: item.owned,
          price: item.price,
          image: configData?.image,
          characterName: configData?.characterName,
          userCharacterId: item.userCharacterId,
        };
      }
      return configData;
    });
    setCharShopList(resultData);
  }, [data]);

  return { charShopList };
};
