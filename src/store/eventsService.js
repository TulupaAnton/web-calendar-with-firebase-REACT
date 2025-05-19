import { db } from './firebase-config'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

export const addEvent = async (eventData, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      userId,
      createdAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding event:', error)
    throw error
  }
}

export const getEvents = async userId => {
  try {
    const q = query(collection(db, 'events'), where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting events:', error)
    throw error
  }
}

export const updateEvent = async (eventId, updates) => {
  try {
    await updateDoc(doc(db, 'events', eventId), updates)
  } catch (error) {
    console.error('Error updating event:', error)
    throw error
  }
}

export const deleteEvent = async eventId => {
  try {
    await deleteDoc(doc(db, 'events', eventId))
  } catch (error) {
    console.error('Error deleting event:', error)
    throw error
  }
}
