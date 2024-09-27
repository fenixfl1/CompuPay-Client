import { WEB_API_GET_EMPLOYEES_BY_DEPARTMENTS } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { getRequest } from "@/services/api"
import { useQuery } from "@tanstack/react-query"

function useGetEmployeesByDepartments() {
  return useQuery<ChartRecord[]>({
    queryKey: ["dashboard", "get-employees-by-departments"],
    queryFn: async () => {
      const {
        data: { data },
      } = await getRequest<ChartRecord[]>(WEB_API_GET_EMPLOYEES_BY_DEPARTMENTS)

      return data
    },
  })
}

export default useGetEmployeesByDepartments
