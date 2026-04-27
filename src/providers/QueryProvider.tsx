"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Brauzer geri/ileri (BFCache və popstate) bərpa edəndə sorğular bəzən yenilənmir.
 * Keşi stale işarələyib aktiv observer-ləri yenidən yükləyirik.
 */
function RefetchOnHistoryRestore() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const invalidate = () => {
      void queryClient.invalidateQueries();
    };

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) invalidate();
    };

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("popstate", invalidate);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("popstate", invalidate);
    };
  }, [queryClient]);

  return null;
}

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnReconnect: true,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={client}>
      <RefetchOnHistoryRestore />
      {children}
    </QueryClientProvider>
  );
}
