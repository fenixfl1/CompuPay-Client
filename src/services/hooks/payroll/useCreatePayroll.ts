import { WEB_API_CREATE_PAYROLL } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { postRequest } from "@/services/api"

interface CreatePayrollPayload {
  PERIOD_START: string
  PERIOD_END: string
  STATE: string
  EMPLOYEES: string | string[]
}

function useCreatePayroll() {
  return useCustomMutation<string, CreatePayrollPayload>({
    initialData: "",
    mutationKey: ["payroll", "create-payroll"],
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await postRequest(WEB_API_CREATE_PAYROLL, payload)

      return message as string
    },
  })
}

export default useCreatePayroll
