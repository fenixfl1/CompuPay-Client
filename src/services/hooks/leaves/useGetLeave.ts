import { WEB_API_GET_LEAVE } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { getRequest } from "@/services/api"
import useLeaveStore from "@/stores/leaveStore"

function useGetLeave() {
  const { setLeave } = useLeaveStore()

  return useCustomMutation<Leave, number>({
    initialData: <Leave>{},
    mutationKey: ["leaves", "get-leave"],
    onSuccess: setLeave,
    mutationFn: async (leave_id) => {
      const {
        data: { data },
      } = await getRequest<Leave>(`${WEB_API_GET_LEAVE}${leave_id}`)

      return data
    },
  })
}

export default useGetLeave
