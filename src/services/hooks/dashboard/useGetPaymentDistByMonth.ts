import { WEB_API_GET_PAYMENT_DIST_BY_MONTH } from "@/constants/routes"
import { getRequest } from "@/services/api"
import { useQuery } from "@tanstack/react-query"

interface Payload {
  data: {
    month: string
    AFP: number
    ISR: number
    SALARIO: number
    SFS: number
  }[]
  concepts: {
    concept: string
    fill: string
  }[]
}

function useGetPaymentDistByMonth() {
  return useQuery({
    queryKey: ["dashboard", "get-payment-dist-by-month"],
    queryFn: async () => {
      const {
        data: { data },
      } = await getRequest<Payload>(WEB_API_GET_PAYMENT_DIST_BY_MONTH)

      return data
    },
  })
}

export default useGetPaymentDistByMonth
