import { 
  collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { 
  YardBlock, Equipment, Berth, ContainerCategory, ShippingLine, 
  VesselCall, GateTransaction, ContainerJob 
} from '../types/terminal';
import { 
  INITIAL_YARD_BLOCKS, INITIAL_EQUIPMENTS, INITIAL_BERTHS, 
  INITIAL_CONTAINER_CATEGORIES, INITIAL_SHIPPING_LINES, 
  INITIAL_VESSEL_CALLS, INITIAL_GATE_TRANSACTIONS, INITIAL_CONTAINER_JOBS 
} from '../data/initialTerminalData';

const YARD_BLOCKS_COL = 'yardBlocks';
const EQUIPMENTS_COL = 'equipments';
const BERTHS_COL = 'berths';
const CATEGORIES_COL = 'containerCategories';
const LINES_COL = 'shippingLines';
const VESSEL_CALLS_COL = 'vesselCalls';
const GATE_TX_COL = 'gateTransactions';
const JOBS_COL = 'containerJobs';

function cleanPayload<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      clean[key] = obj[key];
    }
  });
  return clean;
}

// 1. Seed Initial Terminal Database into Firestore if empty
export async function seedInitialTerminalDataIfEmpty(): Promise<void> {
  try {
    const blockSnap = await getDocs(collection(db, YARD_BLOCKS_COL));
    if (blockSnap.empty) {
      console.log('Seeding Container Terminal Operations database into Firestore...');

      for (const b of INITIAL_YARD_BLOCKS) {
        await setDoc(doc(db, YARD_BLOCKS_COL, b.id), cleanPayload(b));
      }
      for (const e of INITIAL_EQUIPMENTS) {
        await setDoc(doc(db, EQUIPMENTS_COL, e.id), cleanPayload(e));
      }
      for (const bt of INITIAL_BERTHS) {
        await setDoc(doc(db, BERTHS_COL, bt.id), cleanPayload(bt));
      }
      for (const c of INITIAL_CONTAINER_CATEGORIES) {
        await setDoc(doc(db, CATEGORIES_COL, c.id), cleanPayload(c));
      }
      for (const l of INITIAL_SHIPPING_LINES) {
        await setDoc(doc(db, LINES_COL, l.id), cleanPayload(l));
      }
      for (const vc of INITIAL_VESSEL_CALLS) {
        await setDoc(doc(db, VESSEL_CALLS_COL, vc.id), cleanPayload(vc));
      }
      for (const gt of INITIAL_GATE_TRANSACTIONS) {
        await setDoc(doc(db, GATE_TX_COL, gt.id), cleanPayload(gt));
      }
      for (const j of INITIAL_CONTAINER_JOBS) {
        await setDoc(doc(db, JOBS_COL, j.id), cleanPayload(j));
      }
      console.log('Container Terminal database seeding completed!');
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, YARD_BLOCKS_COL);
  }
}

// 2. Yard Blocks CRUD
export function subscribeToYardBlocks(callback: (list: YardBlock[]) => void) {
  return onSnapshot(collection(db, YARD_BLOCKS_COL), (snapshot) => {
    const list: YardBlock[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as YardBlock));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, YARD_BLOCKS_COL));
}

export async function addYardBlock(item: Omit<YardBlock, 'id'>): Promise<string> {
  const id = 'block-' + Date.now();
  try {
    await setDoc(doc(db, YARD_BLOCKS_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${YARD_BLOCKS_COL}/${id}`);
    throw err;
  }
}

export async function updateYardBlock(id: string, updates: Partial<YardBlock>): Promise<void> {
  try {
    await updateDoc(doc(db, YARD_BLOCKS_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${YARD_BLOCKS_COL}/${id}`);
    throw err;
  }
}

export async function deleteYardBlock(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, YARD_BLOCKS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${YARD_BLOCKS_COL}/${id}`);
    throw err;
  }
}

// 3. Equipments CRUD
export function subscribeToEquipments(callback: (list: Equipment[]) => void) {
  return onSnapshot(collection(db, EQUIPMENTS_COL), (snapshot) => {
    const list: Equipment[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as Equipment));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, EQUIPMENTS_COL));
}

export async function addEquipment(item: Omit<Equipment, 'id'>): Promise<string> {
  const id = 'eq-' + Date.now();
  try {
    await setDoc(doc(db, EQUIPMENTS_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${EQUIPMENTS_COL}/${id}`);
    throw err;
  }
}

export async function updateEquipment(id: string, updates: Partial<Equipment>): Promise<void> {
  try {
    await updateDoc(doc(db, EQUIPMENTS_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${EQUIPMENTS_COL}/${id}`);
    throw err;
  }
}

export async function deleteEquipment(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, EQUIPMENTS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${EQUIPMENTS_COL}/${id}`);
    throw err;
  }
}

// 4. Berths CRUD
export function subscribeToBerths(callback: (list: Berth[]) => void) {
  return onSnapshot(collection(db, BERTHS_COL), (snapshot) => {
    const list: Berth[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as Berth));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, BERTHS_COL));
}

export async function addBerth(item: Omit<Berth, 'id'>): Promise<string> {
  const id = 'berth-' + Date.now();
  try {
    await setDoc(doc(db, BERTHS_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${BERTHS_COL}/${id}`);
    throw err;
  }
}

export async function updateBerth(id: string, updates: Partial<Berth>): Promise<void> {
  try {
    await updateDoc(doc(db, BERTHS_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${BERTHS_COL}/${id}`);
    throw err;
  }
}

export async function deleteBerth(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, BERTHS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${BERTHS_COL}/${id}`);
    throw err;
  }
}

// 5. Container Categories CRUD
export function subscribeToCategories(callback: (list: ContainerCategory[]) => void) {
  return onSnapshot(collection(db, CATEGORIES_COL), (snapshot) => {
    const list: ContainerCategory[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as ContainerCategory));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, CATEGORIES_COL));
}

export async function addCategory(item: Omit<ContainerCategory, 'id'>): Promise<string> {
  const id = 'cat-' + Date.now();
  try {
    await setDoc(doc(db, CATEGORIES_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${CATEGORIES_COL}/${id}`);
    throw err;
  }
}

export async function updateCategory(id: string, updates: Partial<ContainerCategory>): Promise<void> {
  try {
    await updateDoc(doc(db, CATEGORIES_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${CATEGORIES_COL}/${id}`);
    throw err;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CATEGORIES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${CATEGORIES_COL}/${id}`);
    throw err;
  }
}

// 6. Shipping Lines CRUD
export function subscribeToShippingLines(callback: (list: ShippingLine[]) => void) {
  return onSnapshot(collection(db, LINES_COL), (snapshot) => {
    const list: ShippingLine[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as ShippingLine));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, LINES_COL));
}

export async function addShippingLine(item: Omit<ShippingLine, 'id'>): Promise<string> {
  const id = 'line-' + Date.now();
  try {
    await setDoc(doc(db, LINES_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${LINES_COL}/${id}`);
    throw err;
  }
}

export async function updateShippingLine(id: string, updates: Partial<ShippingLine>): Promise<void> {
  try {
    await updateDoc(doc(db, LINES_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${LINES_COL}/${id}`);
    throw err;
  }
}

export async function deleteShippingLine(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, LINES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${LINES_COL}/${id}`);
    throw err;
  }
}

// 7. Vessel Calls CRUD (Transaksi Sandar & Bongkar Muat)
export function subscribeToVesselCalls(callback: (list: VesselCall[]) => void) {
  return onSnapshot(collection(db, VESSEL_CALLS_COL), (snapshot) => {
    const list: VesselCall[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as VesselCall));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, VESSEL_CALLS_COL));
}

export async function addVesselCall(item: Omit<VesselCall, 'id'>): Promise<string> {
  const id = 'call-' + Date.now();
  try {
    await setDoc(doc(db, VESSEL_CALLS_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${VESSEL_CALLS_COL}/${id}`);
    throw err;
  }
}

export async function updateVesselCall(id: string, updates: Partial<VesselCall>): Promise<void> {
  try {
    await updateDoc(doc(db, VESSEL_CALLS_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${VESSEL_CALLS_COL}/${id}`);
    throw err;
  }
}

export async function deleteVesselCall(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, VESSEL_CALLS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${VESSEL_CALLS_COL}/${id}`);
    throw err;
  }
}

// 8. Gate Transactions CRUD (Transaksi Gate In / Gate Out TOS)
export function subscribeToGateTransactions(callback: (list: GateTransaction[]) => void) {
  return onSnapshot(collection(db, GATE_TX_COL), (snapshot) => {
    const list: GateTransaction[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as GateTransaction));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, GATE_TX_COL));
}

export async function addGateTransaction(item: Omit<GateTransaction, 'id'>): Promise<string> {
  const id = 'gate-' + Date.now();
  try {
    await setDoc(doc(db, GATE_TX_COL, id), cleanPayload({ ...item, id }));
    
    // Auto increment currentTeuCount in the target YardBlock
    if (item.yardBlockCode) {
      const blockSnap = await getDocs(collection(db, YARD_BLOCKS_COL));
      blockSnap.forEach(async (docSnap) => {
        const blockData = docSnap.data() as YardBlock;
        if (blockData.blockCode === item.yardBlockCode) {
          const delta = (item.transactionType.includes('Gate In')) ? 1 : -1;
          const newCount = Math.max(0, blockData.currentTeuCount + delta);
          await updateDoc(doc(db, YARD_BLOCKS_COL, docSnap.id), { currentTeuCount: newCount });
        }
      });
    }

    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${GATE_TX_COL}/${id}`);
    throw err;
  }
}

export async function updateGateTransaction(id: string, updates: Partial<GateTransaction>): Promise<void> {
  try {
    await updateDoc(doc(db, GATE_TX_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${GATE_TX_COL}/${id}`);
    throw err;
  }
}

export async function deleteGateTransaction(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, GATE_TX_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${GATE_TX_COL}/${id}`);
    throw err;
  }
}

// 9. Container Jobs CRUD (Transaksi Equipment & Movement Crane)
export function subscribeToContainerJobs(callback: (list: ContainerJob[]) => void) {
  return onSnapshot(collection(db, JOBS_COL), (snapshot) => {
    const list: ContainerJob[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as ContainerJob));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, JOBS_COL));
}

export async function addContainerJob(item: Omit<ContainerJob, 'id'>): Promise<string> {
  const id = 'job-' + Date.now();
  try {
    await setDoc(doc(db, JOBS_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${JOBS_COL}/${id}`);
    throw err;
  }
}

export async function updateContainerJob(id: string, updates: Partial<ContainerJob>): Promise<void> {
  try {
    await updateDoc(doc(db, JOBS_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${JOBS_COL}/${id}`);
    throw err;
  }
}

export async function deleteContainerJob(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, JOBS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${JOBS_COL}/${id}`);
    throw err;
  }
}
