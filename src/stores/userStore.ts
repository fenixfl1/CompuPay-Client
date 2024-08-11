import { MenuOption, User } from "@/interfaces/user"
import { Metadata } from "@/services/interfaces"
import { create } from "zustand"

const initialMetadata: Metadata = {
  page: 1,
  page_size: 5,
  total: 0,
  next_page: 0,
}

interface UserStore {
  users: User[]
  user: User
  metadata: Metadata
  setUsers: (users: User[]) => void
  setMetadata: (metadata: Metadata) => void
  setUser: (user: User) => void
}

const useUserStore = create<UserStore>((set) => ({
  users: [],
  metadata: initialMetadata,
  user: <User>{},
  setMetadata: (metadata) => set({ metadata }),
  setUsers: (users) => set({ users }),
  setUser: (user) => set({ user }),
}))

export default useUserStore
