import React, { useState, useEffect, useRef } from 'react'
import styles from './Header.module.css'
import logo from '../../../shared/assets/images/logo2.jpg'
import Dropdown from '../../../shared/ui/Dropdown/Dropdown'
import { useViewModeStore } from '../../../store/viewModeStore'
import Button from '../../../shared/ui/Button/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDay,
  faCalendarWeek,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faSignOutAlt,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { auth } from '../../../firebase-config'
import { onAuthStateChanged, signOut } from 'firebase/auth'

export function Header ({ currentDate, onDateChange }) {
  const { viewMode, setViewMode } = useViewModeStore()
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const dropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log('User data:', user)
      setUser(user)
    })

    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      unsubscribe()
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setShowDropdown(false)
    } catch (error) {
      console.error('Ошибка при выходе:', error)
    }
  }

  const formatDateTitle = () => {
    switch (viewMode) {
      case 'day':
        return currentDate.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      case 'week':
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1)
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)

        return `${startOfWeek.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'short'
        })} - ${endOfWeek.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}`
      case 'month':
        return currentDate.toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric'
        })
      default:
        return ''
    }
  }

  const changeDate = direction => {
    const newDate = new Date(currentDate)
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
        break
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
        break
    }
    onDateChange(newDate)
  }

  const handleTodayClick = () => onDateChange(new Date())
  const handleViewSwitch = view => {
    setViewMode(view)
    setShowMobileMenu(false)
  }

  const getAvatar = () => {
    if (!user) return null

    if (user.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt='User Avatar'
          className={styles.avatar}
          onError={e => {
            e.target.onerror = null
            e.target.src = `https://ui-avatars.com/api/?name=${
              user.displayName || user.email
            }&background=3a86ff&color=fff`
          }}
        />
      )
    }

    return (
      <div className={styles.avatarPlaceholder}>
        {user.displayName?.charAt(0)?.toUpperCase() ||
          user.email?.charAt(0)?.toUpperCase() ||
          'U'}
      </div>
    )
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img src={logo} alt='Logo' className={styles.logo} />
        <span className={styles.title}>WebCalendar</span>
      </div>

      <div className={styles.center}>
        <div className={styles.dateNavigation}>
          <Button
            variant='text'
            onClick={handleTodayClick}
            className={styles.todayButton}
          >
            Сегодня
          </Button>
          <Button
            variant='text'
            onClick={() => changeDate('prev')}
            icon={faChevronLeft}
            className={styles.navButton}
          />
          <h2 className={styles.dateTitle}>{formatDateTitle()}</h2>
          <Button
            variant='text'
            onClick={() => changeDate('next')}
            icon={faChevronRight}
            className={styles.navButton}
          />
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.viewSwitcher}>
          <Button
            variant={viewMode === 'day' ? 'primary' : 'secondary'}
            onClick={() => handleViewSwitch('day')}
            icon={faCalendarDay}
            iconPosition='left'
            className={styles.viewButton}
          >
            День
          </Button>
          <Button
            variant={viewMode === 'week' ? 'primary' : 'secondary'}
            onClick={() => handleViewSwitch('week')}
            icon={faCalendarWeek}
            iconPosition='left'
            className={styles.viewButton}
          >
            Неделя
          </Button>
          <Button
            variant={viewMode === 'month' ? 'primary' : 'secondary'}
            onClick={() => handleViewSwitch('month')}
            icon={faCalendarAlt}
            iconPosition='left'
            className={styles.viewButton}
          >
            Месяц
          </Button>
        </div>

        <div className={styles.mobileMenuButton}>
          <Button
            variant='text'
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            icon={showMobileMenu ? faTimes : faBars}
            className={styles.burgerButton}
          />
        </div>

        {user && (
          <div ref={dropdownRef} className={styles.userMenu}>
            <div
              className={styles.avatarContainer}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {getAvatar()}
            </div>

            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <div className={styles.userInfo}>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt='User'
                      className={styles.dropdownAvatar}
                      onError={e => {
                        e.target.onerror = null
                        e.target.src = `https://ui-avatars.com/api/?name=${
                          user.displayName || user.email
                        }&background=3a86ff&color=fff&size=60`
                      }}
                    />
                  ) : (
                    <div className={styles.dropdownAvatarPlaceholder}>
                      {user.displayName?.charAt(0)?.toUpperCase() ||
                        user.email?.charAt(0)?.toUpperCase() ||
                        'U'}
                    </div>
                  )}
                  <div className={styles.userName}>
                    {user.displayName || 'Пользователь'}
                  </div>
                  <div className={styles.userEmail}>{user.email || ''}</div>
                </div>
                <Button
                  variant='text'
                  onClick={handleSignOut}
                  className={styles.signOutButton}
                  icon={faSignOutAlt}
                  iconPosition='left'
                >
                  Выйти
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Мобильное меню */}
      {showMobileMenu && (
        <div ref={mobileMenuRef} className={styles.mobileMenu}>
          <Button
            variant={viewMode === 'day' ? 'primary' : 'secondary'}
            onClick={() => handleViewSwitch('day')}
            icon={faCalendarDay}
            iconPosition='left'
            fullWidth
            className={styles.mobileMenuItem}
          >
            День
          </Button>
          <Button
            variant={viewMode === 'week' ? 'primary' : 'secondary'}
            onClick={() => handleViewSwitch('week')}
            icon={faCalendarWeek}
            iconPosition='left'
            fullWidth
            className={styles.mobileMenuItem}
          >
            Неделя
          </Button>
          <Button
            variant={viewMode === 'month' ? 'primary' : 'secondary'}
            onClick={() => handleViewSwitch('month')}
            icon={faCalendarAlt}
            iconPosition='left'
            fullWidth
            className={styles.mobileMenuItem}
          >
            Месяц
          </Button>
        </div>
      )}
    </header>
  )
}
