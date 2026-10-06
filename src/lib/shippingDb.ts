import { 
  collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { 
  Vessel, Port, CargoType, Shipper, CrewMember, Voyage, CargoBooking, MaintenanceLog 
} from '../types/shipping';
import { 
  INITIAL_VESSELS, INITIAL_PORTS, INITIAL_CARGO_TYPES, INITIAL_SHIPPERS, 
  INITIAL_CREWS, INITIAL_VOYAGES, INITIAL_BOOKINGS, INITIAL_MAINTENANCES 
} from '../data/initialShippingData';

const VESSELS_COL = 'vessels';
const PORTS_COL = 'ports';
const CARGO_TYPES_COL = 'cargoTypes';
const SHIPPERS_COL = 'shippers';
const CREWS_COL = 'crews';
const VOYAGES_COL = 'voyages';
const BOOKINGS_COL = 'bookings';
const MAINTENANCES_COL = 'maintenances';

// Helper to sanitize undefined values which Firestore rejects
function cleanPayload<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      clean[key] = obj[key];
    }
  });
  return clean;
}

// 1. Seed Initial Master & Transaction Data into Firestore if empty
export async function seedInitialShippingDataIfEmpty(): Promise<void> {
  try {
    const vesSnap = await getDocs(collection(db, VESSELS_COL));
    if (vesSnap.empty) {
      console.log('Seeding initial maritime shipping database into Firestore...');
      
      for (const v of INITIAL_VESSELS) {
        await setDoc(doc(db, VESSELS_COL, v.id), cleanPayload(v));
      }
      for (const p of INITIAL_PORTS) {
        await setDoc(doc(db, PORTS_COL, p.id), cleanPayload(p));
      }
      for (const c of INITIAL_CARGO_TYPES) {
        await setDoc(doc(db, CARGO_TYPES_COL, c.id), cleanPayload(c));
      }
      for (const s of INITIAL_SHIPPERS) {
        await setDoc(doc(db, SHIPPERS_COL, s.id), cleanPayload(s));
      }
      for (const cr of INITIAL_CREWS) {
        await setDoc(doc(db, CREWS_COL, cr.id), cleanPayload(cr));
      }
      for (const voy of INITIAL_VOYAGES) {
        await setDoc(doc(db, VOYAGES_COL, voy.id), cleanPayload(voy));
      }
      for (const bk of INITIAL_BOOKINGS) {
        await setDoc(doc(db, BOOKINGS_COL, bk.id), cleanPayload(bk));
      }
      for (const m of INITIAL_MAINTENANCES) {
        await setDoc(doc(db, MAINTENANCES_COL, m.id), cleanPayload(m));
      }
      console.log('Maritime shipping database seeding completed!');
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, VESSELS_COL);
  }
}

// 2. Vessels CRUD
export function subscribeToVessels(callback: (vessels: Vessel[]) => void) {
  return onSnapshot(collection(db, VESSELS_COL), (snapshot) => {
    const list: Vessel[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as Vessel));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, VESSELS_COL));
}

export async function addVessel(item: Omit<Vessel, 'id'>): Promise<string> {
  const id = 'ves-' + Date.now();
  try {
    const data = cleanPayload({ ...item, id, createdAt: new Date().toISOString() });
    await setDoc(doc(db, VESSELS_COL, id), data);
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${VESSELS_COL}/${id}`);
    throw err;
  }
}

export async function updateVessel(id: string, updates: Partial<Vessel>): Promise<void> {
  try {
    const data = cleanPayload({ ...updates, updatedAt: new Date().toISOString() });
    await updateDoc(doc(db, VESSELS_COL, id), data);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${VESSELS_COL}/${id}`);
    throw err;
  }
}

export async function deleteVessel(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, VESSELS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${VESSELS_COL}/${id}`);
    throw err;
  }
}

// 3. Ports CRUD
export function subscribeToPorts(callback: (ports: Port[]) => void) {
  return onSnapshot(collection(db, PORTS_COL), (snapshot) => {
    const list: Port[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as Port));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, PORTS_COL));
}

export async function addPort(item: Omit<Port, 'id'>): Promise<string> {
  const id = 'port-' + Date.now();
  try {
    const data = cleanPayload({ ...item, id, createdAt: new Date().toISOString() });
    await setDoc(doc(db, PORTS_COL, id), data);
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${PORTS_COL}/${id}`);
    throw err;
  }
}

export async function updatePort(id: string, updates: Partial<Port>): Promise<void> {
  try {
    await updateDoc(doc(db, PORTS_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${PORTS_COL}/${id}`);
    throw err;
  }
}

export async function deletePort(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PORTS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PORTS_COL}/${id}`);
    throw err;
  }
}

// 4. Cargo Types CRUD
export function subscribeToCargoTypes(callback: (list: CargoType[]) => void) {
  return onSnapshot(collection(db, CARGO_TYPES_COL), (snapshot) => {
    const list: CargoType[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as CargoType));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, CARGO_TYPES_COL));
}

export async function addCargoType(item: Omit<CargoType, 'id'>): Promise<string> {
  const id = 'cargo-' + Date.now();
  try {
    await setDoc(doc(db, CARGO_TYPES_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${CARGO_TYPES_COL}/${id}`);
    throw err;
  }
}

export async function updateCargoType(id: string, updates: Partial<CargoType>): Promise<void> {
  try {
    await updateDoc(doc(db, CARGO_TYPES_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${CARGO_TYPES_COL}/${id}`);
    throw err;
  }
}

export async function deleteCargoType(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CARGO_TYPES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${CARGO_TYPES_COL}/${id}`);
    throw err;
  }
}

// 5. Shippers CRUD
export function subscribeToShippers(callback: (list: Shipper[]) => void) {
  return onSnapshot(collection(db, SHIPPERS_COL), (snapshot) => {
    const list: Shipper[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as Shipper));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, SHIPPERS_COL));
}

export async function addShipper(item: Omit<Shipper, 'id'>): Promise<string> {
  const id = 'ship-' + Date.now();
  try {
    await setDoc(doc(db, SHIPPERS_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SHIPPERS_COL}/${id}`);
    throw err;
  }
}

export async function updateShipper(id: string, updates: Partial<Shipper>): Promise<void> {
  try {
    await updateDoc(doc(db, SHIPPERS_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${SHIPPERS_COL}/${id}`);
    throw err;
  }
}

export async function deleteShipper(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SHIPPERS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${SHIPPERS_COL}/${id}`);
    throw err;
  }
}

// 6. Crew Members CRUD
export function subscribeToCrews(callback: (list: CrewMember[]) => void) {
  return onSnapshot(collection(db, CREWS_COL), (snapshot) => {
    const list: CrewMember[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as CrewMember));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, CREWS_COL));
}

export async function addCrew(item: Omit<CrewMember, 'id'>): Promise<string> {
  const id = 'crew-' + Date.now();
  try {
    await setDoc(doc(db, CREWS_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${CREWS_COL}/${id}`);
    throw err;
  }
}

export async function updateCrew(id: string, updates: Partial<CrewMember>): Promise<void> {
  try {
    await updateDoc(doc(db, CREWS_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${CREWS_COL}/${id}`);
    throw err;
  }
}

export async function deleteCrew(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CREWS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${CREWS_COL}/${id}`);
    throw err;
  }
}

// 7. Voyages CRUD
export function subscribeToVoyages(callback: (list: Voyage[]) => void) {
  return onSnapshot(collection(db, VOYAGES_COL), (snapshot) => {
    const list: Voyage[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as Voyage));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, VOYAGES_COL));
}

export async function addVoyage(item: Omit<Voyage, 'id' | 'createdAt'>): Promise<string> {
  const id = 'voy-' + Date.now();
  try {
    await setDoc(doc(db, VOYAGES_COL, id), cleanPayload({ ...item, id, createdAt: new Date().toISOString() }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${VOYAGES_COL}/${id}`);
    throw err;
  }
}

export async function updateVoyage(id: string, updates: Partial<Voyage>): Promise<void> {
  try {
    await updateDoc(doc(db, VOYAGES_COL, id), cleanPayload({ ...updates, updatedAt: new Date().toISOString() }));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${VOYAGES_COL}/${id}`);
    throw err;
  }
}

export async function deleteVoyage(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, VOYAGES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${VOYAGES_COL}/${id}`);
    throw err;
  }
}

// 8. Cargo Bookings CRUD
export function subscribeToBookings(callback: (list: CargoBooking[]) => void) {
  return onSnapshot(collection(db, BOOKINGS_COL), (snapshot) => {
    const list: CargoBooking[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as CargoBooking));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, BOOKINGS_COL));
}

export async function addBooking(item: Omit<CargoBooking, 'id' | 'createdAt'>): Promise<string> {
  const id = 'book-' + Date.now();
  try {
    await setDoc(doc(db, BOOKINGS_COL, id), cleanPayload({ ...item, id, createdAt: new Date().toISOString() }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${BOOKINGS_COL}/${id}`);
    throw err;
  }
}

export async function updateBooking(id: string, updates: Partial<CargoBooking>): Promise<void> {
  try {
    await updateDoc(doc(db, BOOKINGS_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${BOOKINGS_COL}/${id}`);
    throw err;
  }
}

export async function deleteBooking(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, BOOKINGS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${BOOKINGS_COL}/${id}`);
    throw err;
  }
}

// 9. Maintenance Logs CRUD
export function subscribeToMaintenances(callback: (list: MaintenanceLog[]) => void) {
  return onSnapshot(collection(db, MAINTENANCES_COL), (snapshot) => {
    const list: MaintenanceLog[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as MaintenanceLog));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, MAINTENANCES_COL));
}

export async function addMaintenance(item: Omit<MaintenanceLog, 'id'>): Promise<string> {
  const id = 'maint-' + Date.now();
  try {
    await setDoc(doc(db, MAINTENANCES_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${MAINTENANCES_COL}/${id}`);
    throw err;
  }
}

export async function updateMaintenance(id: string, updates: Partial<MaintenanceLog>): Promise<void> {
  try {
    await updateDoc(doc(db, MAINTENANCES_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${MAINTENANCES_COL}/${id}`);
    throw err;
  }
}

export async function deleteMaintenance(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, MAINTENANCES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${MAINTENANCES_COL}/${id}`);
    throw err;
  }
}
