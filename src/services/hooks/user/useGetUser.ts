import { WEB_API_GET_USER } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { User } from "@/interfaces/user"
import { postRequest } from "@/services/api"
import { Condition } from "@/services/interfaces"
import useUserStore from "@/stores/userStore"

function useGetUser() {
  const { setUser } = useUserStore()

  return useCustomMutation<User, Condition<User>>({
    initialData: <User>{},
    mutationKey: ["user", "get-single-user"],
    onSuccess: (data) => {
      // eslint-disable-next-line no-console
      console.log({ data })
      setUser(data)
    },
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<User>(WEB_API_GET_USER, payload)

      return data
    },
  })
}

export default useGetUser
