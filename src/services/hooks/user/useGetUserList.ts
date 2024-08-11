import { WEB_API_GET_USER_LIST } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { User } from "@/interfaces/user"
import { postRequest } from "@/services/api"
import { ReturnPayload, GetPayload } from "@/services/interfaces"
import useUserStore from "@/stores/userStore"

const initialData: ReturnPayload<User[]> = {
  data: [],
  metadata: {
    page: 1,
    page_size: 5,
    total: 0,
    next_page: 1,
    previous_page: "",
  },
}

export function useGetUserLIst() {
  const { setUsers, setMetadata } = useUserStore()

  return useCustomMutation<ReturnPayload<User[]>, GetPayload>({
    initialData,
    mutationKey: ["users", "get-user-list"],
    onSuccess: ({ data, metadata }) => {
      setUsers(data)
      setMetadata(metadata)
    },
    mutationFn: async ({ condition, page, size }) => {
      const {
        data: { data, metadata, message },
      } = await postRequest<User[]>(
        `${WEB_API_GET_USER_LIST}?page=${page}&page_size=${size}`,
        { condition }
      )

      return { data, metadata, message }
    },
  })
}
