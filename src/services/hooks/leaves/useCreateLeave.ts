import { WEB_API_CREATE_LEAVE } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { postRequest } from "@/services/api"

function useCreateLeave() {
  return useCustomMutation<string, Leave>({
    initialData: "",
    mutationKey: ["leaves", "create-leave"],
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await postRequest<Leave>(WEB_API_CREATE_LEAVE, payload)

      return message
    },
  })
}

export default useCreateLeave
