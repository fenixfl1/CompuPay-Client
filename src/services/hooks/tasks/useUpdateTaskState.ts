import { WEB_API_UPDATE_TASK_STATE } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Task } from "@/interfaces/task"
import { putRequest } from "@/services/api"

function useUpdateTaskState() {
  return useCustomMutation<string, Pick<Task, "COMPLETED" | "TASK_ID">>({
    initialData: "",
    mutationKey: ["tasks", "update-task-state"],
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await putRequest(WEB_API_UPDATE_TASK_STATE, payload)

      return message
    },
  })
}

export default useUpdateTaskState
