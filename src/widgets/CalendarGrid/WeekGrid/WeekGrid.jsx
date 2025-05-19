import React, { useState, useCallback, useMemo } from 'react'
import styles from './WeekGrid.module.css'
import EventModal from '../EventModal/EventModal'
import { useEventStore } from '../../../store/eventStore'

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const WeekGrid = React.memo(({ currentDate, events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const updateEvent = useEventStore(state => state.updateEvent)
  const deleteEvent = useEventStore(state => state.deleteEvent)

  const handleEventClick = useCallback(event => {
    setSelectedEvent(event)
  }, [])

  const handleSave = useCallback(
    updatedEvent => {
      if (selectedEvent?.id) {
        updateEvent(selectedEvent.id, {
          ...updatedEvent,
          id: selectedEvent.id
        })
      }
      setSelectedEvent(null)
    },
    [selectedEvent, updateEvent]
  )

  const handleDelete = useCallback(() => {
    if (selectedEvent?.id) {
      deleteEvent(selectedEvent.id)
    }
    setSelectedEvent(null)
  }, [selectedEvent, deleteEvent])

  const weekDays = useMemo(() => {
    const startDate = new Date(currentDate)
    startDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      return date
    })
  }, [currentDate])

  const getEventStyle = useCallback(
    color => ({
      backgroundColor: `${color || '#3a86ff'}20`,
      borderLeft: `3px solid ${color || '#3a86ff'}`,
      color: getTextColor(color)
    }),
    []
  )

  const getTextColor = hexColor => {
    if (!hexColor) return '#000000'
    const r = parseInt(hexColor.substr(1, 2), 16)
    const g = parseInt(hexColor.substr(3, 2), 16)
    const b = parseInt(hexColor.substr(5, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? '#000000' : '#FFFFFF'
  }

  return (
    <>
      <div className={styles.weekGrid}>
        {/* Header Row */}
        <div className={styles.timeHeader}></div>
        {weekDays.map((day, i) => (
          <div key={i} className={styles.dayHeader}>
            <div className={styles.dayName}>{daysOfWeek[i]}</div>
            <div className={styles.dayNumber}>{day.getDate()}</div>
          </div>
        ))}

        {/* Time cells & Events */}
        {Array.from({ length: 24 }, (_, hour) => (
          <React.Fragment key={hour}>
            <div className={styles.timeCell}>{`${hour}:00`}</div>
            {weekDays.map((day, i) => {
              const hourEvents = events.filter(event => {
                const eventDate = new Date(event.date)
                return (
                  eventDate.getDate() === day.getDate() &&
                  eventDate.getMonth() === day.getMonth() &&
                  eventDate.getFullYear() === day.getFullYear() &&
                  eventDate.getHours() === hour
                )
              })
              return (
                <div key={i} className={styles.dayColumnCell}>
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      className={styles.event}
                      style={getEventStyle(event.color)}
                      onClick={() => handleEventClick(event)}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>

      {selectedEvent && (
        <EventModal
          isOpen={true}
          onClose={() => setSelectedEvent(null)}
          onSave={handleSave}
          onDelete={handleDelete}
          initialData={selectedEvent}
        />
      )}
    </>
  )
})

export default WeekGrid
