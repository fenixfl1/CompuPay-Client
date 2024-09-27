import { Metadata, ReturnPayload } from "@/services/interfaces"
import { create } from "zustand"

const metadata: Metadata = {
  page: 1,
  page_size: 10,
  total: 0,
  next_page: 0,
}

interface ActivityState {
  activities: Activity[]
  metadata: Metadata
  setActivities: (payload: ReturnPayload<Activity[]>) => void
}

const useActivityStore = create<ActivityState>((set) => ({
  activities: new Array<Activity>(),
  metadata,
  setActivities: (payload) =>
    set({ activities: payload.data, metadata: payload.metadata }),
}))

export default useActivityStore
