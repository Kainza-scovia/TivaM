import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth'
import { auth } from './config'

export interface AuthError {
  code: string
  message: string
}

export const firebaseAuth = {
  // Sign up with email and password
  async signup(email: string, password: string): Promise<User | null> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message
      }
    }
  },

  // Sign in with email and password
  async signin(email: string, password: string): Promise<User | null> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message
      }
    }
  },

  // Send password reset email
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message
      }
    }
  },

  // Reset password with code
  async resetPassword(code: string, newPassword: string): Promise<void> {
    try {
      await confirmPasswordReset(auth, code, newPassword)
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message
      }
    }
  },

  // Sign out
  async logout(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message
      }
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback)
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser
  }
}
