import { WEB_API_GET_DEDUCTION_LIST } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Deduction } from "@/interfaces/payroll"
import { postRequest } from "@/services/api"
import { Condition } from "@/services/interfaces"

function useGetDeductionList() {
  return useCustomMutation<Deduction[], Condition<Deduction>>({
    initialData: new Array<Deduction>(),
    mutationKey: ["payroll", "get-deduction-list"],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Deduction[]>(WEB_API_GET_DEDUCTION_LIST, payload)

      return data
    },
  })
}

export default useGetDeductionList
