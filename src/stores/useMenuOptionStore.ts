import { MenuOption } from "@/interfaces/user"
import { create } from "zustand"

interface MenuOptionState<T = any> {
  menuOptions: MenuOption<T>[]
  selectedMenuOption: MenuOption<T>
  parameters: T
  setParameters: (parameters: T) => void
  setMenuOptions: (menuOptions: MenuOption<T>[]) => void
  setSelectedMenuOption: (selectedMenuOption: MenuOption<T>) => void
}

const menuOptionStore = create<MenuOptionState>((set) => ({
  menuOptions: [],
  selectedMenuOption: <MenuOption>{},
  parameters: <any>{},
  setMenuOptions: (menuOptions) => set({ menuOptions }),
  setParameters: (parameters) => {
    sessionStorage.setItem("parameters", JSON.stringify(parameters))
    set({ parameters })
  },
  setSelectedMenuOption: (selectedMenuOption) => {
    sessionStorage.setItem(
      "selectedMenuOption",
      JSON.stringify(selectedMenuOption)
    )
    set({ selectedMenuOption })
  },
}))

function useMenuOptionStore<T = unknown>() {
  return menuOptionStore() as MenuOptionState<T>
}

export default useMenuOptionStore
