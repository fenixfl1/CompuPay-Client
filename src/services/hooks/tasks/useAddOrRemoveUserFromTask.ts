import { WEB_API_ADD_OR_REMOVE_USER_FROM_TASK } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { postRequest } from "@/services/api"

interface AddRemoveUserPayload {
  TASK_ID: number
  ASSIGNED_USERS: string[]
}

function useAddOrRemoveUserFromTask() {
  return useCustomMutation<string, AddRemoveUserPayload>({
    initialData: "",
    mutationKey: ["tasks", "add-remove-user-from-task"],
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await postRequest(WEB_API_ADD_OR_REMOVE_USER_FROM_TASK, payload)

      return message
    },
  })
}

export default useAddOrRemoveUserFromTask
