import { WEB_API_CREATE_TASK } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Task } from "@/interfaces/task"
import { postRequest } from "@/services/api"
import useTaskStore from "@/stores/taskStore"

function useCreateTask() {
  const { setTask } = useTaskStore()

  return useCustomMutation<Task, Task>({
    initialData: <Task>{},
    mutationKey: ["tasks", "create-task"],
    onSuccess: setTask,
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Task>(WEB_API_CREATE_TASK, payload)

      return data
    },
  })
}

export default useCreateTask
