import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Product, Order, Customer, StoreNotification, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const PRODUCTS_COL = 'products';
const ORDERS_COL = 'orders';
const CUSTOMERS_COL = 'customers';
const NOTIFICATIONS_COL = 'notifications';

// 1. Seed Initial Nevada Products if database collection is empty
export async function seedInitialProductsIfEmpty(): Promise<void> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COL));
    if (querySnapshot.empty) {
      console.log('Seeding 12 initial Nevada products into Firestore...');
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, PRODUCTS_COL, prod.id), {
          ...prod,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      console.log('Seeding complete!');
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, PRODUCTS_COL);
  }
}

// 2. Products API
export function subscribeToProducts(callback: (products: Product[]) => void) {
  const colRef = collection(db, PRODUCTS_COL);
  return onSnapshot(colRef, (snapshot) => {
    const list: Product[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Product);
    });
    callback(list);
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, PRODUCTS_COL);
  });
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  const id = 'nv-prod-' + Date.now();
  const path = `${PRODUCTS_COL}/${id}`;
  try {
    const newProd: Product = {
      ...product,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, PRODUCTS_COL, id), newProd);
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    return '';
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const path = `${PRODUCTS_COL}/${id}`;
  try {
    const docRef = doc(db, PRODUCTS_COL, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const path = `${PRODUCTS_COL}/${id}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 3. Orders API & Checkout Workflow
export function subscribeToOrders(callback: (orders: Order[]) => void) {
  const colRef = collection(db, ORDERS_COL);
  return onSnapshot(colRef, (snapshot) => {
    const list: Order[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Order);
    });
    // Sort latest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, ORDERS_COL);
  });
}

export async function createOrder(orderPayload: Omit<Order, 'id' | 'orderCode' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  const orderId = 'nv-ord-' + Date.now();
  const orderCode = `NV-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();
  
  const fullOrder: Order = {
    ...orderPayload,
    id: orderId,
    orderCode,
    createdAt: now,
    updatedAt: now
  };

  try {
    // Save Order to Firestore
    await setDoc(doc(db, ORDERS_COL, orderId), fullOrder);

    // Save or update Customer record
    const customerId = orderPayload.customerEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const custRef = doc(db, CUSTOMERS_COL, customerId);
    const existingCust = await getDoc(custRef);

    if (existingCust.exists()) {
      const data = existingCust.data();
      await updateDoc(custRef, {
        name: orderPayload.customerName,
        phone: orderPayload.customerPhone,
        address: orderPayload.shippingAddress,
        totalOrders: (data.totalOrders || 0) + 1,
        totalSpent: (data.totalSpent || 0) + orderPayload.totalAmount,
        lastOrderAt: now
      });
    } else {
      await setDoc(custRef, {
        id: customerId,
        name: orderPayload.customerName,
        email: orderPayload.customerEmail,
        phone: orderPayload.customerPhone,
        address: orderPayload.shippingAddress,
        totalOrders: 1,
        totalSpent: orderPayload.totalAmount,
        lastOrderAt: now
      });
    }

    // Create Admin Notification for New Order
    const notifId = 'notif-' + Date.now();
    await setDoc(doc(db, NOTIFICATIONS_COL, notifId), {
      id: notifId,
      title: `🛍️ Pesanan Baru ${orderCode}`,
      message: `${orderPayload.customerName} membuat pesanan senilai Rp ${orderPayload.totalAmount.toLocaleString('id-ID')} (${orderPayload.paymentMethod.toUpperCase()})`,
      type: 'new_order',
      orderId,
      read: false,
      createdAt: now
    });

    return fullOrder;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${ORDERS_COL}/${orderId}`);
    throw err;
  }
}

// Upload Payment Proof (Pelanggan upload Bukti Pembayaran)
export async function uploadPaymentProof(orderId: string, proofUrl: string, notes: string = ''): Promise<void> {
  const path = `${ORDERS_COL}/${orderId}`;
  const now = new Date().toISOString();
  try {
    const orderRef = doc(db, ORDERS_COL, orderId);
    const orderSnap = await getDoc(orderRef);
    const orderData = orderSnap.data() as Order | undefined;

    await updateDoc(orderRef, {
      paymentStatus: 'proof_uploaded',
      paymentProofUrl: proofUrl,
      paymentNotes: notes,
      updatedAt: now
    });

    // Create Admin Notification for Payment Approval needed
    const notifId = 'notif-proof-' + Date.now();
    await setDoc(doc(db, NOTIFICATIONS_COL, notifId), {
      id: notifId,
      title: `💳 Bukti Transfer Baru ${orderData?.orderCode || orderId}`,
      message: `${orderData?.customerName || 'Pelanggan'} telah mengunggah bukti pembayaran. Perlu persetujuan Admin!`,
      type: 'proof_uploaded',
      orderId,
      read: false,
      createdAt: now
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// Update Order Status (Admin Approval & Fulfillment)
export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus, 
  rejectionReason?: string, 
  trackingNumber?: string
): Promise<void> {
  const path = `${ORDERS_COL}/${orderId}`;
  const now = new Date().toISOString();
  try {
    const orderRef = doc(db, ORDERS_COL, orderId);
    const orderSnap = await getDoc(orderRef);
    const orderData = orderSnap.data() as Order | undefined;

    const updates: Partial<Order> = {
      paymentStatus: status,
      updatedAt: now
    };

    if (rejectionReason) updates.rejectionReason = rejectionReason;
    if (trackingNumber) updates.trackingNumber = trackingNumber;

    await updateDoc(orderRef, updates);

    // If approved, deduct product stock quantities
    if (status === 'approved' && orderData && orderData.items) {
      for (const item of orderData.items) {
        if (item.productId) {
          const prodRef = doc(db, PRODUCTS_COL, item.productId);
          const prodSnap = await getDoc(prodRef);
          if (prodSnap.exists()) {
            const currentProd = prodSnap.data() as Product;
            const newStock = Math.max(0, currentProd.stock - item.quantity);
            const newSoldCount = currentProd.soldCount + item.quantity;
            await updateDoc(prodRef, {
              stock: newStock,
              soldCount: newSoldCount,
              updatedAt: now
            });
          }
        }
      }
    }

    // Create Notification for Customer Status Change
    const notifId = 'notif-status-' + Date.now();
    let statusText: string = status;
    if (status === 'approved') statusText = 'Pembayaran Disetujui';
    if (status === 'rejected') statusText = 'Pembayaran Ditolak';
    if (status === 'shipped') statusText = 'Pesanan Dikirim (Resi: ' + (trackingNumber || 'Terlampir') + ')';
    if (status === 'completed') statusText = 'Pesanan Selesai';

    await setDoc(doc(db, NOTIFICATIONS_COL, notifId), {
      id: notifId,
      title: `📢 Update Pesanan ${orderData?.orderCode || orderId}`,
      message: `Status pesanan berubah menjadi: ${statusText}`,
      type: 'status_change',
      orderId,
      read: false,
      createdAt: now
    });

  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// 4. Customers API
export function subscribeToCustomers(callback: (customers: Customer[]) => void) {
  const colRef = collection(db, CUSTOMERS_COL);
  return onSnapshot(colRef, (snapshot) => {
    const list: Customer[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Customer);
    });
    list.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
    callback(list);
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, CUSTOMERS_COL);
  });
}

// 5. Notifications API
export function subscribeToNotifications(callback: (notifications: StoreNotification[]) => void) {
  const colRef = collection(db, NOTIFICATIONS_COL);
  return onSnapshot(colRef, (snapshot) => {
    const list: StoreNotification[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as StoreNotification);
    });
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, NOTIFICATIONS_COL);
  });
}

export async function markNotificationRead(id: string): Promise<void> {
  const path = `${NOTIFICATIONS_COL}/${id}`;
  try {
    await updateDoc(doc(db, NOTIFICATIONS_COL, id), { read: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}
