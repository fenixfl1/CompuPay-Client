import { WEB_API_UPDATE_TASK } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Task } from "@/interfaces/task"
import { putRequest } from "@/services/api"
import useTaskStore from "@/stores/taskStore"

function useUpdateTask() {
  const { setTask } = useTaskStore()

  return useCustomMutation<Task, Partial<Task>>({
    initialData: <Task>{},
    mutationKey: ["tasks", "update-task"],
    onSuccess: setTask,
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<Task>(WEB_API_UPDATE_TASK, payload)

      return data
    },
  })
}

export default useUpdateTask
