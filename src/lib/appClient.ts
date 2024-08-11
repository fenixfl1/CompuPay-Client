import { QueryClient } from "@tanstack/react-query"

const disableRefetch = process.env.NODE_ENV !== "development"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: disableRefetch,
      refetchOnWindowFocus: disableRefetch,
    },
  },
})

export default queryClient
