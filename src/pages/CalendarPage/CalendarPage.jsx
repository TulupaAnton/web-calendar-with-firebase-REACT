import React, { useState, useEffect } from 'react'
import styles from './CalendarPage.module.css'
import { Header } from '../../widgets/CalendarGrid/Header/Header'
import CalendarGrid from '../../widgets/CalendarGrid/CalendarGrid'
import { useViewModeStore } from '../../store/viewModeStore'
import { useEventStore } from '../../store/eventStore'
import Modal from '../../shared/ui/Modal/Modal'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ColorPicker from '../../shared/ui/ColorPicker/ColorPicker'
import Button from '../../shared/ui/Button/Button'
import AddEventForm from '../../widgets/CalendarGrid/AddEvents/AddEventForm'
import { auth } from '../../firebase-config'
import { onAuthStateChanged } from 'firebase/auth'
import Calendar from '../../shared/ui/Calendar/Calendar'

const DEFAULT_EVENT_COLORS = {
  work: '#3a86ff',
  personal: '#ff006e'
}

export function CalendarPage () {
  const { viewMode } = useViewModeStore()
  const [currentDate, setCurrentDate] = useState(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { events, loadEvents, addEvent } = useEventStore()
  const [eventColors, setEventColors] = useState(() => {
    const savedColors = localStorage.getItem('eventColors')
    return savedColors ? JSON.parse(savedColors) : DEFAULT_EVENT_COLORS
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        loadEvents()
      }
    })
    return () => unsubscribe()
  }, [loadEvents])

  useEffect(() => {
    localStorage.setItem('eventColors', JSON.stringify(eventColors))
  }, [eventColors])

  const handleAddEvent = async eventData => {
    try {
      await addEvent({
        ...eventData,
        color: eventData.color || eventColors[eventData.type]
      })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Ошибка при добавлении события:', error)
    }
  }

  const handleColorChange = (type, color) => {
    setEventColors(prev => ({
      ...prev,
      [type]: color
    }))
  }

  return (
    <div className={styles.page}>
      <Header currentDate={currentDate} onDateChange={setCurrentDate} />

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Настройки цветов</h3>

            <div className={styles.colorSetting}>
              <span className={styles.colorLabel}>Рабочие события:</span>
              <ColorPicker
                defaultColor={eventColors.work}
                onChange={color => handleColorChange('work', color)}
                showPreview={false}
                className={styles.colorPicker}
                presetColors={['#3a86ff', '#4361ee', '#4895ef', '#4cc9f0']}
              />
            </div>

            <div className={styles.colorSetting}>
              <span className={styles.colorLabel}>Личные события:</span>
              <ColorPicker
                defaultColor={eventColors.personal}
                onChange={color => handleColorChange('personal', color)}
                showPreview={false}
                className={styles.colorPicker}
                presetColors={['#ff006e', '#f72585', '#b5179e', '#7209b7']}
              />
            </div>
          </div>

          <Button
            variant='primary'
            icon={faPlus}
            onClick={() => setIsModalOpen(true)}
            fullWidth
            className={styles.addButton}
          >
            Создать событие
          </Button>

          <div className={styles.datePickerContainer}>
            <Calendar value={currentDate} onDateSelect={setCurrentDate} />
          </div>
        </aside>

        <main className={styles.main}>
          <CalendarGrid currentDate={currentDate} events={events} />
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        width='520px'
        padding='0'
        borderRadius='12px'
      >
        <AddEventForm
          onSave={handleAddEvent}
          onCancel={() => setIsModalOpen(false)}
          defaultColors={eventColors}
        />
      </Modal>
    </div>
  )
}

export default CalendarPage
