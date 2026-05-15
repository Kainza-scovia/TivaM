import { firestoreService } from '@/lib/firebase/firestoreService'
import { firebaseAuth } from '@/lib/firebase/authService'

export interface SavedPlace {
  id: string
  userId: string
  vendorId: string
  vendorName: string
  category: string
  image?: string
  savedAt: string
}

/**
 * Add a place to user's favorites in the database
 */
export async function savePlace(
  vendorName: string,
  vendorId: string,
  category: string,
  image?: string
): Promise<SavedPlace | null> {
  try {
    const user = firebaseAuth.getCurrentUser()
    if (!user) {
      console.error('[v0] User not authenticated')
      return null
    }

    const savedPlaceId = await firestoreService.addSavedPlace({
      userId: user.uid,
      vendorId,
      vendorName,
      category,
      image
    })

    return {
      id: savedPlaceId,
      userId: user.uid,
      vendorId,
      vendorName,
      category,
      image,
      savedAt: new Date().toISOString()
    }
  } catch (err) {
    console.error('[v0] Error saving place:', err)
    return null
  }
}

/**
 * Remove a place from user's favorites
 */
export async function removeSavedPlace(vendorId: string): Promise<boolean> {
  try {
    const user = firebaseAuth.getCurrentUser()
    if (!user) {
      console.error('[v0] User not authenticated')
      return false
    }

    await firestoreService.removeSavedPlaceByVendor(user.uid, vendorId)
    return true
  } catch (err) {
    console.error('[v0] Error removing saved place:', err)
    return false
  }
}

/**
 * Get all saved places for the current user
 */
export async function getUserSavedPlaces(): Promise<SavedPlace[]> {
  try {
    const user = firebaseAuth.getCurrentUser()
    if (!user) {
      console.error('[v0] User not authenticated')
      return []
    }

    return await firestoreService.getSavedPlaces(user.uid)
  } catch (err) {
    console.error('[v0] Error fetching saved places:', err)
    return []
  }
}

/**
 * Check if a place is saved by the current user
 */
export async function isPlaceSaved(vendorId: string): Promise<boolean> {
  try {
    const user = firebaseAuth.getCurrentUser()
    if (!user) {
      return false
    }

    const savedPlaces = await firestoreService.getSavedPlaces(user.uid)
    return savedPlaces.some((place) => place.vendorId === vendorId)
  } catch (err) {
    console.error('[v0] Error checking if place is saved:', err)
    return false
  }
}
