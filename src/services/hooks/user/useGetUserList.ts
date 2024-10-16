import { WEB_API_GET_USER_LIST } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { User } from "@/interfaces/user"
import { postRequest } from "@/services/api"
import { ReturnPayload, GetPayload } from "@/services/interfaces"
import useUserStore from "@/stores/userStore"

const initialData: ReturnPayload<User[]> = {
  data: [],
  message: "",
  metadata: {
    page: 1,
    page_size: 10,
    total: 0,
    next_page: 1,
    previous_page: "",
  },
}

export function useGetUserLIst(storeResponse = true) {
  const { setUsers } = useUserStore()

  return useCustomMutation<ReturnPayload<User[]>, GetPayload<User>>({
    initialData,
    mutationKey: ["users", "get-user-list"],
    onSuccess: storeResponse ? setUsers : undefined,
    mutationFn: async ({ condition, page, size, fields }) => {
      const { data } = await postRequest<User[]>(
        `${WEB_API_GET_USER_LIST}?page=${page}&page_size=${size}`,
        { condition, fields }
      )

      return data
    },
  })
}
