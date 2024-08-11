import { useCustomMutation } from "@/hooks/useCustomMutation"
import { SessionPayload } from "@/interfaces/user"
import { postRequest } from "@/services/api"
import { WEB_API_PATH_LOGIN } from "@/constants/routes"
import { createSession } from "@/lib/session"
import errorHandler from "@/helpers/errorHandler"

type AuthPayload = {
  username: string
  password: string
  remember?: boolean
}

function useAuthenticateUser() {
  return useCustomMutation<SessionPayload, AuthPayload>({
    initialData: <SessionPayload>{},
    mutationKey: ["users", "authenticate-user"],
    onSuccess: createSession,
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<SessionPayload>(WEB_API_PATH_LOGIN, payload)

      return data
    },
  })
}

export default useAuthenticateUser
