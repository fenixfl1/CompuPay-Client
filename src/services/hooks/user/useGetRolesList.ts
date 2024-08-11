import { WEB_API_GET_ROLES_LIST } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { Roles } from "@/interfaces/user"
import { postRequest } from "@/services/api"
import { ReturnPayload, GetPayload, ApiResponse } from "@/services/interfaces"
import useRolesStore from "@/stores/rolesStore"

const initialData: ReturnPayload<Roles[]> = {
  data: [],
  metadata: {
    page: 1,
    page_size: 5,
    total: 0,
    next_page: 1,
    previous_page: "",
  },
}

function useGetRolesList() {
  const { setRoles, setMetadata } = useRolesStore()
  return useCustomMutation<ReturnPayload<Roles[]>, GetPayload>({
    initialData,
    mutationKey: ["users", "get-roles-list"],
    onSuccess: ({ data, metadata }) => {
      setRoles(data)
      setMetadata(metadata)
    },
    mutationFn: async ({ condition, page, size }) => {
      const {
        data: { data, metadata },
      } = await postRequest<Roles[]>(
        `${WEB_API_GET_ROLES_LIST}?page=${page}&size=${size}`,
        { condition }
      )

      return { data, metadata }
    },
  })
}

export default useGetRolesList
