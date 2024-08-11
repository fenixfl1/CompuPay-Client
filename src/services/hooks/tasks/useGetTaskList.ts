import { WEB_API_GET_TASKS_LIST } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Task } from "@/interfaces/task"
import { postRequest } from "@/services/api"
import {
  ReturnPayload,
  GetPayload,
  AdvancedCondition,
} from "@/services/interfaces"
import useTaskStore from "@/stores/taskStore"

const initialData: ReturnPayload<Task[]> = {
  data: [],
  metadata: {
    page: 1,
    page_size: 10,
    total: 0,
  },
}

export type TaskCondition = AdvancedCondition<
  Task & {
    ASSIGNED_USER__username?: string
    ASSIGNED_USER__name?: string
    ASSIGNED_USER__last_name?: string
  }
>[]

function useGetTaskList() {
  const { setTasks } = useTaskStore()

  return useCustomMutation<ReturnPayload<Task[]>, GetPayload<TaskCondition>>({
    initialData,
    mutationKey: ["tasks", "get-task-list"],
    onSuccess: setTasks,
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<Task[]>(
        `${WEB_API_GET_TASKS_LIST}?page=${page}&page_size=${size}`,
        { condition }
      )

      return data
    },
  })
}

export default useGetTaskList
