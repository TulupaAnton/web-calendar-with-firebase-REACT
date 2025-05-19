import React, { useMemo } from 'react'
import DayGrid from './DayGrid/DayGrid'
import WeekGrid from './WeekGrid/WeekGrid'
import MonthGrid from './MonthGrid/MonthGrid'
import { useViewModeStore } from '../../store/viewModeStore'
import { useEventStore } from '../../store/eventStore'
import { shallow } from 'zustand/shallow'

// Выносим селекторы в отдельные константы для мемоизации
const eventSelectors = {
  day: (state, date) =>
    state.events.filter(e => {
      const d = new Date(e.date)
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      )
    }),
  week: (state, date) => {
    const start = new Date(date)
    start.setDate(date.getDate() - date.getDay())
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return state.events.filter(e => {
      const d = new Date(e.date)
      return d >= start && d <= end
    })
  },
  month: (state, date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return state.events.filter(e => {
      const d = new Date(e.date)
      return d >= start && d <= end
    })
  }
}

const CalendarGrid = React.memo(({ currentDate }) => {
  const { viewMode } = useViewModeStore()

  // Получаем все события один раз
  const allEvents = useEventStore(state => state.events, shallow)

  // Фильтруем события вручную без использования селекторов хранилища
  const filteredEvents = useMemo(() => {
    const date = new Date(currentDate)
    return eventSelectors[viewMode]({ events: allEvents }, date)
  }, [viewMode, currentDate, allEvents])

  return useMemo(() => {
    switch (viewMode) {
      case 'day':
        return <DayGrid currentDate={currentDate} events={filteredEvents} />
      case 'week':
        return <WeekGrid currentDate={currentDate} events={filteredEvents} />
      case 'month':
        return <MonthGrid currentDate={currentDate} events={filteredEvents} />
      default:
        return null
    }
  }, [viewMode, currentDate, filteredEvents])
})

export default CalendarGrid
