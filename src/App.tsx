/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './lib/firebase';
import { 
  seedInitialShippingDataIfEmpty,
  subscribeToVessels,
  subscribeToPorts,
  subscribeToCargoTypes,
  subscribeToShippers,
  subscribeToCrews,
  subscribeToVoyages,
  subscribeToBookings,
  subscribeToMaintenances
} from './lib/shippingDb';
import { 
  Vessel, Port, CargoType, Shipper, CrewMember, Voyage, CargoBooking, MaintenanceLog, UserAccount 
} from './types/shipping';

import { LoginForm } from './components/LoginForm';
import { SidebarNav, NavItemKey } from './components/SidebarNav';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';

// Master Views
import { VesselsMaster } from './components/master/VesselsMaster';
import { PortsMaster } from './components/master/PortsMaster';
import { CargoTypesMaster } from './components/master/CargoTypesMaster';
import { ShippersMaster } from './components/master/ShippersMaster';
import { CrewsMaster } from './components/master/CrewsMaster';

// Transaksi Views
import { VoyagesTx } from './components/transaksi/VoyagesTx';
import { CargoBookingsTx } from './components/transaksi/CargoBookingsTx';
import { MaintenancesTx } from './components/transaksi/MaintenancesTx';

// Laporan Views
import { FinancialReports } from './components/laporan/FinancialReports';
import { FleetUtilisationReports } from './components/laporan/FleetUtilisationReports';
import { CargoReports } from './components/laporan/CargoReports';

export default function App() {
  // Session User State (Default is null -> shows Login Form by default as requested)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Active Screen Tab
  const [activeTab, setActiveTab] = useState<NavItemKey>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Real-time Database Collections
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [cargoTypes, setCargoTypes] = useState<CargoType[]>([]);
  const [shippers, setShippers] = useState<Shipper[]>([]);
  const [crews, setCrews] = useState<CrewMember[]>([]);
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [bookings, setBookings] = useState<CargoBooking[]>([]);
  const [maintenances, setMaintenances] = useState<MaintenanceLog[]>([]);
  const [dbLoading, setDbLoading] = useState<boolean>(true);

  // 1. Initial Connection Test & Firestore Database Seed
  useEffect(() => {
    async function initDatabase() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection')).catch(() => {});
        await seedInitialShippingDataIfEmpty();
      } catch (err) {
        console.error('Firestore connection initialization failed:', err);
      } finally {
        setDbLoading(false);
      }
    }
    initDatabase();
  }, []);

  // 2. Real-time Subscriptions to Firestore Collections
  useEffect(() => {
    const unsubVessels = subscribeToVessels(setVessels);
    const unsubPorts = subscribeToPorts(setPorts);
    const unsubCargos = subscribeToCargoTypes(setCargoTypes);
    const unsubShippers = subscribeToShippers(setShippers);
    const unsubCrews = subscribeToCrews(setCrews);
    const unsubVoyages = subscribeToVoyages(setVoyages);
    const unsubBookings = subscribeToBookings(setBookings);
    const unsubMaintenances = subscribeToMaintenances(setMaintenances);

    return () => {
      unsubVessels();
      unsubPorts();
      unsubCargos();
      unsubShippers();
      unsubCrews();
      unsubVoyages();
      unsubBookings();
      unsubMaintenances();
    };
  }, []);

  // Requirement 3: Default view is LoginForm for Admin Login
  if (!currentUser) {
    return <LoginForm onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex antialiased">
      
      {/* Left Sidebar Navigation */}
      <SidebarNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        
        {/* Top Navbar */}
        <Navbar
          user={currentUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dynamic Screen View */}
        <main className="p-6 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          
          {dbLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">Menghubungkan ke Real-time Database Firestore...</p>
            </div>
          ) : (
            <>
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  vessels={vessels}
                  voyages={voyages}
                  bookings={bookings}
                  ports={ports}
                  maintenances={maintenances}
                  onNavigateTab={setActiveTab}
                />
              )}

              {/* Master Data Screens */}
              {activeTab === 'master_vessels' && <VesselsMaster vessels={vessels} />}
              {activeTab === 'master_ports' && <PortsMaster ports={ports} />}
              {activeTab === 'master_cargos' && <CargoTypesMaster cargoTypes={cargoTypes} />}
              {activeTab === 'master_shippers' && <ShippersMaster shippers={shippers} />}
              {activeTab === 'master_crews' && <CrewsMaster crews={crews} vessels={vessels} />}

              {/* Transaksi Data Screens */}
              {activeTab === 'tx_voyages' && <VoyagesTx voyages={voyages} vessels={vessels} ports={ports} />}
              {activeTab === 'tx_bookings' && (
                <CargoBookingsTx
                  bookings={bookings}
                  voyages={voyages}
                  shippers={shippers}
                  cargoTypes={cargoTypes}
                />
              )}
              {activeTab === 'tx_maintenances' && <MaintenancesTx maintenances={maintenances} vessels={vessels} />}

              {/* Laporan & Analitik Screens */}
              {activeTab === 'rpt_financial' && (
                <FinancialReports
                  bookings={bookings}
                  maintenances={maintenances}
                  voyages={voyages}
                />
              )}
              {activeTab === 'rpt_utilisation' && (
                <FleetUtilisationReports vessels={vessels} voyages={voyages} />
              )}
              {activeTab === 'rpt_cargos' && (
                <CargoReports bookings={bookings} shippers={shippers} />
              )}
            </>
          )}

        </main>

      </div>

    </div>
  );
}
