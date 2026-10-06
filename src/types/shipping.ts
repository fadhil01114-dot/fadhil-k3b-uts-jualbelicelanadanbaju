export type VesselType = 'Container Ship' | 'Bulk Carrier' | 'Oil Tanker' | 'Tugboat / Barge';

export type VesselStatus = 'Active' | 'In Voyage' | 'Under Maintenance' | 'Anchored';

export interface Vessel {
  id: string;
  name: string;
  imoNumber: string;
  vesselType: VesselType;
  dwtCapacity: number; // Deadweight Tonnage in metric tons
  flag: string;
  buildYear: number;
  status: VesselStatus;
  captainName: string;
  photoUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Port {
  id: string;
  name: string;
  code: string; // e.g. IDTPP (Tanjung Priok), IDSUB (Tanjung Perak)
  city: string;
  country: string;
  maxDraft: number; // in meters
  berthCapacity: number;
  createdAt?: string;
}

export interface CargoType {
  id: string;
  name: string;
  category: 'Container 20ft' | 'Container 40ft' | 'Dry Bulk' | 'Liquid Bulk' | 'General Cargo';
  standardRatePerUnit: number; // in IDR
  unitName: 'TEU' | 'FEU' | 'Metric Ton' | 'Kilo Liter' | 'Unit';
  description: string;
}

export interface Shipper {
  id: string;
  companyName: string;
  npwp: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  totalBookings: number;
}

export type CrewRank = 
  | 'Nakhoda (Captain)' 
  | 'KKM (Chief Engineer)' 
  | 'Mualim I (Chief Officer)' 
  | 'Mualim II (Second Officer)' 
  | 'Masinis I (First Engineer)' 
  | 'AB Sailor (Juru Mudi)';

export interface CrewMember {
  id: string;
  fullName: string;
  rank: CrewRank;
  certificateNo: string;
  assignedVesselId: string;
  status: 'On Duty' | 'On Leave' | 'Available';
}

export type VoyageStatus = 
  | 'Scheduled' 
  | 'Loading' 
  | 'Sailing' 
  | 'Arrived' 
  | 'Unloading' 
  | 'Completed' 
  | 'Cancelled';

export interface Voyage {
  id: string;
  voyageNumber: string; // e.g. VOY-2026-081
  vesselId: string;
  vesselName: string;
  originPortId: string;
  originPortName: string;
  destinationPortId: string;
  destinationPortName: string;
  etd: string; // Estimated Time of Departure (YYYY-MM-DD)
  eta: string; // Estimated Time of Arrival (YYYY-MM-DD)
  status: VoyageStatus;
  captainName: string;
  totalFreightValue: number;
  createdAt: string;
  updatedAt?: string;
}

export type CargoStatus = 'Booked' | 'Loaded' | 'In Transit' | 'Discharged' | 'Delivered';
export type PaymentStatus = 'Unpaid' | 'Partial' | 'Paid In Full';

export interface CargoBooking {
  id: string;
  bookingNumber: string; // e.g. BL-2026-9011
  voyageId: string;
  voyageNumber: string;
  shipperId: string;
  shipperName: string;
  cargoTypeId: string;
  cargoTypeName: string;
  quantity: number;
  totalFreightFee: number;
  paymentStatus: PaymentStatus;
  cargoStatus: CargoStatus;
  createdAt: string;
}

export interface MaintenanceLog {
  id: string;
  vesselId: string;
  vesselName: string;
  maintenanceType: 'Routine Overhaul' | 'Dry Docking' | 'Engine Repair' | 'Hull Inspection';
  startDate: string;
  endDate: string;
  costAmount: number;
  vendorName: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  notes: string;
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'Super Admin' | 'Fleet Manager' | 'Port Operations' | 'Finance Officer';
}
