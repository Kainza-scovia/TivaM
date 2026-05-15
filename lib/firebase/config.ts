import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDmNZNbse17-BXDFnoDYaThEOQe3wy-Fk8',
  authDomain: 't-i-v-a-maputo-8xr2o9.firebaseapp.com',
  projectId: 't-i-v-a-maputo-8xr2o9',
  storageBucket: 't-i-v-a-maputo-8xr2o9.firebasestorage.app',
  messagingSenderId: '316873624090',
  appId: '1:316873624090:web:e1bc16c41434d02c989fa3'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
