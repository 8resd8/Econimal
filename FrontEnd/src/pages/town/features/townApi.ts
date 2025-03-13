import { axiosInstance } from '@/api/axiosConfig';

// 마을 전체 시점에서 바라봤을 때의 이벤트 발생
const fetchTownEvents = async () => {
  const response = await axiosInstance.get('/towns/events');
};
