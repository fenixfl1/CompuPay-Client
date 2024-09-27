import { WEB_API_GET_TASK_PERFORMANCE } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { postRequest } from "@/services/api"
import { Condition } from "@/services/interfaces"

type GetTaskPerformancePayload = Condition<{
  date_range?: [string, string]
}>

const initialData: TaskPerformance = {
  performance: [],
  departments: [],
}

function useGetTaskPerformance() {
  return useCustomMutation<TaskPerformance, GetTaskPerformancePayload>({
    initialData,
    mutationKey: ["dashboard", "get-task-performance"],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<TaskPerformance>(
        WEB_API_GET_TASK_PERFORMANCE,
        payload
      )

      return data
    },
  })
}

export default useGetTaskPerformance
