import { ReactNode } from 'react';

interface AspectRatioProps {
  children: ReactNode;
}

const AspectRatioContainer = ({ children }: AspectRatioProps) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black'>
      <div className='relative w-full max-w-screen-2xl aspect-video bg-white overflow-hidden'>
        {/* <div className='relative w-full max-w-screen-2xl aspect-[20/9] bg-white overflow-hidden'> */}
        {children}
      </div>
    </div>
  );
};

export default AspectRatioContainer;
