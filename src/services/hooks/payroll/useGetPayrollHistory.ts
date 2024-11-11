import { WEB_API_GET_PAYROLL_HISTORY } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { PayrollHistory } from "@/interfaces/payroll"
import { postRequest } from "@/services/api"
import { GetPayload, ReturnPayload } from "@/services/interfaces"

const initialData: ReturnPayload<PayrollHistory[]> = {
  data: [],
  message: "",
  metadata: {
    page: 1,
    page_size: 10,
    total: 0,
    next_page: 1,
    previous_page: "",
  },
}

function useGetPayrollHistory() {
  return useCustomMutation<ReturnPayload<PayrollHistory[]>, GetPayload>({
    initialData,
    mutationKey: ["payroll", "get-payroll-history"],
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<PayrollHistory[]>(
        `${WEB_API_GET_PAYROLL_HISTORY}?page=${page}&page_size=${size}`,
        { condition }
      )

      return data
    },
  })
}

export default useGetPayrollHistory
