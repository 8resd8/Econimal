import { backgroundShopConfig } from '@/config/backgroundShopConfig';
import { useEffect, useState } from 'react';
import {
  ShopBackItemTypesRes,
  ShopBackItemTypes,
} from '@/pages/character/types/shop/ShopBackItemTypes';

export const usebackShopItem = (data: ShopBackItemTypesRes) => {
  const [backShopList, setBackShopList] = useState<ShopBackItemTypes[]>([]);

  useEffect(() => {
    if (!data || !data.products) return;

    const resultData = data.products.map((item: ShopBackItemTypes) => {
      const configData = backgroundShopConfig.find(
        (back) => item.productId === back.productId,
      );
      if (item !== undefined) {
        return {
          productId: item.productId,
          owned: item.owned,
          price: item.price,
          image: configData?.image,
          characterName: configData?.characterName,
          userBackgroundId: item.userBackgroundId,
        };
      }
      return configData;
    });
    setBackShopList(resultData);
  }, [data]);

  return {
    backShopList,
  };
};
