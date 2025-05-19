import { useState, useEffect } from 'react'
import { auth } from './firebase-config'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { signInWithGoogle } from './firebase-config'

import styles from './Auth.module.css'
import Button from './shared/ui/Button/Button'

export function Auth () {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user)
      setLoading(false)
      setError(null)
    })
    return () => unsubscribe()
  }, [])

  const handleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      await signInWithGoogle()
    } catch (err) {
      setError('Не удалось войти. Проверьте консоль для подробностей.')
      console.error('Детали ошибки:', {
        code: err.code,
        message: err.message,
        fullError: err
      })
      setLoading(false)
    }
  }

  if (loading) return <div className={styles.loading}>Загрузка...</div>

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      {user ? (
        <div>
          <p>Вы вошли как: {user.email}</p>
          <Button onClick={() => signOut(auth)}>Выйти</Button>
        </div>
      ) : (
        <Button onClick={handleSignIn} disabled={loading}>
          Войти через Google
        </Button>
      )}
    </div>
  )
}
