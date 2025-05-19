import { create } from 'zustand'

export const useViewModeStore = create(set => ({
  viewMode: 'week',
  setViewMode: mode => set({ viewMode: mode })
}))
