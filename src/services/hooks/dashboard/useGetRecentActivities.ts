import { WEB_API_GET_RECENT_ACTIVITIES } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { postRequest } from "@/services/api"
import { GetPayload, ReturnPayload } from "@/services/interfaces"
import useActivityStore from "@/stores/activitiesStore"

const initialData: ReturnPayload<Activity[]> = {
  data: [],
  metadata: {
    page: 1,
    page_size: 10,
    total: 0,
    next_page: 1,
    previous_page: "",
  },
}

function useGetRecentActivities() {
  const { setActivities } = useActivityStore()

  return useCustomMutation<ReturnPayload<Activity[]>, GetPayload>({
    initialData,
    mutationKey: ["dashboard", "get-recent-activities"],
    onSuccess: setActivities,
    mutationFn: async ({ condition, page, size }) => {
      const {
        data: { data, metadata },
      } = await postRequest<Activity[]>(
        `${WEB_API_GET_RECENT_ACTIVITIES}?page=${page}&page_size=${size}`,
        {
          condition,
        }
      )

      return { data, metadata }
    },
  })
}

export default useGetRecentActivities
