import { WEB_API_PATH_UPDATE_AVATAR } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { User } from "@/interfaces/user"
import { putRequest } from "@/services/api"

function useUpdateAvatar() {
  return useCustomMutation<string, Pick<User, "AVATAR" | "USERNAME">>({
    initialData: "",
    mutationKey: ["users", "update_avatar"],
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await putRequest<string>(WEB_API_PATH_UPDATE_AVATAR, payload)

      return message
    },
  })
}

export default useUpdateAvatar
