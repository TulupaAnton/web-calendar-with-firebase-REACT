import { useEffect, useState } from 'react'
import { auth } from '../firebase-config'
import { onAuthStateChanged } from 'firebase/auth'

import styles from './App.module.css'
import CalendarPage from '../pages/CalendarPage/CalendarPage'
import { Auth } from '../Auth'

function App () {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  return <div className={styles.app}>{user ? <CalendarPage /> : <Auth />}</div>
}

export default App
