import { WEB_API_GET_LEAVE_LIST } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { postRequest } from "@/services/api"
import { GetPayload, ReturnPayload } from "@/services/interfaces"
import useLeaveStore from "@/stores/leaveStore"

const initialData: ReturnPayload<Leave[]> = {
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

function useGetLeaveList() {
  const { setLeaves } = useLeaveStore()

  return useCustomMutation<ReturnPayload<Leave[]>, GetPayload>({
    initialData,
    mutationKey: ["leaves", "get-leave-list"],
    onSuccess: setLeaves,
    onError: () => setLeaves(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<Leave[]>(
        `${WEB_API_GET_LEAVE_LIST}?page=${page}&page_size=${size}`,
        { condition }
      )

      return data
    },
  })
}

export default useGetLeaveList
