import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAAqCJXxVJX9FDZJe2ky6dfnpjTmIRtT54',
  authDomain: 'my-app-a32b6.firebaseapp.com',
  projectId: 'my-app-a32b6',
  storageBucket: 'my-app-a32b6.firebasestorage.app',
  messagingSenderId: '274866374987',
  appId: '1:274866374987:web:9e1153068094d12a1840ce',
  measurementId: 'G-5XKC6ZBDVY'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
auth.languageCode = 'ru' // Устанавливаем язык интерфейса

const provider = new GoogleAuthProvider()
provider.setCustomParameters({
  prompt: 'select_account' // Всегда показывать выбор аккаунта
})

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    // Принудительно запрашиваем профиль
    await updateProfile(result.user, {
      displayName: result.user.displayName,
      photoURL:
        result.user.photoURL ||
        `https://ui-avatars.com/api/?name=${
          result.user.displayName || result.user.email
        }`
    })
    return result.user
  } catch (error) {
    console.error('Ошибка входа:', error)
    throw error
  }
}

export { auth }
