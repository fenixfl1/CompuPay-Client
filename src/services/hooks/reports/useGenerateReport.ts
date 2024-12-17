import { WEB_API_GENERATE_REPORT } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { getRequest, postRequest } from "@/services/api"
import {
  Condition,
  ApiResponse,
  AdvancedCondition,
} from "@/services/interfaces"

interface GenerateReportPayload {
  condition: AdvancedCondition[]
  pk?: number
  rp_name?: string
}

function useGenerateReport(app_level: "users" | "payroll" | "tasks") {
  return useCustomMutation<string, GenerateReportPayload>({
    initialData: "",
    mutationKey: ["reports", "user-reports"],
    mutationFn: async ({ condition, rp_name, pk }) => {
      const params = `${rp_name ?? ""}/${pk ?? ""}`
      const {
        data: { data },
      } = await postRequest<string>(
        `${app_level}${WEB_API_GENERATE_REPORT}${rp_name ? params : ""}`,
        condition
      )

      return data
    },
  })
}

export default useGenerateReport
