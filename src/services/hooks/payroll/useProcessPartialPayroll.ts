import { WEB_API_PROCESS_PARTIAL_PAYROLL } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { postRequest } from "@/services/api"
import { Condition } from "@/services/interfaces"

function useProcessPartialPayroll() {
  return useCustomMutation<
    string,
    Condition<{ USERS: string[]; PAYROLL_ID: number }>
  >({
    initialData: "",
    mutationKey: ["payroll", "process-partial-payroll"],
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await postRequest(WEB_API_PROCESS_PARTIAL_PAYROLL, payload)

      return message as string
    },
  })
}

export default useProcessPartialPayroll
