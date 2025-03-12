import { ReactNode } from 'react';

interface AspectRatioProps {
  children: ReactNode;
}

const AspectRatioContainer = ({ children }: AspectRatioProps) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black'>
      <div className='relative w-full max-w-screen-2xl aspect-video bg-white overflow-hidden'>
        {children}
      </div>
    </div>
  );
};

export default AspectRatioContainer;

// import { ReactNode } from 'react';

// interface AspectRatioProps {
//   children: ReactNode;
// }

// const AspectRatioContainer = ({ children }: AspectRatioProps) => {
//   return (
//     <div className='fixed inset-0 flex items-center justify-center bg-black'>
//       <div
//         className='relative bg-white w-screen h-screen'
//         style={{
//           maxWidth: 'calc(100vh * 16 / 9)',
//           maxHeight: 'calc(100vw * 9 / 16)',
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// };

// export default AspectRatioContainer;
