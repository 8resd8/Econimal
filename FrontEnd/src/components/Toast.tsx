import { ToastContainer, toast } from 'react-toastify';
import { Button } from './ui/button';

const Toast = () => {
  const notify = () => toast('잉잉잉잉');
  return (
    <div>
      <Button onClick={notify}>기본 토스트</Button>
      <ToastContainer />
    </div>
  );
};
export default Toast;
