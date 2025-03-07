// const data = {
//   name: '밥먹자 식당',
//   category: 'korean',
//   address: {
//     city: 'Ulsan',
//     detail:'somewhere',
//     zipCode: '2345678'
//   },
//   menu: [{name: 'rice', price:1000,category:'ect'},{name:'kimbab', price:4000, category:'meals'}]
// }

// export type Restaurant = {
//   name: string;
//   category: string;
//   address: {
//     city: string;
//     detail: string;
//     zipCode: number;
//   };
//   menu: {
//     name: string;
//     price: number;
//     category: string;
//   }[] // 배열 타입
// };

// 타입 분리
export type Restaurant = {
  name: string;
  category: string;
  address: Address;
  menu: Menu[];
};

export type Address = {
  city: string;
  detail: string;
  zipCode: number;
};

export type Menu = {
  name: string;
  price: number;
  category: string;
};

// 일부를 뺴고 싶다면 Omit
// Address에서 zipCode를 뺀 나머지 타입
export type AddressWithoutZipCode = Omit<Address, "zipCode">;

// 일부만 가져오고 싶다면 Pick
// Restaurant 타입에서 category 가져오기
export type RestaurantOnlyCategory = Pick<Restaurant, "category">;

export type ApiResponse<T> = {
  data: T[];
  totalPage: number;
  page: number;
};

export type RestaurantResponse = ApiResponse<Restaurant>;
export type MenuResponse = ApiResponse<Menu>;
