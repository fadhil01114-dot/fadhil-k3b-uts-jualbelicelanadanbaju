import { 
  collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { 
  PassengerShip, ShipRoute, TicketClass, CargoCategory, TicketAgent, 
  ShipVoyage, PassengerTicket, CargoManifest 
} from '../types/passengerCargo';
import { 
  INITIAL_PASSENGER_SHIPS, INITIAL_SHIP_ROUTES, INITIAL_TICKET_CLASSES, 
  INITIAL_CARGO_CATEGORIES, INITIAL_TICKET_AGENTS, INITIAL_SHIP_VOYAGES, 
  INITIAL_PASSENGER_TICKETS, INITIAL_CARGO_MANIFESTS 
} from '../data/initialPassengerCargoData';

const SHIPS_COL = 'passengerShips';
const ROUTES_COL = 'shipRoutes';
const CLASSES_COL = 'ticketClasses';
const CATEGORIES_COL = 'cargoCategories';
const AGENTS_COL = 'ticketAgents';
const VOYAGES_COL = 'shipVoyages';
const TICKETS_COL = 'passengerTickets';
const MANIFESTS_COL = 'cargoManifests';

// Sanitize payload to prevent Firestore undefined errors
function cleanPayload<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      clean[key] = obj[key];
    }
  });
  return clean;
}

// 1. Seed Initial Data if Firestore is empty
export async function seedInitialPassengerCargoDataIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, SHIPS_COL));
    if (snap.empty) {
      console.log('Seeding passenger & cargo ship database into Firestore...');
      
      for (const s of INITIAL_PASSENGER_SHIPS) {
        await setDoc(doc(db, SHIPS_COL, s.id), cleanPayload(s));
      }
      for (const r of INITIAL_SHIP_ROUTES) {
        await setDoc(doc(db, ROUTES_COL, r.id), cleanPayload(r));
      }
      for (const c of INITIAL_TICKET_CLASSES) {
        await setDoc(doc(db, CLASSES_COL, c.id), cleanPayload(c));
      }
      for (const cat of INITIAL_CARGO_CATEGORIES) {
        await setDoc(doc(db, CATEGORIES_COL, cat.id), cleanPayload(cat));
      }
      for (const a of INITIAL_TICKET_AGENTS) {
        await setDoc(doc(db, AGENTS_COL, a.id), cleanPayload(a));
      }
      for (const v of INITIAL_SHIP_VOYAGES) {
        await setDoc(doc(db, VOYAGES_COL, v.id), cleanPayload(v));
      }
      for (const t of INITIAL_PASSENGER_TICKETS) {
        await setDoc(doc(db, TICKETS_COL, t.id), cleanPayload(t));
      }
      for (const m of INITIAL_CARGO_MANIFESTS) {
        await setDoc(doc(db, MANIFESTS_COL, m.id), cleanPayload(m));
      }
      console.log('Passenger & cargo database seeding complete!');
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, SHIPS_COL);
  }
}

// 2. Ships CRUD
export function subscribeToPassengerShips(callback: (list: PassengerShip[]) => void) {
  return onSnapshot(collection(db, SHIPS_COL), snapshot => {
    const list: PassengerShip[] = [];
    snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as PassengerShip));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, SHIPS_COL));
}

export async function addPassengerShip(item: Omit<PassengerShip, 'id'>): Promise<string> {
  const id = 'ship-' + Date.now();
  try {
    await setDoc(doc(db, SHIPS_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SHIPS_COL}/${id}`);
    throw err;
  }
}

export async function updatePassengerShip(id: string, updates: Partial<PassengerShip>): Promise<void> {
  try {
    await updateDoc(doc(db, SHIPS_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${SHIPS_COL}/${id}`);
    throw err;
  }
}

export async function deletePassengerShip(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SHIPS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${SHIPS_COL}/${id}`);
    throw err;
  }
}

// 3. Routes CRUD
export function subscribeToShipRoutes(callback: (list: ShipRoute[]) => void) {
  return onSnapshot(collection(db, ROUTES_COL), snapshot => {
    const list: ShipRoute[] = [];
    snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as ShipRoute));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, ROUTES_COL));
}

export async function addShipRoute(item: Omit<ShipRoute, 'id'>): Promise<string> {
  const id = 'route-' + Date.now();
  try {
    await setDoc(doc(db, ROUTES_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${ROUTES_COL}/${id}`);
    throw err;
  }
}

export async function updateShipRoute(id: string, updates: Partial<ShipRoute>): Promise<void> {
  try {
    await updateDoc(doc(db, ROUTES_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${ROUTES_COL}/${id}`);
    throw err;
  }
}

export async function deleteShipRoute(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, ROUTES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${ROUTES_COL}/${id}`);
    throw err;
  }
}

// 4. Ticket Classes CRUD
export function subscribeToTicketClasses(callback: (list: TicketClass[]) => void) {
  return onSnapshot(collection(db, CLASSES_COL), snapshot => {
    const list: TicketClass[] = [];
    snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as TicketClass));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, CLASSES_COL));
}

export async function addTicketClass(item: Omit<TicketClass, 'id'>): Promise<string> {
  const id = 'class-' + Date.now();
  try {
    await setDoc(doc(db, CLASSES_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${CLASSES_COL}/${id}`);
    throw err;
  }
}

export async function updateTicketClass(id: string, updates: Partial<TicketClass>): Promise<void> {
  try {
    await updateDoc(doc(db, CLASSES_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${CLASSES_COL}/${id}`);
    throw err;
  }
}

export async function deleteTicketClass(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CLASSES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${CLASSES_COL}/${id}`);
    throw err;
  }
}

// 5. Cargo Categories CRUD
export function subscribeToCargoCategories(callback: (list: CargoCategory[]) => void) {
  return onSnapshot(collection(db, CATEGORIES_COL), snapshot => {
    const list: CargoCategory[] = [];
    snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as CargoCategory));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, CATEGORIES_COL));
}

export async function addCargoCategory(item: Omit<CargoCategory, 'id'>): Promise<string> {
  const id = 'cgo-cat-' + Date.now();
  try {
    await setDoc(doc(db, CATEGORIES_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${CATEGORIES_COL}/${id}`);
    throw err;
  }
}

export async function updateCargoCategory(id: string, updates: Partial<CargoCategory>): Promise<void> {
  try {
    await updateDoc(doc(db, CATEGORIES_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${CATEGORIES_COL}/${id}`);
    throw err;
  }
}

export async function deleteCargoCategory(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CATEGORIES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${CATEGORIES_COL}/${id}`);
    throw err;
  }
}

// 6. Ticket Agents CRUD
export function subscribeToTicketAgents(callback: (list: TicketAgent[]) => void) {
  return onSnapshot(collection(db, AGENTS_COL), snapshot => {
    const list: TicketAgent[] = [];
    snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as TicketAgent));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, AGENTS_COL));
}

export async function addTicketAgent(item: Omit<TicketAgent, 'id'>): Promise<string> {
  const id = 'agent-' + Date.now();
  try {
    await setDoc(doc(db, AGENTS_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${AGENTS_COL}/${id}`);
    throw err;
  }
}

export async function updateTicketAgent(id: string, updates: Partial<TicketAgent>): Promise<void> {
  try {
    await updateDoc(doc(db, AGENTS_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${AGENTS_COL}/${id}`);
    throw err;
  }
}

export async function deleteTicketAgent(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, AGENTS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${AGENTS_COL}/${id}`);
    throw err;
  }
}

// 7. Ship Voyages CRUD
export function subscribeToShipVoyages(callback: (list: ShipVoyage[]) => void) {
  return onSnapshot(collection(db, VOYAGES_COL), snapshot => {
    const list: ShipVoyage[] = [];
    snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as ShipVoyage));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, VOYAGES_COL));
}

export async function addShipVoyage(item: Omit<ShipVoyage, 'id'>): Promise<string> {
  const id = 'voy-' + Date.now();
  try {
    await setDoc(doc(db, VOYAGES_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${VOYAGES_COL}/${id}`);
    throw err;
  }
}

export async function updateShipVoyage(id: string, updates: Partial<ShipVoyage>): Promise<void> {
  try {
    await updateDoc(doc(db, VOYAGES_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${VOYAGES_COL}/${id}`);
    throw err;
  }
}

export async function deleteShipVoyage(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, VOYAGES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${VOYAGES_COL}/${id}`);
    throw err;
  }
}

// 8. Passenger Tickets CRUD
export function subscribeToPassengerTickets(callback: (list: PassengerTicket[]) => void) {
  return onSnapshot(collection(db, TICKETS_COL), snapshot => {
    const list: PassengerTicket[] = [];
    snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as PassengerTicket));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, TICKETS_COL));
}

export async function addPassengerTicket(item: Omit<PassengerTicket, 'id'>): Promise<string> {
  const id = 'tkt-' + Date.now();
  try {
    await setDoc(doc(db, TICKETS_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${TICKETS_COL}/${id}`);
    throw err;
  }
}

export async function updatePassengerTicket(id: string, updates: Partial<PassengerTicket>): Promise<void> {
  try {
    await updateDoc(doc(db, TICKETS_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${TICKETS_COL}/${id}`);
    throw err;
  }
}

export async function deletePassengerTicket(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TICKETS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${TICKETS_COL}/${id}`);
    throw err;
  }
}

// 9. Cargo Manifests CRUD
export function subscribeToCargoManifests(callback: (list: CargoManifest[]) => void) {
  return onSnapshot(collection(db, MANIFESTS_COL), snapshot => {
    const list: CargoManifest[] = [];
    snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as CargoManifest));
    callback(list);
  }, err => handleFirestoreError(err, OperationType.GET, MANIFESTS_COL));
}

export async function addCargoManifest(item: Omit<CargoManifest, 'id'>): Promise<string> {
  const id = 'cgo-' + Date.now();
  try {
    await setDoc(doc(db, MANIFESTS_COL, id), cleanPayload({ ...item, id }));
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${MANIFESTS_COL}/${id}`);
    throw err;
  }
}

export async function updateCargoManifest(id: string, updates: Partial<CargoManifest>): Promise<void> {
  try {
    await updateDoc(doc(db, MANIFESTS_COL, id), cleanPayload(updates));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${MANIFESTS_COL}/${id}`);
    throw err;
  }
}

export async function deleteCargoManifest(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, MANIFESTS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${MANIFESTS_COL}/${id}`);
    throw err;
  }
}
