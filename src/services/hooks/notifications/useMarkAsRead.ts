import { WEB_API_MARK_NOTIFICATIONS_AS_READ } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { putRequest } from "@/services/api"
import { Condition } from "@/services/interfaces"

function useMarkAsRead() {
  return useCustomMutation<string, Condition<any>>({
    initialData: "",
    mutationKey: ["notifications", "mark-as-read"],
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await putRequest<string>(WEB_API_MARK_NOTIFICATIONS_AS_READ, payload)

      return message
    },
  })
}

export default useMarkAsRead
