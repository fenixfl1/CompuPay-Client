import {} from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { postRequest } from "@/services/api"
import { AdvancedCondition, GetPayload } from "@/services/interfaces"

function useGenerateReport(url: string) {
  return useCustomMutation<
    string,
    Partial<GetPayload & { column_widths: number[] }>
  >({
    initialData: "",
    mutationKey: ["reports", "user-reports"],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<string>(url, payload)

      return data
    },
  })
}

export default useGenerateReport
