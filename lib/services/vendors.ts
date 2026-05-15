import { firestoreService } from '@/lib/firebase/firestoreService'
import { firebaseAuth } from '@/lib/firebase/authService'
import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

export interface VendorProfile {
  id: string
  userId: string
  businessName: string
  businessCategory: string
  whatsappNumber: string
  description?: string
  rating: number
  reviewsCount: number
  photos: string[]
  verified: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Create a new vendor profile
 */
export async function createVendorProfile(
  vendorData: Omit<VendorProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<VendorProfile | null> {
  try {
    const user = firebaseAuth.getCurrentUser()
    if (!user) {
      console.error('[v0] User not authenticated')
      return null
    }

    const vendorId = await firestoreService.createVendor({
      name: vendorData.businessName,
      description: vendorData.description,
      category: vendorData.businessCategory,
      image: vendorData.photos?.[0],
      rating: vendorData.rating,
      reviews: vendorData.reviewsCount
    })

    // Create vendor profile document
    const docRef = doc(db, 'vendorProfiles', vendorId)
    await updateDoc(docRef, {
      userId: user.uid,
      businessName: vendorData.businessName,
      businessCategory: vendorData.businessCategory,
      whatsappNumber: vendorData.whatsappNumber,
      description: vendorData.description,
      photos: vendorData.photos,
      verified: vendorData.verified,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return {
      id: vendorId,
      userId: user.uid,
      ...vendorData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  } catch (err) {
    console.error('[v0] Error creating vendor profile:', err)
    return null
  }
}

/**
 * Get vendor profile by user ID
 */
export async function getVendorProfile(userId: string): Promise<VendorProfile | null> {
  try {
    const vendorRef = collection(db, 'vendorProfiles')
    const q = query(vendorRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    } as VendorProfile
  } catch (err) {
    console.error('[v0] Error fetching vendor profile:', err)
    return null
  }
}

/**
 * Get current user's vendor profile
 */
export async function getCurrentUserVendorProfile(): Promise<VendorProfile | null> {
  try {
    const user = firebaseAuth.getCurrentUser()
    if (!user) {
      console.error('[v0] User not authenticated')
      return null
    }

    return getVendorProfile(user.uid)
  } catch (err) {
    console.error('[v0] Error getting current user vendor profile:', err)
    return null
  }
}

/**
 * Update vendor profile
 */
export async function updateVendorProfile(
  vendorId: string,
  updates: Partial<Omit<VendorProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<VendorProfile | null> {
  try {
    const docRef = doc(db, 'vendorProfiles', vendorId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    })

    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as VendorProfile
    }

    return null
  } catch (err) {
    console.error('[v0] Error updating vendor profile:', err)
    return null
  }
}

/**
 * Get all vendors in a category
 */
export async function getVendorsByCategory(category: string): Promise<VendorProfile[]> {
  try {
    const vendorsRef = collection(db, 'vendorProfiles')
    const q = query(
      vendorsRef,
      where('businessCategory', '==', category),
      where('verified', '==', true)
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as VendorProfile[]
  } catch (err) {
    console.error('[v0] Error fetching vendors by category:', err)
    return []
  }
}

/**
 * Get all vendors (verified only by default)
 */
export async function getAllVendors(onlyVerified: boolean = true): Promise<VendorProfile[]> {
  try {
    const vendorsRef = collection(db, 'vendorProfiles')
    const q = onlyVerified
      ? query(vendorsRef, where('verified', '==', true))
      : vendorsRef

    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as VendorProfile[]
  } catch (err) {
    console.error('[v0] Error fetching vendors:', err)
    return []
  }
}

/**
 * Add a review/comment to a vendor
 */
export async function addVendorReview(
  vendorId: string,
  rating: number,
  comment: string
): Promise<boolean> {
  try {
    const user = firebaseAuth.getCurrentUser()
    if (!user) {
      console.error('[v0] User not authenticated')
      return false
    }

    // Add review
    await addDoc(collection(db, 'vendorComments'), {
      vendorId,
      userId: user.uid,
      rating: Math.min(5, Math.max(1, rating)),
      comment,
      createdAt: new Date().toISOString()
    })

    // Update vendor rating
    const commentsRef = collection(db, 'vendorComments')
    const q = query(commentsRef, where('vendorId', '==', vendorId))
    const snapshot = await getDocs(q)

    if (snapshot.docs.length > 0) {
      const avgRating =
        snapshot.docs.reduce((sum, doc) => sum + doc.data().rating, 0) / snapshot.docs.length

      await updateVendorProfile(vendorId, {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewsCount: snapshot.docs.length
      })
    }

    return true
  } catch (err) {
    console.error('[v0] Error adding vendor review:', err)
    return false
  }
}

/**
 * Get reviews for a vendor
 */
export async function getVendorReviews(vendorId: string): Promise<any[]> {
  try {
    const commentsRef = collection(db, 'vendorComments')
    const q = query(commentsRef, where('vendorId', '==', vendorId))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (err) {
    console.error('[v0] Error fetching vendor reviews:', err)
    return []
  }
}
