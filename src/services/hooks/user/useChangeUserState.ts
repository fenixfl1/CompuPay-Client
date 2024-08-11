import { WEB_API_CHANGE_USER_STATE } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { putRequest } from "@/services/api"

interface ChangeUserStatePayload {
  USER_ID: number
  STATE: string
}

export function useChangeUserState() {
  return useCustomMutation<string, ChangeUserStatePayload>({
    initialData: "",
    mutationKey: ["users", "change-user-state"],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<string>(WEB_API_CHANGE_USER_STATE, payload)

      return data
    },
  })
}
