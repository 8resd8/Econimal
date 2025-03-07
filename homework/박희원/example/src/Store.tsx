import { Address, Restaurant } from "./restaurant"

interface OwnProps {
  info: Restaurant,
  // 함수 타입
  changeAddress(address: Address):void // 리턴 값 없으면 void
}

// React.FC에 들어오는 값이 제네릭이다!
const Store:React.FC<OwnProps> = ({info}) => {
  return (
    <div>{info.name}</div>
  )
}

export default Store
