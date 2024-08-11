import { WEB_API_UPDATE_USER } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { User } from "@/interfaces/user"
import { putRequest } from "@/services/api"
import useUserStore from "@/stores/userStore"

function useUpdateUser() {
  const { setUser } = useUserStore()
  return useCustomMutation<User, Partial<User>>({
    initialData: <User>{},
    mutationKey: ["users", "update-user"],
    onSuccess: setUser,
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<User>(WEB_API_UPDATE_USER, payload)

      return data
    },
  })
}

export default useUpdateUser
