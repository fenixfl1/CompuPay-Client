import { WEB_API_API_PATH_GET_MENU_OPTIONS } from "@/constants/routes"
import { MenuOption } from "@/interfaces/user"
import { getRequest } from "@/services/api"
import useMenuOptionStore from "@/stores/useMenuOptionStore"
import { useQuery } from "@tanstack/react-query"

function useGetMenuOptions(skip?: boolean) {
  const { setMenuOptions, setParameters } = useMenuOptionStore()
  return useQuery({
    queryKey: ["users", "get-menu-options"],
    enabled: !skip,
    initialData: [],
    queryFn: async () => {
      const {
        data: { data },
      } = await getRequest<MenuOption[]>(WEB_API_API_PATH_GET_MENU_OPTIONS)

      setMenuOptions(data)

      return data
    },
  })
}

export default useGetMenuOptions
