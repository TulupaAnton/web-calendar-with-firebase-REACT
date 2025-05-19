import React, { useState, useMemo } from 'react'
import styles from './DayGrid.module.css'
import EventModal from '../EventModal/EventModal'
import { useEventStore } from '../../../store/eventStore'

const DayGrid = React.memo(({ currentDate }) => {
  const events = useEventStore(state => state.events)
  const updateEvent = useEventStore(state => state.updateEvent)
  const deleteEvent = useEventStore(state => state.deleteEvent)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const dayEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === currentDate.getDate() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      )
    })
  }, [events, currentDate])

  const getEventsForHour = hour => {
    return dayEvents.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getHours() === hour
    })
  }

  const getEventStyle = color => ({
    backgroundColor: `${color || '#3a86ff'}20`,
    borderLeft: `3px solid ${color || '#3a86ff'}`,
    color: getTextColor(color)
  })

  const getTextColor = hexColor => {
    if (!hexColor) return '#000000'
    const r = parseInt(hexColor.substr(1, 2), 16)
    const g = parseInt(hexColor.substr(3, 2), 16)
    const b = parseInt(hexColor.substr(5, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? '#000000' : '#FFFFFF'
  }

  const handleSave = updatedEvent => {
    if (selectedEvent?.id) {
      updateEvent(selectedEvent.id, updatedEvent)
    }
    setSelectedEvent(null)
  }

  const handleDelete = () => {
    if (selectedEvent?.id) {
      deleteEvent(selectedEvent.id)
    }
    setSelectedEvent(null)
  }

  return (
    <>
      <div className={styles.grid}>
        <div className={styles.timeColumn}>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className={styles.timeCell}>
              {`${i}:00`}
            </div>
          ))}
        </div>

        <div className={styles.dayColumn}>
          {Array.from({ length: 24 }, (_, hour) => {
            const hourEvents = getEventsForHour(hour)
            return (
              <div key={hour} className={styles.dayCell}>
                {hourEvents.map(event => {
                  const eventDate = new Date(event.date)
                  const minutes = String(eventDate.getMinutes()).padStart(
                    2,
                    '0'
                  )
                  const top = (eventDate.getMinutes() / 60) * 100
                  const duration = event.duration || 60
                  const height = (duration / 60) * 100

                  return (
                    <div
                      key={event.id}
                      className={styles.event}
                      style={{
                        ...getEventStyle(event.color),
                        top: `${top}%`,
                        height: `${height}%`
                      }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <span className={styles.eventTime}>
                        {`${eventDate.getHours()}:${minutes}`}
                      </span>
                      <span className={styles.eventTitle}>{event.title}</span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
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

export default DayGrid
