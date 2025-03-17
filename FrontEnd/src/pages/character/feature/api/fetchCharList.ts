import axios from 'axios';

//보면 => config.ts 내용에서 fetch내용 가져와서 이미지랑 또 일치시켜야..
//근데 이 fetch가 일단 받아와서 2가지로 활용해야할 것 같음
//도감으로 slice해서 받아올 내용이랑, 전체 받아올 내용이랑.
//근데 이부분들은 zustand를 사용하지 않아도 되지 않을까?
//그냥 있는 데이터만 뿌릴 것 => 가공X
const fetchCarList = async () => {
  // 주소값 
  const response = await axios.get('',)
  return response.data
}