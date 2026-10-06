export interface YardBlock {
  id: string;
  blockCode: string; // e.g. Blok A1, Blok B2, Blok R1 (Reefer)
  capacityTeu: number;
  currentTeuCount: number;
  totalRows: number;
  totalTiers: number;
  categoryAllowed: string;
  status: 'Active' | 'Maintenance' | 'Full';
}

export type EquipmentType = 
  | 'Quay Crane (QC)' 
  | 'Rubber Tyred Gantry (RTG)' 
  | 'Reach Stacker (RS)' 
  | 'Side Loader';

export interface Equipment {
  id: string;
  code: string; // e.g. QC-01, RTG-03, RS-02
  equipmentType: EquipmentType;
  maxCapacityTons: number;
  operatorName: string;
  status: 'Operational' | 'In Use' | 'Under Maintenance';
}

export interface Berth {
  id: string;
  name: string; // e.g. Dermaga International 01, Dermaga Domestik A
  lengthMeters: number;
  maxDraft: number;
  craneCount: number;
  status: 'Available' | 'Occupied' | 'Reserved';
}

export interface ContainerCategory {
  id: string;
  code: string; // e.g. 20GP, 40HC, 20RF
  name: string;
  size: '20ft' | '40ft';
  type: 'Dry Standard' | 'High Cube' | 'Reefer / Pendingin' | 'Hazardous / DG' | 'Flat Rack';
  handlingFeePerShift: number; // in IDR
}

export interface ShippingLine {
  id: string;
  lineName: string;
  isoCode: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
}

export type VesselCallStatus = 
  | 'Scheduled' 
  | 'Berthing' 
  | 'Loading/Unloading' 
  | 'Completed' 
  | 'Departed';

export interface VesselCall {
  id: string;
  callSign: string; // e.g. CALL-2026-081
  vesselName: string;
  shippingLineName: string;
  berthName: string;
  eta: string;
  etd: string;
  inboundTeu: number;
  outboundTeu: number;
  status: VesselCallStatus;
}

export type GateTransactionType = 
  | 'Gate In Import' 
  | 'Gate In Export' 
  | 'Gate Out Import' 
  | 'Gate Out Export';

export interface GateTransaction {
  id: string;
  containerNumber: string; // e.g. MSKU-901829-1
  categoryCode: string;
  sealNumber: string;
  truckPlate: string;
  driverName: string;
  transactionType: GateTransactionType;
  yardBlockCode: string;
  yardLocation: string; // Row-Tier e.g. R04-T02
  timestamp: string;
  status: 'Completed' | 'In Yard' | 'Dispatched';
}

export interface ContainerJob {
  id: string;
  jobCode: string; // e.g. JOB-2026-901
  containerNumber: string;
  equipmentCode: string;
  operatorName: string;
  fromLocation: string;
  toLocation: string;
  timestamp: string;
  status: 'Queued' | 'In Progress' | 'Completed';
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'Super Admin' | 'Terminal Manager' | 'Gate Controller' | 'Stevedoring Manager';
}
