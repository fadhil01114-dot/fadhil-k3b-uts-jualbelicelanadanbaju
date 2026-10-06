/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './lib/firebase';
import { 
  seedInitialPassengerCargoDataIfEmpty,
  subscribeToPassengerShips,
  subscribeToShipRoutes,
  subscribeToTicketClasses,
  subscribeToCargoCategories,
  subscribeToTicketAgents,
  subscribeToShipVoyages,
  subscribeToPassengerTickets,
  subscribeToCargoManifests
} from './lib/passengerCargoDb';
import { 
  PassengerShip, ShipRoute, TicketClass, CargoCategory, TicketAgent, 
  ShipVoyage, PassengerTicket, CargoManifest, UserAccount 
} from './types/passengerCargo';

// Nav & Core Shell Components
import { PassengerCargoLoginForm } from './components/passengercargo/PassengerCargoLoginForm';
import { PassengerCargoSidebarNav, PassengerCargoNavKey } from './components/passengercargo/PassengerCargoSidebarNav';
import { PassengerCargoNavbar } from './components/passengercargo/PassengerCargoNavbar';
import { PassengerCargoDashboard } from './components/passengercargo/PassengerCargoDashboard';

// Master Data Screens
import { PassengerShipsMaster } from './components/passengercargo/master/PassengerShipsMaster';
import { ShipRoutesMaster } from './components/passengercargo/master/ShipRoutesMaster';
import { TicketClassesMaster } from './components/passengercargo/master/TicketClassesMaster';
import { CargoCategoriesMaster } from './components/passengercargo/master/CargoCategoriesMaster';
import { TicketAgentsMaster } from './components/passengercargo/master/TicketAgentsMaster';

// Transaksi Data Screens
import { ShipVoyagesTx } from './components/passengercargo/transaksi/ShipVoyagesTx';
import { PassengerTicketsTx } from './components/passengercargo/transaksi/PassengerTicketsTx';
import { CargoManifestsTx } from './components/passengercargo/transaksi/CargoManifestsTx';

// Laporan Screens
import { PassengerManifestReport } from './components/passengercargo/laporan/PassengerManifestReport';
import { CargoManifestReport } from './components/passengercargo/laporan/CargoManifestReport';
import { RevenueReport } from './components/passengercargo/laporan/RevenueReport';

export default function App() {
  // Requirement 3: Default view is LoginForm for Admin Login (currentUser = null initially)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Active Screen Tab
  const [activeTab, setActiveTab] = useState<PassengerCargoNavKey>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Real-time Database Firestore Collections
  const [ships, setShips] = useState<PassengerShip[]>([]);
  const [routes, setRoutes] = useState<ShipRoute[]>([]);
  const [ticketClasses, setTicketClasses] = useState<TicketClass[]>([]);
  const [cargoCategories, setCargoCategories] = useState<CargoCategory[]>([]);
  const [agents, setAgents] = useState<TicketAgent[]>([]);
  const [voyages, setVoyages] = useState<ShipVoyage[]>([]);
  const [tickets, setTickets] = useState<PassengerTicket[]>([]);
  const [cargoManifests, setCargoManifests] = useState<CargoManifest[]>([]);
  const [dbLoading, setDbLoading] = useState<boolean>(true);

  // 1. Initial Firestore DB Connection & Seeding test
  useEffect(() => {
    async function initDatabase() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection')).catch(() => {});
        await seedInitialPassengerCargoDataIfEmpty();
      } catch (err) {
        console.error('Firestore connection initialization failed:', err);
      } finally {
        setDbLoading(false);
      }
    }
    initDatabase();
  }, []);

  // 2. Real-time Subscriptions to Firestore Collections (Single Source of Truth)
  useEffect(() => {
    const unsubShips = subscribeToPassengerShips(setShips);
    const unsubRoutes = subscribeToShipRoutes(setRoutes);
    const unsubClasses = subscribeToTicketClasses(setTicketClasses);
    const unsubCat = subscribeToCargoCategories(setCargoCategories);
    const unsubAgents = subscribeToTicketAgents(setAgents);
    const unsubVoyages = subscribeToShipVoyages(setVoyages);
    const unsubTickets = subscribeToPassengerTickets(setTickets);
    const unsubManifests = subscribeToCargoManifests(setCargoManifests);

    return () => {
      unsubShips();
      unsubRoutes();
      unsubClasses();
      unsubCat();
      unsubAgents();
      unsubVoyages();
      unsubTickets();
      unsubManifests();
    };
  }, []);

  // Requirement 3: Default View is LoginForm
  if (!currentUser) {
    return <PassengerCargoLoginForm onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex antialiased">
      
      {/* Left Navigation Sidebar */}
      <PassengerCargoSidebarNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Main Screen Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        
        {/* Top Navbar */}
        <PassengerCargoNavbar
          user={currentUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dynamic Body Content */}
        <main className="p-6 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          
          {dbLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">Menghubungkan ke Real-time Database Firestore...</p>
            </div>
          ) : (
            <>
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <PassengerCargoDashboard
                  ships={ships}
                  voyages={voyages}
                  tickets={tickets}
                  cargoManifests={cargoManifests}
                  onNavigateTab={setActiveTab}
                />
              )}

              {/* Master Data Screens */}
              {activeTab === 'master_ships' && <PassengerShipsMaster ships={ships} />}
              {activeTab === 'master_routes' && <ShipRoutesMaster routes={routes} />}
              {activeTab === 'master_classes' && <TicketClassesMaster ticketClasses={ticketClasses} />}
              {activeTab === 'master_cargo_categories' && <CargoCategoriesMaster cargoCategories={cargoCategories} />}
              {activeTab === 'master_agents' && <TicketAgentsMaster agents={agents} />}

              {/* Transaksi Data Screens */}
              {activeTab === 'tx_voyages' && (
                <ShipVoyagesTx
                  voyages={voyages}
                  ships={ships}
                  routes={routes}
                />
              )}
              {activeTab === 'tx_tickets' && (
                <PassengerTicketsTx
                  tickets={tickets}
                  voyages={voyages}
                  ticketClasses={ticketClasses}
                />
              )}
              {activeTab === 'tx_manifests' && (
                <CargoManifestsTx
                  cargoManifests={cargoManifests}
                  voyages={voyages}
                  cargoCategories={cargoCategories}
                />
              )}

              {/* Laporan & Dokumen Screens */}
              {activeTab === 'rpt_passenger_manifest' && (
                <PassengerManifestReport
                  tickets={tickets}
                  voyages={voyages}
                />
              )}
              {activeTab === 'rpt_cargo_manifest' && (
                <CargoManifestReport
                  cargoManifests={cargoManifests}
                  voyages={voyages}
                />
              )}
              {activeTab === 'rpt_revenue' && (
                <RevenueReport
                  tickets={tickets}
                  cargoManifests={cargoManifests}
                  voyages={voyages}
                />
              )}
            </>
          )}

        </main>

      </div>

    </div>
  );
}
