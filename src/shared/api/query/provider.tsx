"use client"

import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from "@tanstack/react-query"
import { useState, type ReactNode } from "react"
import { handleApiError } from "@/shared/api/error/handler"

interface QueryProviderProps {
    children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        retry: 1,
                    },
                },
                queryCache: new QueryCache({
                    onError: handleApiError,
                }),
                mutationCache: new MutationCache({
                    onError: handleApiError,
                }),
            }),
    )

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}
