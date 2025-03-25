import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const GoMainBtn = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button className='text-xl p-5' onClick={() => navigate('/')}>
        홈
      </Button>
    </div>
  );
};

export default GoMainBtn;
