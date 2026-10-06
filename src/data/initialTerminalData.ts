import { 
  YardBlock, Equipment, Berth, ContainerCategory, ShippingLine, 
  VesselCall, GateTransaction, ContainerJob 
} from '../types/terminal';

export const INITIAL_YARD_BLOCKS: YardBlock[] = [
  {
    id: 'block-001',
    blockCode: 'Blok A1 (Dry Import)',
    capacityTeu: 1200,
    currentTeuCount: 840,
    totalRows: 12,
    totalTiers: 5,
    categoryAllowed: 'Dry Standard 20ft/40ft',
    status: 'Active'
  },
  {
    id: 'block-002',
    blockCode: 'Blok B2 (Dry Export)',
    capacityTeu: 1500,
    currentTeuCount: 1120,
    totalRows: 15,
    totalTiers: 5,
    categoryAllowed: 'Dry Standard 20ft/40ft',
    status: 'Active'
  },
  {
    id: 'block-003',
    blockCode: 'Blok R1 (Reefer Pendingin)',
    capacityTeu: 450,
    currentTeuCount: 310,
    totalRows: 8,
    totalTiers: 4,
    categoryAllowed: 'Reefer Container (Pluk-in Power)',
    status: 'Active'
  },
  {
    id: 'block-004',
    blockCode: 'Blok DG-01 (Hazardous Cargo)',
    capacityTeu: 300,
    currentTeuCount: 95,
    totalRows: 6,
    totalTiers: 3,
    categoryAllowed: 'Dangerous Goods Class 1-9',
    status: 'Active'
  }
];

export const INITIAL_EQUIPMENTS: Equipment[] = [
  {
    id: 'eq-001',
    code: 'QC-01 (Super Post Panamax)',
    equipmentType: 'Quay Crane (QC)',
    maxCapacityTons: 65,
    operatorName: 'Bpk. Ridwan Setiawan',
    status: 'In Use'
  },
  {
    id: 'eq-002',
    code: 'RTG-02 (Yard Crane)',
    equipmentType: 'Rubber Tyred Gantry (RTG)',
    maxCapacityTons: 40,
    operatorName: 'Bpk. Ahmad Fauzi',
    status: 'Operational'
  },
  {
    id: 'eq-003',
    code: 'RS-01 (Reach Stacker)',
    equipmentType: 'Reach Stacker (RS)',
    maxCapacityTons: 45,
    operatorName: 'Bpk. Deni Saputra',
    status: 'Operational'
  },
  {
    id: 'eq-004',
    code: 'SL-04 (Side Loader)',
    equipmentType: 'Side Loader',
    maxCapacityTons: 25,
    operatorName: 'Bpk. Hadi Wijaya',
    status: 'Under Maintenance'
  }
];

export const INITIAL_BERTHS: Berth[] = [
  {
    id: 'berth-001',
    name: 'Dermaga Internasional 01 (Quay 1)',
    lengthMeters: 350,
    maxDraft: 14.5,
    craneCount: 4,
    status: 'Occupied'
  },
  {
    id: 'berth-002',
    name: 'Dermaga Internasional 02 (Quay 2)',
    lengthMeters: 300,
    maxDraft: 13.5,
    craneCount: 3,
    status: 'Occupied'
  },
  {
    id: 'berth-003',
    name: 'Dermaga Domestik A (Quay 3)',
    lengthMeters: 250,
    maxDraft: 11.5,
    craneCount: 2,
    status: 'Available'
  }
];

export const INITIAL_CONTAINER_CATEGORIES: ContainerCategory[] = [
  {
    id: 'cat-001',
    code: '20GP',
    name: '20ft General Purpose Dry',
    size: '20ft',
    type: 'Dry Standard',
    handlingFeePerShift: 1250000
  },
  {
    id: 'cat-002',
    code: '40HC',
    name: '40ft High Cube Container',
    size: '40ft',
    type: 'High Cube',
    handlingFeePerShift: 1950000
  },
  {
    id: 'cat-003',
    code: '20RF',
    name: '20ft Reefer Power Container',
    size: '20ft',
    type: 'Reefer / Pendingin',
    handlingFeePerShift: 2450000
  },
  {
    id: 'cat-004',
    code: '40FR',
    name: '40ft Flat Rack Oversized',
    size: '40ft',
    type: 'Flat Rack',
    handlingFeePerShift: 2800000
  }
];

export const INITIAL_SHIPPING_LINES: ShippingLine[] = [
  {
    id: 'line-001',
    lineName: 'Maersk Line A/S',
    isoCode: 'MAEU',
    contactPerson: 'Bpk. Christian Lind',
    email: 'ops.indonesia@maersk.com',
    phone: '021-30065000',
    country: 'Denmark 🇩🇰'
  },
  {
    id: 'line-002',
    lineName: 'Evergreen Marine Corp',
    isoCode: 'EGLV',
    contactPerson: 'Ibu Evelyn Tan',
    email: 'booking@evergreen-marine.co.id',
    phone: '021-52901188',
    country: 'Taiwan 🇹🇼'
  },
  {
    id: 'line-003',
    lineName: 'PT Samudera Indonesia Tbk',
    isoCode: 'SUDU',
    contactPerson: 'Bpk. Irwan Setiawan',
    email: 'terminal.ops@samudera.id',
    phone: '021-5344888',
    country: 'Indonesia 🇮🇩'
  },
  {
    id: 'line-004',
    lineName: 'PT Meratus Line',
    isoCode: 'MRT',
    contactPerson: 'Bpk. Yudi Kurniawan',
    email: 'ops.tps@meratusline.com',
    phone: '031-3292288',
    country: 'Indonesia 🇮🇩'
  }
];

export const INITIAL_VESSEL_CALLS: VesselCall[] = [
  {
    id: 'call-001',
    callSign: 'CALL-2026-081',
    vesselName: 'MV Maersk Seletar',
    shippingLineName: 'Maersk Line A/S',
    berthName: 'Dermaga Internasional 01 (Quay 1)',
    eta: '2026-10-05 08:00',
    etd: '2026-10-07 18:00',
    inboundTeu: 850,
    outboundTeu: 720,
    status: 'Loading/Unloading'
  },
  {
    id: 'call-002',
    callSign: 'CALL-2026-082',
    vesselName: 'MV Ever Given II',
    shippingLineName: 'Evergreen Marine Corp',
    berthName: 'Dermaga Internasional 02 (Quay 2)',
    eta: '2026-10-06 10:00',
    etd: '2026-10-08 20:00',
    inboundTeu: 920,
    outboundTeu: 680,
    status: 'Berthing'
  },
  {
    id: 'call-003',
    callSign: 'CALL-2026-083',
    vesselName: 'MV Sinar Sunda',
    shippingLineName: 'PT Samudera Indonesia Tbk',
    berthName: 'Dermaga Domestik A (Quay 3)',
    eta: '2026-10-07 14:00',
    etd: '2026-10-09 12:00',
    inboundTeu: 450,
    outboundTeu: 410,
    status: 'Scheduled'
  }
];

export const INITIAL_GATE_TRANSACTIONS: GateTransaction[] = [
  {
    id: 'gate-001',
    containerNumber: 'MSKU-901829-1',
    categoryCode: '20GP',
    sealNumber: 'SEAL-88201',
    truckPlate: 'B 9812 UI',
    driverName: 'Sdr. Sugeng Rismanto',
    transactionType: 'Gate In Import',
    yardBlockCode: 'Blok A1 (Dry Import)',
    yardLocation: 'Row 04 - Tier 02',
    timestamp: '2026-10-06 09:15',
    status: 'In Yard'
  },
  {
    id: 'gate-002',
    containerNumber: 'EVER-882019-2',
    categoryCode: '40HC',
    sealNumber: 'SEAL-99210',
    truckPlate: 'B 9102 TK',
    driverName: 'Sdr. Dedi Supriyadi',
    transactionType: 'Gate In Export',
    yardBlockCode: 'Blok B2 (Dry Export)',
    yardLocation: 'Row 08 - Tier 03',
    timestamp: '2026-10-06 10:30',
    status: 'In Yard'
  },
  {
    id: 'gate-003',
    containerNumber: 'SAMU-102931-4',
    categoryCode: '20RF',
    sealNumber: 'SEAL-11029',
    truckPlate: 'L 8021 OP',
    driverName: 'Sdr. Bambang Irawan',
    transactionType: 'Gate Out Import',
    yardBlockCode: 'Blok R1 (Reefer Pendingin)',
    yardLocation: 'Row 02 - Tier 01',
    timestamp: '2026-10-06 11:45',
    status: 'Dispatched'
  }
];

export const INITIAL_CONTAINER_JOBS: ContainerJob[] = [
  {
    id: 'job-001',
    jobCode: 'JOB-2026-901',
    containerNumber: 'MSKU-901829-1',
    equipmentCode: 'QC-01 (Super Post Panamax)',
    operatorName: 'Bpk. Ridwan Setiawan',
    fromLocation: 'Ship Deck (MV Maersk Seletar)',
    toLocation: 'Yard Blok A1 (R04-T02)',
    timestamp: '2026-10-06 09:20',
    status: 'Completed'
  },
  {
    id: 'job-002',
    jobCode: 'JOB-2026-902',
    containerNumber: 'EVER-882019-2',
    equipmentCode: 'RTG-02 (Yard Crane)',
    operatorName: 'Bpk. Ahmad Fauzi',
    fromLocation: 'Trailer Truck B 9102 TK',
    toLocation: 'Yard Blok B2 (R08-T03)',
    timestamp: '2026-10-06 10:35',
    status: 'Completed'
  }
];
