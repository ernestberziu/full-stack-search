import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode } from 'react';

const makeQueryConfig = () => {
  const cacheConfig = {};

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
    queryCache: new QueryCache(cacheConfig),
    mutationCache: new MutationCache(cacheConfig),
  });
};

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const client = makeQueryConfig();

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
