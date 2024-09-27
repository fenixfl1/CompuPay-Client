import { WEB_API_GET_PAYROLL_ENTRIES } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { PayrollEntry } from "@/interfaces/payroll"
import { postRequest } from "@/services/api"
import { GetPayload, ReturnPayload } from "@/services/interfaces"
import usePayrollStore from "@/stores/payrollStore"

const initialData: ReturnPayload<PayrollEntry[]> = {
  data: [],
  metadata: {
    page: 1,
    page_size: 10,
    total: 0,
    next_page: 1,
    previous_page: "",
  },
}

function useGetPayrollEntries() {
  const { setPayrollEntries } = usePayrollStore()
  return useCustomMutation<ReturnPayload<PayrollEntry[]>, GetPayload>({
    initialData,
    mutationKey: ["payroll", "get-payroll-entries"],
    onSuccess: setPayrollEntries,
    mutationFn: async ({ condition, page, size }) => {
      const {
        data: { data, metadata },
      } = await postRequest<PayrollEntry[]>(
        `${WEB_API_GET_PAYROLL_ENTRIES}?page=${page}&page_size=${size}`,
        { condition }
      )

      return { data, metadata }
    },
  })
}

export default useGetPayrollEntries
