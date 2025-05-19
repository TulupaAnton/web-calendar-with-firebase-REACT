import { create } from 'zustand'
import { auth } from '../firebase-config'

export const useEventStore = create((set, get) => ({
  events: [],

  // Загрузка событий из localStorage
  loadEvents: () => {
    const user = auth.currentUser
    if (user) {
      const savedEvents = localStorage.getItem(`events_${user.uid}`)
      if (savedEvents) {
        set({ events: JSON.parse(savedEvents) })
      }
    }
  },

  // Сохранение событий в localStorage
  saveEvents: () => {
    const user = auth.currentUser
    if (user) {
      localStorage.setItem(`events_${user.uid}`, JSON.stringify(get().events))
    }
  },

  addEvent: event => {
    set(state => {
      const newEvents = [
        ...state.events,
        {
          ...event,
          id: Date.now().toString(),
          userId: auth.currentUser?.uid
        }
      ]
      return { events: newEvents }
    })
    get().saveEvents()
  },

  updateEvent: (id, updates) => {
    set(state => {
      const updatedEvents = state.events.map(event =>
        event.id === id ? { ...event, ...updates } : event
      )
      return { events: updatedEvents }
    })
    get().saveEvents()
  },

  deleteEvent: id => {
    set(state => ({
      events: state.events.filter(event => event.id !== id)
    }))
    get().saveEvents()
  }
}))
