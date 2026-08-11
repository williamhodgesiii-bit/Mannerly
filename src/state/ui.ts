import { create } from 'zustand'

/** Transient UI state (not persisted): global bottom-sheet visibility. */
interface UIState {
  worldMenuOpen: boolean
  chargeOpen: boolean
  openWorldMenu: () => void
  closeWorldMenu: () => void
  openCharge: () => void
  closeCharge: () => void
}

export const useUI = create<UIState>((set) => ({
  worldMenuOpen: false,
  chargeOpen: false,
  openWorldMenu: () => set({ worldMenuOpen: true }),
  closeWorldMenu: () => set({ worldMenuOpen: false }),
  openCharge: () => set({ chargeOpen: true }),
  closeCharge: () => set({ chargeOpen: false }),
}))
