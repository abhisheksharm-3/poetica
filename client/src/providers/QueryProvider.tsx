/**
 * React Query client configuration.
 */
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

/**
 * Props for QueryProvider component.
 */
interface QueryProviderPropsType {
    children: ReactNode;
}

/**
 * React Query provider component for the application.
 */
export function QueryProvider({ children }: QueryProviderPropsType) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                    },
                    mutations: {
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
