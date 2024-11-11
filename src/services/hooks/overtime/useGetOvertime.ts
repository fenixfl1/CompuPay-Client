import { WEB_API_GET_OVERTIME } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { getRequest } from "@/services/api"
import useOvertimeStore from "@/stores/overtimes"

function useGetOvertime() {
  const { setOvertime } = useOvertimeStore()
  return useCustomMutation<Overtime, number>({
    initialData: <Overtime>{},
    mutationKey: ["overtime", "get-overtime"],
    onSuccess: setOvertime,
    mutationFn: async (overtime_id) => {
      const {
        data: { data },
      } = await getRequest<Overtime>(`${WEB_API_GET_OVERTIME}${overtime_id}`)

      return data
    },
  })
}

export default useGetOvertime
