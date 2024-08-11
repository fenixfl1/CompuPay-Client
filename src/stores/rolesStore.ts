import { Roles } from "@/interfaces/user"
import { Metadata } from "@/services/interfaces"
import { create } from "zustand"

interface RolesState {
  roles: Roles[]
  metadata: Metadata
  setRoles: (roles: Roles[]) => void
  setMetadata: (metadata: Metadata) => void
}

const useRolesStore = create<RolesState>((set) => ({
  roles: [],
  metadata: {
    page: 1,
    page_size: 10,
    total: 0,
    next_page: 1,
    previous_page: "",
  },
  setRoles: (roles) => set({ roles }),
  setMetadata: (metadata) => set({ metadata }),
}))

export default useRolesStore
