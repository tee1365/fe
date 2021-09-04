import router from 'next/dist/client/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace('/login?next=' + router.pathname);
    }
  }, [data, router, fetching]);
};
