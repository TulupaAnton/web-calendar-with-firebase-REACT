// BurgerMenu.jsx
import React, { useState } from 'react'
import styles from './BurgerMenu.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faTimes,
  faCalendarDay,
  faCalendarWeek,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons'
import { useViewModeStore } from '../../../store/viewModeStore'
import Button from '../../../shared/ui/Button/Button'

export const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { viewMode, setViewMode } = useViewModeStore()

  const handleViewSwitch = view => {
    setViewMode(view)
    setIsOpen(false)
  }

  return (
    <div className={styles.burgerContainer}>
      <Button
        variant='text'
        onClick={() => setIsOpen(!isOpen)}
        className={styles.burgerButton}
        icon={isOpen ? faTimes : faBars}
      />

      {isOpen && (
        <div className={styles.menu}>
          <Button
            variant={viewMode === 'day' ? 'primary' : 'secondary'}
            onClick={() => handleViewSwitch('day')}
            icon={faCalendarDay}
            iconPosition='left'
            fullWidth
            className={styles.menuItem}
          >
            День
          </Button>
          <Button
            variant={viewMode === 'week' ? 'primary' : 'secondary'}
            onClick={() => handleViewSwitch('week')}
            icon={faCalendarWeek}
            iconPosition='left'
            fullWidth
            className={styles.menuItem}
          >
            Неделя
          </Button>
          <Button
            variant={viewMode === 'month' ? 'primary' : 'secondary'}
            onClick={() => handleViewSwitch('month')}
            icon={faCalendarAlt}
            iconPosition='left'
            fullWidth
            className={styles.menuItem}
          >
            Месяц
          </Button>
        </div>
      )}
    </div>
  )
}
