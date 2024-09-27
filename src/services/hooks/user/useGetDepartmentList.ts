import { WEB_API_GET_DEPARTMENT_LIST } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Department } from "@/interfaces/user"
import { postRequest } from "@/services/api"
import { Condition } from "@/services/interfaces"

function useGetDepartmentList() {
  return useCustomMutation<Department[], Condition<Department>>({
    initialData: new Array<Department>(),
    mutationKey: ["users", "get-department-list"],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Department[]>(WEB_API_GET_DEPARTMENT_LIST, payload)

      return data
    },
  })
}

export default useGetDepartmentList
