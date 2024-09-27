import { WEB_API_UPDATE_PAYROLL_ENTRY } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { putRequest } from "@/services/api"

interface UpdatePayrollEntryPayload {
  STATE: string
  PAYROLL_ENTRY_ID: number
}

function useUpdatePayrollEntry() {
  return useCustomMutation<string, UpdatePayrollEntryPayload>({
    initialData: "",
    mutationKey: ["payroll", "update-payroll-entry"],
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await putRequest(WEB_API_UPDATE_PAYROLL_ENTRY, payload)

      return message as string
    },
  })
}

export default useUpdatePayrollEntry
