import { WEB_API_GET_USER_STATISTIC } from "@/constants/routes"
import { getRequest } from "@/services/api"
import { useQuery } from "@tanstack/react-query"

function useGetUserStatistic() {
  return useQuery<UserStatistics>({
    queryKey: ["dashboard", "get-user-statistic"],
    queryFn: async () => {
      const {
        data: { data },
      } = await getRequest<UserStatistics>(WEB_API_GET_USER_STATISTIC)

      return data
    },
  })
}

export default useGetUserStatistic
