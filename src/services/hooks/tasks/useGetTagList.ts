import { WEB_API_GET_TAGS_LIST } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Tag } from "@/interfaces/task"
import { postRequest } from "@/services/api"
import { AdvancedCondition } from "@/services/interfaces"
import useTagStore from "@/stores/tagStore"

function useGetTagList() {
  const { setTags } = useTagStore()

  return useCustomMutation<Tag[], AdvancedCondition<Tag>[]>({
    initialData: [],
    mutationKey: ["tasks", "get-tag-list"],
    onSuccess: setTags,
    mutationFn: async (condition) => {
      const {
        data: { data },
      } = await postRequest<Tag[]>(WEB_API_GET_TAGS_LIST, { condition })

      return data
    },
  })
}

export default useGetTagList
