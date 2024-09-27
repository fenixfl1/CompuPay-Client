import { WEB_API_GET_ADJUSTMENTS } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Adjustment } from "@/interfaces/payroll"
import { postRequest } from "@/services/api"
import { ReturnPayload, GetPayload } from "@/services/interfaces"

const initialData: ReturnPayload<Adjustment[]> = {
  data: [],
  metadata: {
    page: 1,
    page_size: 10,
    total: 0,
    next_page: 1,
    previous_page: "",
  },
}

function useGetAdjustments() {
  return useCustomMutation<ReturnPayload<Adjustment[]>, GetPayload>({
    initialData,
    mutationKey: ["payroll", "get-adjustments"],
    mutationFn: async ({ condition, page, size }) => {
      const {
        data: { data, metadata },
      } = await postRequest<Adjustment[]>(
        `${WEB_API_GET_ADJUSTMENTS}?page=${page}&page_size=${size}`,
        {
          condition,
        }
      )

      return { data, metadata }
    },
  })
}

export default useGetAdjustments
