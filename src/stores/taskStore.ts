import { create } from "zustand"
import { Task } from "@/interfaces/task"
import { Metadata, ReturnPayload } from "@/services/interfaces"

interface TaskState {
  tasks: Task[]
  task: Task
  metadata: Metadata
  setTasks: (data: ReturnPayload<Task[]>) => void
  setTask: (task: Task) => void
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  task: {} as Task,
  metadata: {
    page: 1,
    page_size: 10,
    total: 0,
  },
  setTasks: ({ data, metadata }) => set({ tasks: data, metadata }),
  setTask: (task) => set({ task }),
}))

export default useTaskStore
