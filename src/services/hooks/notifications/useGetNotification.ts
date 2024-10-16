import { WEB_API_GET_NOTIFICATIONS } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { postRequest } from "@/services/api"
import { GetPayload, ReturnPayload } from "@/services/interfaces"
import { Notification } from "@/interfaces/notifications"

const initialData: ReturnPayload<Notification[]> = {
  data: [],
  message: "",
  metadata: {
    page: 1,
    page_size: 10,
    total: 0,
    next_page: 1,
    previous_page: "",
  },
}

function useGetNotifications() {
  return useCustomMutation<ReturnPayload<Notification[]>, GetPayload>({
    initialData,
    mutationKey: ["notifications", "get-notifications"],
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<Notification[]>(
        `${WEB_API_GET_NOTIFICATIONS}?page=${page}&page_size=${size}`,
        { condition }
      )

      return data
    },
  })
}

export default useGetNotifications
