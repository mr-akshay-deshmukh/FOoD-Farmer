import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  setDoc, 
  getDoc,
  collection,
  onSnapshot,
  query,
  type Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Custom parameters to ensure account selection prompt
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Sync user profile to Firestore
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userDocRef);
    const now = new Date().toISOString();
    
    if (!existing.exists()) {
      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Food Rescue Champion',
        photoURL: user.photoURL || '',
        role: 'volunteer',
        createdAt: now,
        lastLoginAt: now,
      });
    } else {
      await setDoc(userDocRef, {
        lastLoginAt: now,
      }, { merge: true });
    }
  } catch (error) {
    console.warn('Could not sync user profile to Firestore:', error);
  }

  return user;
}

export async function logOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Connection test as required by skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Persist user's ₹1 claim in Firestore
export async function saveUserClaimToFirestore(userId: string, claimData: {
  id: string;
  listingId: string;
  title: string;
  sourceName: string;
  portionsClaimed: number;
  token: string;
  status: string;
}) {
  const path = `users/${userId}/claims/${claimData.id}`;
  try {
    const claimDoc = doc(db, 'users', userId, 'claims', claimData.id);
    await setDoc(claimDoc, {
      ...claimData,
      userId,
      claimedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// Persist user's surplus food listing in Firestore
export async function saveUserListingToFirestore(userId: string, listingData: {
  id: string;
  sourceName: string;
  title: string;
  portions: number;
  location: string;
  contactPerson: string;
  phone: string;
  isVegetarian: boolean;
}) {
  const path = `users/${userId}/listings/${listingData.id}`;
  try {
    const listingDoc = doc(db, 'users', userId, 'listings', listingData.id);
    await setDoc(listingDoc, {
      ...listingData,
      userId,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// Persist user's verified intake in Firestore
export async function saveUserIntakeToFirestore(userId: string, intakeData: {
  id: string;
  tokenCode: string;
  title: string;
  manifestId: string;
  status: string;
}) {
  const path = `users/${userId}/intakes/${intakeData.id}`;
  try {
    const intakeDoc = doc(db, 'users', userId, 'intakes', intakeData.id);
    await setDoc(intakeDoc, {
      ...intakeData,
      userId,
      verifiedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// Real-time listener for user's claims
export function subscribeUserClaims(userId: string, onUpdate: (claims: any[]) => void): Unsubscribe {
  const path = `users/${userId}/claims`;
  const claimsCol = collection(db, 'users', userId, 'claims');
  return onSnapshot(claimsCol, (snapshot) => {
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    onUpdate(data);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, path);
  });
}

// Real-time listener for user's listings
export function subscribeUserListings(userId: string, onUpdate: (listings: any[]) => void): Unsubscribe {
  const path = `users/${userId}/listings`;
  const listingsCol = collection(db, 'users', userId, 'listings');
  return onSnapshot(listingsCol, (snapshot) => {
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    onUpdate(data);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, path);
  });
}

// Real-time listener for user's intakes
export function subscribeUserIntakes(userId: string, onUpdate: (intakes: any[]) => void): Unsubscribe {
  const path = `users/${userId}/intakes`;
  const intakesCol = collection(db, 'users', userId, 'intakes');
  return onSnapshot(intakesCol, (snapshot) => {
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    onUpdate(data);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, path);
  });
}
