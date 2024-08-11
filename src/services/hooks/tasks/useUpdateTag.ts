import { WEB_API_UPDATE_TAG } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Tag } from "@/interfaces/task"
import { putRequest } from "@/services/api"

function useUpdateTag() {
  return useCustomMutation<Tag, Partial<Tag>>({
    initialData: <Tag>{},
    mutationKey: ["tasks", "update-tag"],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await putRequest<Tag>(WEB_API_UPDATE_TAG, payload)

      return data
    },
  })
}

export default useUpdateTag
