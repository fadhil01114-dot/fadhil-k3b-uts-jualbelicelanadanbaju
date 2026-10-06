import { 
  Vessel, Port, CargoType, Shipper, CrewMember, Voyage, CargoBooking, MaintenanceLog 
} from '../types/shipping';

export const INITIAL_VESSELS: Vessel[] = [
  {
    id: 'ves-001',
    name: 'MV Samudera Express I',
    imoNumber: 'IMO 9812041',
    vesselType: 'Container Ship',
    dwtCapacity: 35000,
    flag: 'Indonesia 🇮🇩',
    buildYear: 2021,
    status: 'In Voyage',
    captainName: 'Capt. Bambang Suryono',
    photoUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'ves-002',
    name: 'MV Nusantara Trans Carrier',
    imoNumber: 'IMO 9723019',
    vesselType: 'Bulk Carrier',
    dwtCapacity: 52000,
    flag: 'Indonesia 🇮🇩',
    buildYear: 2019,
    status: 'Active',
    captainName: 'Capt. Hendra Gunawan',
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-12T08:00:00Z'
  },
  {
    id: 'ves-003',
    name: 'MT Java Pioneer Tanker',
    imoNumber: 'IMO 9619082',
    vesselType: 'Oil Tanker',
    dwtCapacity: 42000,
    flag: 'Indonesia 🇮🇩',
    buildYear: 2020,
    status: 'In Voyage',
    captainName: 'Capt. Rahmat Hidayat',
    photoUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'ves-004',
    name: 'TB Bornean Tug & Barge 08',
    imoNumber: 'IMO 9401290',
    vesselType: 'Tugboat / Barge',
    dwtCapacity: 12000,
    flag: 'Indonesia 🇮🇩',
    buildYear: 2018,
    status: 'Under Maintenance',
    captainName: 'Capt. Agus Suprianto',
    photoUrl: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-18T08:00:00Z'
  }
];

export const INITIAL_PORTS: Port[] = [
  {
    id: 'port-001',
    name: 'Pelabuhan Tanjung Priok',
    code: 'IDTPP',
    city: 'Jakarta Utara',
    country: 'Indonesia',
    maxDraft: 14.0,
    berthCapacity: 24,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'port-002',
    name: 'Pelabuhan Tanjung Perak',
    code: 'IDSUB',
    city: 'Surabaya',
    country: 'Indonesia',
    maxDraft: 12.5,
    berthCapacity: 18,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'port-003',
    name: 'Pelabuhan Belawan',
    code: 'IDBLW',
    city: 'Medan',
    country: 'Indonesia',
    maxDraft: 11.0,
    berthCapacity: 14,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'port-004',
    name: 'Pelabuhan Soekarno-Hatta',
    code: 'IDMAK',
    city: 'Makassar',
    country: 'Indonesia',
    maxDraft: 12.0,
    berthCapacity: 16,
    createdAt: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_CARGO_TYPES: CargoType[] = [
  {
    id: 'cargo-001',
    name: 'Kontainer 20ft Standard Dry',
    category: 'Container 20ft',
    standardRatePerUnit: 8500000,
    unitName: 'TEU',
    description: 'Muatan barang umum kering standar ukuran 20 kaki'
  },
  {
    id: 'cargo-002',
    name: 'Kontainer 40ft High Cube',
    category: 'Container 40ft',
    standardRatePerUnit: 14200000,
    unitName: 'FEU',
    description: 'Muatan volume besar kapasitas 40 kaki High Cube'
  },
  {
    id: 'cargo-003',
    name: 'Minyak Kelapa Sawit (CPO Bulk)',
    category: 'Liquid Bulk',
    standardRatePerUnit: 420000,
    unitName: 'Kilo Liter',
    description: 'Muatan curah cair CPO menggunakan kapal tanker khusus'
  },
  {
    id: 'cargo-004',
    name: 'Batu Bara & Mineral',
    category: 'Dry Bulk',
    standardRatePerUnit: 280000,
    unitName: 'Metric Ton',
    description: 'Muatan curah kering menggunakan kapal tongkang/bulk'
  }
];

export const INITIAL_SHIPPERS: Shipper[] = [
  {
    id: 'ship-001',
    companyName: 'PT Indofood Sukses Makmur Tbk',
    npwp: '01.302.409.2-092.000',
    contactPerson: 'Bpk. Irwan Setiawan',
    email: 'logistics@indofood.co.id',
    phone: '021-57958822',
    address: 'Indofood Tower Lt. 23, Jl. Jend. Sudirman, Jakarta',
    creditLimit: 5000000000,
    totalBookings: 18
  },
  {
    id: 'ship-002',
    companyName: 'PT Krakatau Steel Tbk',
    npwp: '01.000.129.8-062.000',
    contactPerson: 'Ibu Rina Wijaya',
    email: 'shipping@krakatausteel.com',
    phone: '0254-392111',
    address: 'Kawasan Industri Cilegon, Banten',
    creditLimit: 8000000000,
    totalBookings: 24
  },
  {
    id: 'ship-003',
    companyName: 'PT Wilmar Nabati Indonesia',
    npwp: '02.401.992.1-011.000',
    contactPerson: 'Bpk. Denny Hartono',
    email: 'cpo.export@wilmar.co.id',
    phone: '031-3291880',
    address: 'Jl. Lingkar Timur, Gresik, Jawa Timur',
    creditLimit: 12000000000,
    totalBookings: 32
  },
  {
    id: 'ship-004',
    companyName: 'PT Unilever Indonesia Tbk',
    npwp: '01.300.901.4-054.000',
    contactPerson: 'Ibu Maya Putri',
    email: 'supply.chain@unilever.co.id',
    phone: '021-80827000',
    address: 'BSD Green Office Park, Tangerang',
    creditLimit: 6000000000,
    totalBookings: 15
  }
];

export const INITIAL_CREWS: CrewMember[] = [
  {
    id: 'crew-001',
    fullName: 'Capt. Bambang Suryono',
    rank: 'Nakhoda (Captain)',
    certificateNo: 'ANT-I / 9021882',
    assignedVesselId: 'ves-001',
    status: 'On Duty'
  },
  {
    id: 'crew-002',
    fullName: 'Ir. Herman Wijaya',
    rank: 'KKM (Chief Engineer)',
    certificateNo: 'ATT-I / 8829011',
    assignedVesselId: 'ves-001',
    status: 'On Duty'
  },
  {
    id: 'crew-003',
    fullName: 'Mualim Aris Setiawan',
    rank: 'Mualim I (Chief Officer)',
    certificateNo: 'ANT-II / 9102831',
    assignedVesselId: 'ves-002',
    status: 'Available'
  },
  {
    id: 'crew-004',
    fullName: 'Masinis Budi Santoso',
    rank: 'Masinis I (First Engineer)',
    certificateNo: 'ATT-II / 9301928',
    assignedVesselId: 'ves-003',
    status: 'On Duty'
  }
];

export const INITIAL_VOYAGES: Voyage[] = [
  {
    id: 'voy-001',
    voyageNumber: 'VOY-2026-001',
    vesselId: 'ves-001',
    vesselName: 'MV Samudera Express I',
    originPortId: 'port-001',
    originPortName: 'Pelabuhan Tanjung Priok (Jakarta)',
    destinationPortId: 'port-002',
    destinationPortName: 'Pelabuhan Tanjung Perak (Surabaya)',
    etd: '2026-10-05',
    eta: '2026-10-08',
    status: 'Sailing',
    captainName: 'Capt. Bambang Suryono',
    totalFreightValue: 245000000,
    createdAt: '2026-10-01T10:00:00Z'
  },
  {
    id: 'voy-002',
    voyageNumber: 'VOY-2026-002',
    vesselId: 'ves-003',
    vesselName: 'MT Java Pioneer Tanker',
    originPortId: 'port-002',
    originPortName: 'Pelabuhan Tanjung Perak (Surabaya)',
    destinationPortId: 'port-003',
    destinationPortName: 'Pelabuhan Belawan (Medan)',
    etd: '2026-10-06',
    eta: '2026-10-10',
    status: 'Loading',
    captainName: 'Capt. Rahmat Hidayat',
    totalFreightValue: 380000000,
    createdAt: '2026-10-02T11:00:00Z'
  },
  {
    id: 'voy-003',
    voyageNumber: 'VOY-2026-003',
    vesselId: 'ves-002',
    vesselName: 'MV Nusantara Trans Carrier',
    originPortId: 'port-001',
    originPortName: 'Pelabuhan Tanjung Priok (Jakarta)',
    destinationPortId: 'port-004',
    destinationPortName: 'Pelabuhan Soekarno-Hatta (Makassar)',
    etd: '2026-10-10',
    eta: '2026-10-14',
    status: 'Scheduled',
    captainName: 'Capt. Hendra Gunawan',
    totalFreightValue: 190000000,
    createdAt: '2026-10-03T14:00:00Z'
  }
];

export const INITIAL_BOOKINGS: CargoBooking[] = [
  {
    id: 'book-001',
    bookingNumber: 'BL-2026-0101',
    voyageId: 'voy-001',
    voyageNumber: 'VOY-2026-001',
    shipperId: 'ship-001',
    shipperName: 'PT Indofood Sukses Makmur Tbk',
    cargoTypeId: 'cargo-001',
    cargoTypeName: 'Kontainer 20ft Standard Dry',
    quantity: 12,
    totalFreightFee: 102000000,
    paymentStatus: 'Paid In Full',
    cargoStatus: 'In Transit',
    createdAt: '2026-10-02T09:00:00Z'
  },
  {
    id: 'book-002',
    bookingNumber: 'BL-2026-0102',
    voyageId: 'voy-001',
    voyageNumber: 'VOY-2026-001',
    shipperId: 'ship-004',
    shipperName: 'PT Unilever Indonesia Tbk',
    cargoTypeId: 'cargo-002',
    cargoTypeName: 'Kontainer 40ft High Cube',
    quantity: 10,
    totalFreightFee: 142000000,
    paymentStatus: 'Paid In Full',
    cargoStatus: 'In Transit',
    createdAt: '2026-10-02T14:00:00Z'
  },
  {
    id: 'book-003',
    bookingNumber: 'BL-2026-0103',
    voyageId: 'voy-002',
    voyageNumber: 'VOY-2026-002',
    shipperId: 'ship-003',
    shipperName: 'PT Wilmar Nabati Indonesia',
    cargoTypeId: 'cargo-003',
    cargoTypeName: 'Minyak Kelapa Sawit (CPO Bulk)',
    quantity: 900,
    totalFreightFee: 378000000,
    paymentStatus: 'Partial',
    cargoStatus: 'Loaded',
    createdAt: '2026-10-04T11:00:00Z'
  }
];

export const INITIAL_MAINTENANCES: MaintenanceLog[] = [
  {
    id: 'maint-001',
    vesselId: 'ves-004',
    vesselName: 'TB Bornean Tug & Barge 08',
    maintenanceType: 'Routine Overhaul',
    startDate: '2026-10-01',
    endDate: '2026-10-12',
    costAmount: 45000000,
    vendorName: 'PT Docking Surabaya Perdana',
    status: 'In Progress',
    notes: 'Perbaikan mesin utama & pengecekan baling-baling kapal'
  }
];
