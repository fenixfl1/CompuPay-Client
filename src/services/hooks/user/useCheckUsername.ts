import { WEB_API_PATH_CHECK_USERNAME } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { postRequest } from "@/services/api"
import useUserStore from "@/stores/userStore"

function useCheckUsername() {
  const { setUsernameAvailable } = useUserStore()

  return useCustomMutation<string, { USERNAME: string }>({
    initialData: "",
    mutationKey: ["users", "check-username"],
    onSuccess: () => setUsernameAvailable(true),
    onError: () => setUsernameAvailable(false),
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await postRequest<string>(WEB_API_PATH_CHECK_USERNAME, payload)

      return message
    },
  })
}

export default useCheckUsername
