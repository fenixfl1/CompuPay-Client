import { create } from "zustand"
import { Metadata, ReturnPayload } from "@/services/interfaces"
import { PayrollEntry, PayrollInfo } from "@/interfaces/payroll"

const metadata: Metadata = {
  page: 1,
  page_size: 10,
  total: 0,
  next_page: 0,
}

interface PayrollStore {
  entries: PayrollEntry[]
  metadata: Metadata
  payrollInfo: PayrollInfo
  setPayrollInfo: (payrollInfo: PayrollInfo) => void
  setPayrollEntries: (payload: ReturnPayload<PayrollEntry[]>) => void
}

const usePayrollStore = create<PayrollStore>((set) => ({
  entries: [],
  metadata,
  payrollInfo: <PayrollInfo>{},
  setPayrollInfo: (payrollInfo) => set({ payrollInfo }),
  setPayrollEntries: ({ data, metadata }) => set({ entries: data, metadata }),
}))

export default usePayrollStore
