import { WEB_API_UPDATE_ADJUSTMENT } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Adjustment } from "@/interfaces/payroll"
import { putRequest } from "@/services/api"

function useUpdateAdjustment() {
  return useCustomMutation<string, Partial<Adjustment>>({
    initialData: "",
    mutationKey: ["payroll", "update-adjustment"],
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await putRequest<Adjustment>(WEB_API_UPDATE_ADJUSTMENT, payload)

      return message as string
    },
  })
}

export default useUpdateAdjustment
