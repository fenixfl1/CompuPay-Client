import { WEB_API_CHANGE_PASSWORD } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { putRequest } from "@/services/api"

interface ChangePasswordPayload {
  OLD_PASSWORD: string
  NEW_PASSWORD: string
  USER_ID: string
}

function useChangePassword() {
  return useCustomMutation<string, ChangePasswordPayload>({
    initialData: "",
    mutationKey: ["user", "change-password"],
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await putRequest(WEB_API_CHANGE_PASSWORD, payload)

      return `${message}`
    },
  })
}

export default useChangePassword
