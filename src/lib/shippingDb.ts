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

// 1. Seed Initial Master & Transaction Data into Firestore if empty
export async function seedInitialShippingDataIfEmpty(): Promise<void> {
  try {
    const vesSnap = await getDocs(collection(db, VESSELS_COL));
    if (vesSnap.empty) {
      console.log('Seeding initial maritime shipping database into Firestore...');
      
      for (const v of INITIAL_VESSELS) {
        await setDoc(doc(db, VESSELS_COL, v.id), v);
      }
      for (const p of INITIAL_PORTS) {
        await setDoc(doc(db, PORTS_COL, p.id), p);
      }
      for (const c of INITIAL_CARGO_TYPES) {
        await setDoc(doc(db, CARGO_TYPES_COL, c.id), c);
      }
      for (const s of INITIAL_SHIPPERS) {
        await setDoc(doc(db, SHIPPERS_COL, s.id), s);
      }
      for (const cr of INITIAL_CREWS) {
        await setDoc(doc(db, CREWS_COL, cr.id), cr);
      }
      for (const voy of INITIAL_VOYAGES) {
        await setDoc(doc(db, VOYAGES_COL, voy.id), voy);
      }
      for (const bk of INITIAL_BOOKINGS) {
        await setDoc(doc(db, BOOKINGS_COL, bk.id), bk);
      }
      for (const m of INITIAL_MAINTENANCES) {
        await setDoc(doc(db, MAINTENANCES_COL, m.id), m);
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

export async function addVessel(item: Omit<Vessel, 'id'>): Promise<void> {
  const id = 'ves-' + Date.now();
  try {
    await setDoc(doc(db, VESSELS_COL, id), { ...item, id, createdAt: new Date().toISOString() });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${VESSELS_COL}/${id}`);
  }
}

export async function updateVessel(id: string, updates: Partial<Vessel>): Promise<void> {
  try {
    await updateDoc(doc(db, VESSELS_COL, id), { ...updates, updatedAt: new Date().toISOString() });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${VESSELS_COL}/${id}`);
  }
}

export async function deleteVessel(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, VESSELS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${VESSELS_COL}/${id}`);
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

export async function addPort(item: Omit<Port, 'id'>): Promise<void> {
  const id = 'port-' + Date.now();
  try {
    await setDoc(doc(db, PORTS_COL, id), { ...item, id, createdAt: new Date().toISOString() });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${PORTS_COL}/${id}`);
  }
}

export async function updatePort(id: string, updates: Partial<Port>): Promise<void> {
  try {
    await updateDoc(doc(db, PORTS_COL, id), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${PORTS_COL}/${id}`);
  }
}

export async function deletePort(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PORTS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PORTS_COL}/${id}`);
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

export async function addCargoType(item: Omit<CargoType, 'id'>): Promise<void> {
  const id = 'cargo-' + Date.now();
  try {
    await setDoc(doc(db, CARGO_TYPES_COL, id), { ...item, id });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${CARGO_TYPES_COL}/${id}`);
  }
}

export async function updateCargoType(id: string, updates: Partial<CargoType>): Promise<void> {
  try {
    await updateDoc(doc(db, CARGO_TYPES_COL, id), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${CARGO_TYPES_COL}/${id}`);
  }
}

export async function deleteCargoType(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CARGO_TYPES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${CARGO_TYPES_COL}/${id}`);
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

export async function addShipper(item: Omit<Shipper, 'id'>): Promise<void> {
  const id = 'ship-' + Date.now();
  try {
    await setDoc(doc(db, SHIPPERS_COL, id), { ...item, id });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SHIPPERS_COL}/${id}`);
  }
}

export async function updateShipper(id: string, updates: Partial<Shipper>): Promise<void> {
  try {
    await updateDoc(doc(db, SHIPPERS_COL, id), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${SHIPPERS_COL}/${id}`);
  }
}

export async function deleteShipper(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SHIPPERS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${SHIPPERS_COL}/${id}`);
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

export async function addCrew(item: Omit<CrewMember, 'id'>): Promise<void> {
  const id = 'crew-' + Date.now();
  try {
    await setDoc(doc(db, CREWS_COL, id), { ...item, id });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${CREWS_COL}/${id}`);
  }
}

export async function updateCrew(id: string, updates: Partial<CrewMember>): Promise<void> {
  try {
    await updateDoc(doc(db, CREWS_COL, id), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${CREWS_COL}/${id}`);
  }
}

export async function deleteCrew(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CREWS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${CREWS_COL}/${id}`);
  }
}

// 7. Voyages CRUD (Transaksi Jadwal Pelayaran)
export function subscribeToVoyages(callback: (list: Voyage[]) => void) {
  return onSnapshot(collection(db, VOYAGES_COL), (snapshot) => {
    const list: Voyage[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as Voyage));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, VOYAGES_COL));
}

export async function addVoyage(item: Omit<Voyage, 'id' | 'createdAt'>): Promise<void> {
  const id = 'voy-' + Date.now();
  try {
    await setDoc(doc(db, VOYAGES_COL, id), { ...item, id, createdAt: new Date().toISOString() });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${VOYAGES_COL}/${id}`);
  }
}

export async function updateVoyage(id: string, updates: Partial<Voyage>): Promise<void> {
  try {
    await updateDoc(doc(db, VOYAGES_COL, id), { ...updates, updatedAt: new Date().toISOString() });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${VOYAGES_COL}/${id}`);
  }
}

export async function deleteVoyage(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, VOYAGES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${VOYAGES_COL}/${id}`);
  }
}

// 8. Cargo Bookings CRUD (Transaksi Booking Kargo / Bill of Lading)
export function subscribeToBookings(callback: (list: CargoBooking[]) => void) {
  return onSnapshot(collection(db, BOOKINGS_COL), (snapshot) => {
    const list: CargoBooking[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as CargoBooking));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, BOOKINGS_COL));
}

export async function addBooking(item: Omit<CargoBooking, 'id' | 'createdAt'>): Promise<void> {
  const id = 'book-' + Date.now();
  try {
    await setDoc(doc(db, BOOKINGS_COL, id), { ...item, id, createdAt: new Date().toISOString() });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${BOOKINGS_COL}/${id}`);
  }
}

export async function updateBooking(id: string, updates: Partial<CargoBooking>): Promise<void> {
  try {
    await updateDoc(doc(db, BOOKINGS_COL, id), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${BOOKINGS_COL}/${id}`);
  }
}

export async function deleteBooking(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, BOOKINGS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${BOOKINGS_COL}/${id}`);
  }
}

// 9. Maintenance Logs CRUD (Transaksi Pemeliharaan Kapal)
export function subscribeToMaintenances(callback: (list: MaintenanceLog[]) => void) {
  return onSnapshot(collection(db, MAINTENANCES_COL), (snapshot) => {
    const list: MaintenanceLog[] = [];
    snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as MaintenanceLog));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, MAINTENANCES_COL));
}

export async function addMaintenance(item: Omit<MaintenanceLog, 'id'>): Promise<void> {
  const id = 'maint-' + Date.now();
  try {
    await setDoc(doc(db, MAINTENANCES_COL, id), { ...item, id });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${MAINTENANCES_COL}/${id}`);
  }
}

export async function updateMaintenance(id: string, updates: Partial<MaintenanceLog>): Promise<void> {
  try {
    await updateDoc(doc(db, MAINTENANCES_COL, id), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${MAINTENANCES_COL}/${id}`);
  }
}

export async function deleteMaintenance(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, MAINTENANCES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${MAINTENANCES_COL}/${id}`);
  }
}
