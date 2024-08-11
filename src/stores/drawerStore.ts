import { create } from "zustand"

interface DrawerState {
  open: boolean
  setOpenDrawer: (visible: boolean) => void
}

const useDrawerStore = create<DrawerState>((set) => ({
  open: false,
  setOpenDrawer: (open) => set({ open }),
}))

export default useDrawerStore
