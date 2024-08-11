import { WEB_API_CREATE_USER } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { User } from "@/interfaces/user"
import { postRequest } from "@/services/api"

function useCreateUser() {
  return useCustomMutation<User, User>({
    initialData: <User>{},
    mutationKey: ["users", "create-user"],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<User>(WEB_API_CREATE_USER, payload)

      return data
    },
  })
}

export default useCreateUser
