import { WEB_API_GET_BUSINESS_INFO } from "@/constants/routes"
import { Business } from "@/interfaces/user"
import { getSessionInfo } from "@/lib/session"
import { getRequest } from "@/services/api"
import useUserStore from "@/stores/userStore"
import { useQuery } from "@tanstack/react-query"

export function useGetBusinessInfo() {
  const { setBusinessInfo } = useUserStore()

  const { BUSINESS_ID: id } = getSessionInfo()

  return useQuery({
    enabled: id !== undefined,
    queryKey: ["users", "get-business-info"],
    queryFn: async () => {
      const {
        data: { data },
      } = await getRequest<Business>(`${WEB_API_GET_BUSINESS_INFO}${id}`)

      setBusinessInfo(data)

      return data
    },
  })
}
