export interface PassengerShip {
  id: string;
  name: string; // e.g. KM Kelud, KM Labobar, KMP Ferrindo
  vesselType: 'Kapal Penumpang PELNI' | 'Kapal Ro-Ro Ferry' | 'Kapal Express Bahari';
  passengerCapacity: number;
  vehicleCapacity: number;
  cargoCapacityTons: number;
  captainName: string;
  status: 'Active' | 'In Voyage' | 'Maintenance' | 'Docked';
}

export interface ShipRoute {
  id: string;
  routeCode: string; // e.g. RUT-01
  originPort: string;
  transitPort?: string;
  destinationPort: string;
  distanceMiles: number;
  durationHours: number;
}

export interface TicketClass {
  id: string;
  className: string; // e.g. Kelas I Executive, Kelas II Business, Kelas Ekonomi
  fareAdult: number;
  fareChild: number;
  facilities: string;
}

export interface CargoCategory {
  id: string;
  categoryName: string; // e.g. Gol I Sepeda Motor, Gol IV Mobil Pribadi, Gol VI Truk Sedang, Cargo General per Kg
  fareRate: number;
  unit: 'Unit / Kendaraan' | 'Ton / Tonase' | 'Koli / Dus';
}

export interface TicketAgent {
  id: string;
  agentCode: string;
  agentName: string;
  contactPerson: string;
  phone: string;
  email: string;
  commissionPercent: number;
}

export type ShipVoyageStatus = 
  | 'Scheduled' 
  | 'Boarding Open' 
  | 'Sailing' 
  | 'Arrived' 
  | 'Completed';

export interface ShipVoyage {
  id: string;
  voyageCode: string; // e.g. VOY-KELUD-08
  shipName: string;
  routeCode: string;
  originPort: string;
  destinationPort: string;
  etd: string;
  eta: string;
  bookedPassengers: number;
  bookedVehicles: number;
  status: ShipVoyageStatus;
}

export type TicketStatus = 'Booked' | 'Boarded / Check-In' | 'Cancelled';

export interface PassengerTicket {
  id: string;
  pnrCode: string; // e.g. PNR-2026-90182
  voyageCode: string;
  passengerName: string;
  nikNumber: string;
  gender: 'Laki-laki' | 'Perempuan';
  age: number;
  ticketClass: string;
  cabinBedNo: string;
  fareAmount: number;
  status: TicketStatus;
}

export type ManifestStatus = 'Loaded' | 'Shipped' | 'Delivered';

export interface CargoManifest {
  id: string;
  manifestNo: string; // e.g. CGO-2026-1029
  voyageCode: string;
  shipperName: string;
  cargoCategory: string;
  itemDescription: string;
  truckPlate?: string;
  weightTon: number;
  fareAmount: number;
  status: ManifestStatus;
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'Super Admin' | 'Loket & Ticketing Supervisor' | 'Manifest Cargo Officer' | 'Syahbandar & Port Controller';
}
