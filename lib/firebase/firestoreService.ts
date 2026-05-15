import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  Unsubscribe,
  writeBatch
} from 'firebase/firestore'
import { db } from './config'

export interface Vendor {
  id?: string
  name: string
  description?: string
  category: string
  location?: string
  rating?: number
  reviews?: number
  image?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface SavedPlace {
  id?: string
  userId: string
  vendorId: string
  vendorName: string
  category: string
  image?: string
  savedAt?: Date
}

export const firestoreService = {
  // VENDORS
  async getVendors(category?: string): Promise<Vendor[]> {
    try {
      const vendorsRef = collection(db, 'vendors')
      const q = category
        ? query(vendorsRef, where('category', '==', category))
        : vendorsRef

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Vendor[]
    } catch (error) {
      console.error('[v0] Error getting vendors:', error)
      throw error
    }
  },

  async getVendorById(vendorId: string): Promise<Vendor | null> {
    try {
      const docRef = doc(db, 'vendors', vendorId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Vendor
      }
      return null
    } catch (error) {
      console.error('[v0] Error getting vendor:', error)
      throw error
    }
  },

  async createVendor(vendor: Vendor): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'vendors'), {
        ...vendor,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (error) {
      console.error('[v0] Error creating vendor:', error)
      throw error
    }
  },

  async updateVendor(vendorId: string, updates: Partial<Vendor>): Promise<void> {
    try {
      const docRef = doc(db, 'vendors', vendorId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('[v0] Error updating vendor:', error)
      throw error
    }
  },

  async deleteVendor(vendorId: string): Promise<void> {
    try {
      const docRef = doc(db, 'vendors', vendorId)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('[v0] Error deleting vendor:', error)
      throw error
    }
  },

  // SAVED PLACES
  async getSavedPlaces(userId: string): Promise<SavedPlace[]> {
    try {
      const savedRef = collection(db, 'savedPlaces')
      const q = query(savedRef, where('userId', '==', userId))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as SavedPlace[]
    } catch (error) {
      console.error('[v0] Error getting saved places:', error)
      throw error
    }
  },

  async addSavedPlace(savedPlace: SavedPlace): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'savedPlaces'), {
        ...savedPlace,
        savedAt: new Date()
      })
      return docRef.id
    } catch (error) {
      console.error('[v0] Error adding saved place:', error)
      throw error
    }
  },

  async removeSavedPlace(savedPlaceId: string): Promise<void> {
    try {
      const docRef = doc(db, 'savedPlaces', savedPlaceId)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('[v0] Error removing saved place:', error)
      throw error
    }
  },

  async removeSavedPlaceByVendor(userId: string, vendorId: string): Promise<void> {
    try {
      const savedRef = collection(db, 'savedPlaces')
      const q = query(
        savedRef,
        where('userId', '==', userId),
        where('vendorId', '==', vendorId)
      )
      const snapshot = await getDocs(q)
      snapshot.docs.forEach((document) => {
        deleteDoc(document.ref)
      })
    } catch (error) {
      console.error('[v0] Error removing saved place by vendor:', error)
      throw error
    }
  },

  // REAL-TIME LISTENERS
  onVendorsChange(
    callback: (vendors: Vendor[]) => void,
    category?: string
  ): Unsubscribe {
    const vendorsRef = collection(db, 'vendors')
    const q = category
      ? query(vendorsRef, where('category', '==', category))
      : vendorsRef

    return onSnapshot(q, (snapshot) => {
      const vendors = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Vendor[]
      callback(vendors)
    })
  },

  onSavedPlacesChange(userId: string, callback: (places: SavedPlace[]) => void): Unsubscribe {
    const savedRef = collection(db, 'savedPlaces')
    const q = query(savedRef, where('userId', '==', userId))

    return onSnapshot(q, (snapshot) => {
      const places = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as SavedPlace[]
      callback(places)
    })
  }
}
