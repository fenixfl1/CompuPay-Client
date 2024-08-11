import { WEB_API_CREATE_TAG } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Tag } from "@/interfaces/task"
import { postRequest } from "@/services/api"

function useCreateTag() {
  return useCustomMutation<Tag, Tag>({
    initialData: <Tag>{},
    mutationKey: ["tasks", "create-tag"],
    mutationFn: async (payload) => {
      const {
        data: { data },
      } = await postRequest<Tag>(WEB_API_CREATE_TAG, payload)

      return data
    },
  })
}

export default useCreateTag
