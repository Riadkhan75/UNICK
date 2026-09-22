import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import { db } from './config';
import { Product, Order, StoreSettings } from '../types';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'store_config';

/**
 * Initialize Firestore with initial data if collections are empty
 */
export async function seedFirestoreIfEmpty(
  initialProducts: Product[],
  initialOrders: Order[],
  initialSettings: StoreSettings
) {
  try {
    const productsSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (productsSnap.empty) {
      for (const prod of initialProducts) {
        await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), prod);
      }
    }

    const ordersSnap = await getDocs(collection(db, ORDERS_COLLECTION));
    if (ordersSnap.empty) {
      for (const ord of initialOrders) {
        await setDoc(doc(db, ORDERS_COLLECTION, ord.id), ord);
      }
    }

    const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const settingsSnap = await getDocs(collection(db, SETTINGS_COLLECTION));
    if (settingsSnap.empty) {
      await setDoc(settingsDocRef, initialSettings);
    }
  } catch (error) {
    console.warn('Firebase seeding notice (will use local cache if offline):', error);
  }
}

/**
 * Subscribe to Products real-time updates
 */
export function subscribeToProducts(
  onSuccess: (products: Product[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((d) => {
        prods.push(d.data() as Product);
      });
      onSuccess(prods);
    },
    (err) => {
      console.warn('Firestore Products subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Subscribe to Orders real-time updates
 */
export function subscribeToOrders(
  onSuccess: (orders: Order[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, ORDERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const ords: Order[] = [];
      snapshot.forEach((d) => {
        ords.push(d.data() as Order);
      });
      // Sort orders descending by created date
      ords.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      onSuccess(ords);
    },
    (err) => {
      console.warn('Firestore Orders subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Subscribe to Store Settings real-time updates
 */
export function subscribeToSettings(
  onSuccess: (settings: StoreSettings) => void,
  onError?: (err: Error) => void
) {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onSuccess(snapshot.data() as StoreSettings);
      }
    },
    (err) => {
      console.warn('Firestore Settings subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Add or Update a Product in Firestore
 */
export async function saveProductToFirestore(product: Product) {
  const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
  await setDoc(docRef, product, { merge: true });
}

/**
 * Update partial Product in Firestore
 */
export async function updateProductInFirestore(id: string, updates: Partial<Product>) {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, updates);
}

/**
 * Delete a Product in Firestore
 */
export async function deleteProductFromFirestore(id: string) {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Add an Order to Firestore
 */
export async function saveOrderToFirestore(order: Order) {
  const docRef = doc(db, ORDERS_COLLECTION, order.id);
  await setDoc(docRef, order);
}

/**
 * Update Order status/courier info in Firestore
 */
export async function updateOrderInFirestore(id: string, updates: Partial<Order>) {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  await updateDoc(docRef, updates);
}

/**
 * Delete an Order in Firestore
 */
export async function deleteOrderFromFirestore(id: string) {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Update Store Settings in Firestore
 */
export async function saveSettingsToFirestore(settings: StoreSettings) {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  await setDoc(docRef, settings, { merge: true });
}
