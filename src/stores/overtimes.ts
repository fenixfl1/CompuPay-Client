import { Metadata, ReturnPayload } from "@/services/interfaces"
import { create } from "zustand"

const metadata: Metadata = {
  page: 1,
  page_size: 10,
  total: 0,
  next_page: 0,
}

interface OvertimeStore {
  overtimeList: Overtime[]
  overtime: Overtime
  metadata: Metadata
  setOvertime: (overtime: Overtime) => void
  setOvertimeList: (payload: ReturnPayload<Overtime[]>) => void
}

const useOvertimeStore = create<OvertimeStore>((set) => ({
  overtime: <Overtime>{},
  overtimeList: [],
  metadata,
  setOvertime: (overtime) => set({ overtime }),
  setOvertimeList: (payload) =>
    set({
      overtimeList: payload.data,
      metadata: payload.metadata,
    }),
}))

export default useOvertimeStore
