import { WEB_API_UPDATE_LEAVE } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { putRequest } from "@/services/api"

function useUpdateLeave() {
  return useCustomMutation<string, Partial<Leave>>({
    initialData: "",
    mutationKey: ["leaves", "update-leave"],
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await putRequest<Leave>(WEB_API_UPDATE_LEAVE, payload)

      return message
    },
  })
}

export default useUpdateLeave
