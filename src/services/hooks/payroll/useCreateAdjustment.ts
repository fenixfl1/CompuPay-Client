import { WEB_API_CREATE_ADJUSTMENT } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Adjustment } from "@/interfaces/payroll"
import { postRequest } from "@/services/api"

function useCreateAdjustment() {
  return useCustomMutation<Adjustment, Adjustment>({
    initialData: <Adjustment>{},
    mutationKey: ["payroll", "create-adjustment"],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Adjustment>(WEB_API_CREATE_ADJUSTMENT, payload)

      return data
    },
  })
}

export default useCreateAdjustment
