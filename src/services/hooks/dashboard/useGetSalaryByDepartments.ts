import { WEB_API_GET_SALARY_BY_DEPARTMENT } from "@/constants/routes"
import { getRequest } from "@/services/api"
import { useQuery } from "@tanstack/react-query"

interface Payload {
  fill: string
  department: string
  uv: number
  pv: number
  percentage: number
}

function useGetSalaryByDepartments() {
  return useQuery({
    queryKey: ["dashboard", "get-salary-by-departments"],
    queryFn: async () => {
      const {
        data: { data },
      } = await getRequest<Payload[]>(WEB_API_GET_SALARY_BY_DEPARTMENT)

      return data
    },
  })
}

export default useGetSalaryByDepartments
