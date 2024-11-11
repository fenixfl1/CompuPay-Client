import { Metadata, ReturnPayload } from "@/services/interfaces"
import { create } from "zustand"

const metadata: Metadata = {
  page: 1,
  page_size: 10,
  total: 0,
  next_page: 0,
}

interface LeaveStore {
  leaves: Leave[]
  leave: Leave
  metadata: Metadata
  setLeave: (leave: Leave) => void
  setLeaves: (payload: ReturnPayload<Leave[]>) => void
}

const useLeaveStore = create<LeaveStore>((set) => ({
  leave: <Leave>{},
  leaves: [],
  metadata,
  setLeave: (leave) => set({ leave }),
  setLeaves: (payload) =>
    set({
      metadata: payload.metadata,
      leaves: payload.data,
    }),
}))

export default useLeaveStore
