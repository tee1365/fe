import router from 'next/dist/client/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

export const useIsAuth = () => {
  const { data, loading } = useMeQuery();
  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace('/login?next=' + router.pathname);
    }
  }, [data, router, loading]);
};
