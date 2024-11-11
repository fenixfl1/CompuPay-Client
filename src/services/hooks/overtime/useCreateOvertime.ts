import { WEB_API_CREATE_OVERTIME } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { postRequest } from "@/services/api"

function useCreateOvertime() {
  return useCustomMutation<string, Overtime>({
    initialData: "",
    mutationKey: ["overtime", "create-overtime"],
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await postRequest(WEB_API_CREATE_OVERTIME, payload)

      return message
    },
  })
}

export default useCreateOvertime
