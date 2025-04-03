import { ReactNode, useState, useEffect } from 'react';

// 개발 환경에서만 ReactQueryDevtools 임포트
let ReactQueryDevtools: React.ComponentType<any> | null = null;

// lazy 로딩을 사용하여 프로덕션 환경에서는 번들에 포함되지 않도록 함
if (import.meta.env.DEV) {
  import('@tanstack/react-query-devtools').then((module) => {
    ReactQueryDevtools = module.ReactQueryDevtools;
  });
}

interface QueryDevtoolsProps {
  children?: ReactNode;
}

const QueryDevtools = ({ children }: QueryDevtoolsProps) => {
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    // 개발 환경에서만 DevTools 활성화
    setShowDevtools(import.meta.env.DEV);
  }, []);

  return (
    <>
      {children}
      {showDevtools && ReactQueryDevtools && <ReactQueryDevtools />}
    </>
  );
};

export default QueryDevtools;
