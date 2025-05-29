import { Business, MenuOption, User } from "@/interfaces/user"
import { Metadata, ReturnPayload } from "@/services/interfaces"
import { create } from "zustand"

const initialMetadata: Metadata = {
  page: 1,
  page_size: 10,
  total: 0,
  next_page: 0,
}

interface UserStore {
  users: User[]
  user: User
  metadata: Metadata
  usernameAvailable: boolean
  identityDocumentAvailable: boolean
  businessInfo: Business
  setBusinessInfo: (business: Business) => void
  setUsernameAvailable: (available: boolean) => void
  setDocumentAvailable: (available: boolean) => void
  setUsers: (payload: ReturnPayload<User[]>) => void
  setUser: (user: User) => void
}

const useUserStore = create<UserStore>((set) => ({
  users: [],
  metadata: initialMetadata,
  user: <User>{},
  usernameAvailable: false,
  identityDocumentAvailable: false,
  businessInfo: <Business>{},
  setBusinessInfo: (businessInfo) => set({ businessInfo }),
  setUsernameAvailable: (usernameAvailable) => set({ usernameAvailable }),
  setDocumentAvailable: (identityDocumentAvailable) =>
    set({ identityDocumentAvailable }),
  setUsers: ({ data, metadata }) => set({ users: data, metadata }),
  setUser: (user) => set({ user }),
}))

export default useUserStore
