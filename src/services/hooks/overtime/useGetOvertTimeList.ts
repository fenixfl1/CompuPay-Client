import { WEB_API_GET_OVERTIME_LIST } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { postRequest } from "@/services/api"
import { GetPayload, ReturnPayload } from "@/services/interfaces"
import useOvertimeStore from "@/stores/overtimes"

const initialData: ReturnPayload<Overtime[]> = {
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

function useGetOvertimeList() {
  const { setOvertimeList } = useOvertimeStore()

  return useCustomMutation<ReturnPayload<Overtime[]>, GetPayload>({
    initialData,
    mutationKey: ["overtime", "get-overtime-list"],
    onSuccess: setOvertimeList,
    onError: () => setOvertimeList(initialData),
    mutationFn: async ({ condition, page, size }) => {
      const { data } = await postRequest<Overtime[]>(
        `${WEB_API_GET_OVERTIME_LIST}?page=${page}&page_size=${size}`,
        { condition }
      )

      return data
    },
  })
}

export default useGetOvertimeList
