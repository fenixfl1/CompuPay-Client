import { create } from "zustand"

interface ModalState {
  visible: boolean
  setVisible: (visible: boolean) => void
}

const useModalStore = create<ModalState>((set) => ({
  visible: false,
  setVisible: (visible) => set({ visible }),
}))

export default useModalStore
