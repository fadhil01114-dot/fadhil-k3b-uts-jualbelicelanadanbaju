import { 
  PassengerShip, ShipRoute, TicketClass, CargoCategory, TicketAgent, 
  ShipVoyage, PassengerTicket, CargoManifest 
} from '../types/passengerCargo';

export const INITIAL_PASSENGER_SHIPS: PassengerShip[] = [
  {
    id: 'ship-001',
    name: 'KM Kelud',
    vesselType: 'Kapal Penumpang PELNI',
    passengerCapacity: 1800,
    vehicleCapacity: 60,
    cargoCapacityTons: 400,
    captainName: 'Capt. Bambang Suryono, M.Mar',
    status: 'In Voyage'
  },
  {
    id: 'ship-002',
    name: 'KM Labobar',
    vesselType: 'Kapal Penumpang PELNI',
    passengerCapacity: 3000,
    vehicleCapacity: 80,
    cargoCapacityTons: 600,
    captainName: 'Capt. Hendra Gunawan',
    status: 'Active'
  },
  {
    id: 'ship-003',
    name: 'KMP Ferrindo V (Ro-Ro Ferry)',
    vesselType: 'Kapal Ro-Ro Ferry',
    passengerCapacity: 850,
    vehicleCapacity: 120,
    cargoCapacityTons: 800,
    captainName: 'Capt. Rahmat Hidayat',
    status: 'In Voyage'
  },
  {
    id: 'ship-004',
    name: 'KM Express Bahari 99',
    vesselType: 'Kapal Express Bahari',
    passengerCapacity: 450,
    vehicleCapacity: 0,
    cargoCapacityTons: 50,
    captainName: 'Capt. Agus Suprianto',
    status: 'Docked'
  }
];

export const INITIAL_SHIP_ROUTES: ShipRoute[] = [
  {
    id: 'route-001',
    routeCode: 'RUT-01 (Priok - Perak - Makassar)',
    originPort: 'Pelabuhan Tanjung Priok (Jakarta)',
    transitPort: 'Pelabuhan Tanjung Perak (Surabaya)',
    destinationPort: 'Pelabuhan Soekarno-Hatta (Makassar)',
    distanceMiles: 820,
    durationHours: 42
  },
  {
    id: 'route-002',
    routeCode: 'RUT-02 (Perak - Belawan)',
    originPort: 'Pelabuhan Tanjung Perak (Surabaya)',
    destinationPort: 'Pelabuhan Belawan (Medan)',
    distanceMiles: 960,
    durationHours: 48
  },
  {
    id: 'route-003',
    routeCode: 'RUT-03 (Merak - Bakauheni Ro-Ro)',
    originPort: 'Pelabuhan Merak (Banten)',
    destinationPort: 'Pelabuhan Bakauheni (Lampung)',
    distanceMiles: 18,
    durationHours: 2
  }
];

export const INITIAL_TICKET_CLASSES: TicketClass[] = [
  {
    id: 'class-001',
    className: 'Kelas I Executive (Kabin 2 Bed)',
    fareAdult: 850000,
    fareChild: 650000,
    facilities: 'Kabin AC Privat 2 Tempat Tidur, TV, Kamar Mandi Dalam, Makan 3x'
  },
  {
    id: 'class-002',
    className: 'Kelas II Business (Kabin 4 Bed)',
    fareAdult: 580000,
    fareChild: 420000,
    facilities: 'Kabin AC 4 Tempat Tidur, Kamar Mandi Dalam, Makan 3x'
  },
  {
    id: 'class-003',
    className: 'Kelas Ekonomi Deck AC',
    fareAdult: 320000,
    fareChild: 240000,
    facilities: 'Bangku/Kasur Hall AC Terbuka, Makan 3x, Air Minum'
  }
];

export const INITIAL_CARGO_CATEGORIES: CargoCategory[] = [
  {
    id: 'cgo-cat-001',
    categoryName: 'Gol I Sepeda Motor 2 Roda',
    fareRate: 180000,
    unit: 'Unit / Kendaraan'
  },
  {
    id: 'cgo-cat-002',
    categoryName: 'Gol IV Mobil Pribadi (Sedan/SUV/Minibus)',
    fareRate: 1450000,
    unit: 'Unit / Kendaraan'
  },
  {
    id: 'cgo-cat-003',
    categoryName: 'Gol VI Truk Sedang Box / Fuso',
    fareRate: 3800000,
    unit: 'Unit / Kendaraan'
  },
  {
    id: 'cgo-cat-004',
    categoryName: 'General Cargo Pelayaran per Tonase',
    fareRate: 280000,
    unit: 'Ton / Tonase'
  }
];

export const INITIAL_TICKET_AGENTS: TicketAgent[] = [
  {
    id: 'agent-001',
    agentCode: 'AG-PELNI-01',
    agentName: 'PT PELNI Loket Resmi Pusat',
    contactPerson: 'Ibu Ratna Juwita',
    phone: '021-63871111',
    email: 'loket.pusat@pelni.co.id',
    commissionPercent: 5
  },
  {
    id: 'agent-002',
    agentCode: 'AG-BAHARI-02',
    agentName: 'PT Loket Bahari Utama Travel',
    contactPerson: 'Bpk. Budi Santoso',
    phone: '031-3291029',
    email: 'booking@loketbahari.co.id',
    commissionPercent: 8
  }
];

export const INITIAL_SHIP_VOYAGES: ShipVoyage[] = [
  {
    id: 'voy-001',
    voyageCode: 'VOY-KELUD-08',
    shipName: 'KM Kelud',
    routeCode: 'RUT-01 (Priok - Perak - Makassar)',
    originPort: 'Pelabuhan Tanjung Priok (Jakarta)',
    destinationPort: 'Pelabuhan Soekarno-Hatta (Makassar)',
    etd: '2026-10-06 14:00',
    eta: '2026-10-08 08:00',
    bookedPassengers: 1240,
    bookedVehicles: 38,
    status: 'Boarding Open'
  },
  {
    id: 'voy-002',
    voyageCode: 'VOY-LABOBAR-12',
    shipName: 'KM Labobar',
    routeCode: 'RUT-02 (Perak - Belawan)',
    originPort: 'Pelabuhan Tanjung Perak (Surabaya)',
    destinationPort: 'Pelabuhan Belawan (Medan)',
    etd: '2026-10-07 10:00',
    eta: '2026-10-09 10:00',
    bookedPassengers: 2100,
    bookedVehicles: 52,
    status: 'Scheduled'
  },
  {
    id: 'voy-003',
    voyageCode: 'VOY-FERRINDO-05',
    shipName: 'KMP Ferrindo V (Ro-Ro Ferry)',
    routeCode: 'RUT-03 (Merak - Bakauheni Ro-Ro)',
    originPort: 'Pelabuhan Merak (Banten)',
    destinationPort: 'Pelabuhan Bakauheni (Lampung)',
    etd: '2026-10-06 09:00',
    eta: '2026-10-06 11:00',
    bookedPassengers: 620,
    bookedVehicles: 95,
    status: 'Sailing'
  }
];

export const INITIAL_PASSENGER_TICKETS: PassengerTicket[] = [
  {
    id: 'tkt-001',
    pnrCode: 'PNR-2026-90182',
    voyageCode: 'VOY-KELUD-08',
    passengerName: 'Bpk. Ahmad Ridwan',
    nikNumber: '3174092108820001',
    gender: 'Laki-laki',
    age: 38,
    ticketClass: 'Kelas I Executive (Kabin 2 Bed)',
    cabinBedNo: 'Kabin 102 - Bed A',
    fareAmount: 850000,
    status: 'Boarded / Check-In'
  },
  {
    id: 'tkt-002',
    pnrCode: 'PNR-2026-90183',
    voyageCode: 'VOY-KELUD-08',
    passengerName: 'Ibu Siti Nurhaliza',
    nikNumber: '3174095209850002',
    gender: 'Perempuan',
    age: 35,
    ticketClass: 'Kelas I Executive (Kabin 2 Bed)',
    cabinBedNo: 'Kabin 102 - Bed B',
    fareAmount: 850000,
    status: 'Boarded / Check-In'
  },
  {
    id: 'tkt-003',
    pnrCode: 'PNR-2026-90184',
    voyageCode: 'VOY-KELUD-08',
    passengerName: 'Sdr. Agus Setiawan',
    nikNumber: '3578011204980003',
    gender: 'Laki-laki',
    age: 26,
    ticketClass: 'Kelas Ekonomi Deck AC',
    cabinBedNo: 'Hall Deck B - Bed 142',
    fareAmount: 320000,
    status: 'Booked'
  }
];

export const INITIAL_CARGO_MANIFESTS: CargoManifest[] = [
  {
    id: 'cgo-001',
    manifestNo: 'CGO-2026-1029',
    voyageCode: 'VOY-KELUD-08',
    shipperName: 'PT Indofood Sukses Makmur Tbk',
    cargoCategory: 'Gol VI Truk Sedang Box / Fuso',
    itemDescription: 'Muatan Sembako Indomie 1200 Karton',
    truckPlate: 'B 9812 UI',
    weightTon: 14,
    fareAmount: 3800000,
    status: 'Loaded'
  },
  {
    id: 'cgo-002',
    manifestNo: 'CGO-2026-1030',
    voyageCode: 'VOY-FERRINDO-05',
    shipperName: 'Sdr. Hendra Pratama (Pribadi)',
    cargoCategory: 'Gol IV Mobil Pribadi (Sedan/SUV/Minibus)',
    itemDescription: 'Mobil Pribadi Honda CR-V',
    truckPlate: 'B 1029 KLO',
    weightTon: 2,
    fareAmount: 1450000,
    status: 'Shipped'
  }
];
