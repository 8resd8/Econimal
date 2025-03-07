import {useState} from 'react'
import { Restaurant, Address } from "./restaurant";
import "./App.css";
import Store from "./Store";
import BestMenu from './BestMenu';

const data:Restaurant = {
  name: "밥먹자 식당",
  category: "korean",
  address: {
    city: "Ulsan",
    detail: "somewhere",
    zipCode: 2345678,
  },
  menu: [
    { name: "rice", price: 1000, category: "ect" },
    { name: "kimbab", price: 4000, category: "meals" },
  ],
};

// React.FC 사용 지양되고 있는 것이 아닌지?
// React.FC : 컴포넌트 타입 지정 (Function Component) 
const App: React.FC = () => {
  const [myRestaurant, setMyRestaurant] = useState<Restaurant>(data)  // <> : 제네릭. useState를 부르는 순간 타입을 정의하고 싶을 때.
  // setMyRestaurant(4) // 이렇게 사용하면 타입에러 발생(Argument of type 'number' is not assignable to parameter of type 'SetStateAction<Restaurant>')
  
  const changeAddress = (address: Address) => {
    setMyRestaurant({...myRestaurant, address:address})
    // setMyRestaurant(...)를 호출하면 React가 상태를 변경. 변경된 상태를 기반으로 컴포넌트를 다시 렌더링
    // { ...myRestaurant } -> 스프레드 연산자(...)를 사용해서 기존 객체 복사
    // address: address -> 객체의 address 속성을 매개변수 address 값으로 업데이트. 객체의 속성(address)에 전달받은 값(address)을 할당

    // setMyRestaurant({ ...myRestaurant, address: address }); // 일반적인 방식
    // setMyRestaurant({ ...myRestaurant, address });         // ES6 축약형. 둘 다 같은 의미
  }

  const showBestMenuName = (name:string) => {
  return name
  }

  return (
    <div className="App">
      <Store info={myRestaurant} changeAddress={changeAddress} />
      <BestMenu name="닭가슴살 볶음밥" category="밥" price={7000} showBestMenuName={showBestMenuName}/>
    </div>
  );
};

export default App;
