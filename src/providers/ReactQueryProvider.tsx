import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../utils/ApiManager';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export const ReactQueryProvider = (props: ReactQueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
};