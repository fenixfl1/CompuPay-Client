import { WEB_API_UPDATE_OVERTIME } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { putRequest } from "@/services/api"

function useUpdateOvertime() {
  return useCustomMutation<string, Partial<Overtime>>({
    initialData: "",
    mutationKey: ["overtime", "update-overtime"],
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await putRequest(WEB_API_UPDATE_OVERTIME, payload)

      return message
    },
  })
}

export default useUpdateOvertime
