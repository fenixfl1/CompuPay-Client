import { WEB_API_GET_TASK } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Task } from "@/interfaces/task"
import { postRequest } from "@/services/api"
import { Condition } from "@/services/interfaces"
import useTaskStore from "@/stores/taskStore"

function useGetTask() {
  const { setTask } = useTaskStore()

  return useCustomMutation<Task, Condition<Task>>({
    initialData: <Task>{},
    mutationKey: ["tasks", "get-task"],
    onSuccess: setTask,
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Task>(WEB_API_GET_TASK, payload)

      return data
    },
  })
}

export default useGetTask
