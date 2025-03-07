import {Menu} from './restaurant'

// restaurant.ts에 있는 Menu 타입 확장하기
// export type Menu = {
//   name: string;
//   price: number;
//   category: string;
// }

// interface extends
// interface OwnProps extends Menu {
//   showBestMenuName(name:string):string
// }

// type으로 확장하려면 & 사용
// type OwnProps = Menu & {
//   showBestMenuName(name:string):string
// }

// Menu 타입에서 price 제외
interface OwnProps extends Omit<Menu, 'price'> {
  showBestMenuName(name:string):string
}

const BestMenu:React.FC<OwnProps> = ({name, price, category, showBestMenuName}) => {
  return (
    <div>{name}</div>
  )
}

export default BestMenu