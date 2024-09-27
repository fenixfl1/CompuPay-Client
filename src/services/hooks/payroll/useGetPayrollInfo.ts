import { WEB_API_GET_PAYROLL_INTO } from "@/constants/routes"
import { PayrollInfo } from "@/interfaces/payroll"
import { getRequest } from "@/services/api"
import usePayrollStore from "@/stores/payrollStore"
import { useQuery } from "@tanstack/react-query"

function useGetPayrollInfo() {
  const { setPayrollInfo } = usePayrollStore()

  return useQuery({
    initialData: <PayrollInfo>{},
    queryKey: ["payroll", "get-payroll-info"],
    queryFn: async () => {
      const {
        data: { data },
      } = await getRequest<PayrollInfo>(WEB_API_GET_PAYROLL_INTO)

      setPayrollInfo(data)
      return data
    },
  })
}

export default useGetPayrollInfo
