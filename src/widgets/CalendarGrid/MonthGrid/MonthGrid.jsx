import React, { useState, useCallback, useMemo } from 'react'
import styles from './MonthGrid.module.css'
import EventModal from '../EventModal/EventModal'
import { useEventStore } from '../../../store/eventStore'

const MonthGrid = React.memo(({ currentDate, events }) => {
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

  const { days, monthStart } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayIndex = new Date(year, month, 1).getDay() || 7
    const blanks = Array(firstDayIndex - 1).fill(null)

    return {
      days: [
        ...blanks,
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
      ],
      monthStart: new Date(year, month, 1)
    }
  }, [currentDate])

  const getEventStyle = useCallback(
    color => ({
      backgroundColor: `${color || '#3a86ff'}20`,
      borderLeft: `2px solid ${color || '#3a86ff'}`,
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
      <div className={styles.monthGrid}>
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
          <div key={day} className={styles.headerCell}>
            {day}
          </div>
        ))}

        {days.map((day, i) => {
          const dayEvents = day
            ? events.filter(event => {
                const eventDate = new Date(event.date)
                return (
                  eventDate.getDate() === day &&
                  eventDate.getMonth() === monthStart.getMonth() &&
                  eventDate.getFullYear() === monthStart.getFullYear()
                )
              })
            : []

          return (
            <div key={i} className={styles.cell}>
              {day && <span className={styles.dayNumber}>{day}</span>}
              {dayEvents.map(event => (
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

export default MonthGrid
