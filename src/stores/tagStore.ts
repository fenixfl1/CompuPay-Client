import { Tag } from "@/interfaces/task"
import { create } from "zustand"

interface TagState {
  tags: Tag[]
  setTags: (tags: Tag[]) => void
}

const useTagStore = create<TagState>((set) => ({
  tags: [],
  setTags: (tags) => set({ tags }),
}))

export default useTagStore
