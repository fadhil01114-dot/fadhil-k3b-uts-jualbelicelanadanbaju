/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './lib/firebase';
import { 
  seedInitialTerminalDataIfEmpty,
  subscribeToYardBlocks,
  subscribeToEquipments,
  subscribeToBerths,
  subscribeToCategories,
  subscribeToShippingLines,
  subscribeToVesselCalls,
  subscribeToGateTransactions,
  subscribeToContainerJobs
} from './lib/terminalDb';
import { 
  YardBlock, Equipment, Berth, ContainerCategory, ShippingLine, 
  VesselCall, GateTransaction, ContainerJob, UserAccount 
} from './types/terminal';

import { TerminalLoginForm } from './components/terminal/TerminalLoginForm';
import { TerminalSidebarNav, TerminalNavKey } from './components/terminal/TerminalSidebarNav';
import { TerminalNavbar } from './components/terminal/TerminalNavbar';
import { TerminalDashboardOverview } from './components/terminal/TerminalDashboardOverview';

// Master Views
import { YardBlocksMaster } from './components/terminal/master/YardBlocksMaster';
import { EquipmentsMaster } from './components/terminal/master/EquipmentsMaster';
import { BerthsMaster } from './components/terminal/master/BerthsMaster';
import { CategoriesMaster } from './components/terminal/master/CategoriesMaster';
import { ShippingLinesMaster } from './components/terminal/master/ShippingLinesMaster';

// Transaksi Views
import { VesselCallsTx } from './components/terminal/transaksi/VesselCallsTx';
import { GateTransactionsTx } from './components/terminal/transaksi/GateTransactionsTx';
import { ContainerJobsTx } from './components/terminal/transaksi/ContainerJobsTx';

// Laporan Views
import { ThroughputReports } from './components/terminal/laporan/ThroughputReports';
import { YardOccupancyReports } from './components/terminal/laporan/YardOccupancyReports';
import { EquipmentProductivityReports } from './components/terminal/laporan/EquipmentProductivityReports';

export default function App() {
  // Session User State (Default is null -> shows Login Form by default as requested)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Active Screen Tab
  const [activeTab, setActiveTab] = useState<TerminalNavKey>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Real-time Database Collections
  const [yardBlocks, setYardBlocks] = useState<YardBlock[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [berths, setBerths] = useState<Berth[]>([]);
  const [categories, setCategories] = useState<ContainerCategory[]>([]);
  const [shippingLines, setShippingLines] = useState<ShippingLine[]>([]);
  const [vesselCalls, setVesselCalls] = useState<VesselCall[]>([]);
  const [gateTransactions, setGateTransactions] = useState<GateTransaction[]>([]);
  const [containerJobs, setContainerJobs] = useState<ContainerJob[]>([]);
  const [dbLoading, setDbLoading] = useState<boolean>(true);

  // 1. Initial Connection Test & Firestore Database Seed
  useEffect(() => {
    async function initDatabase() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection')).catch(() => {});
        await seedInitialTerminalDataIfEmpty();
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
    const unsubYard = subscribeToYardBlocks(setYardBlocks);
    const unsubEq = subscribeToEquipments(setEquipments);
    const unsubBerths = subscribeToBerths(setBerths);
    const unsubCat = subscribeToCategories(setCategories);
    const unsubLines = subscribeToShippingLines(setShippingLines);
    const unsubCalls = subscribeToVesselCalls(setVesselCalls);
    const unsubGate = subscribeToGateTransactions(setGateTransactions);
    const unsubJobs = subscribeToContainerJobs(setContainerJobs);

    return () => {
      unsubYard();
      unsubEq();
      unsubBerths();
      unsubCat();
      unsubLines();
      unsubCalls();
      unsubGate();
      unsubJobs();
    };
  }, []);

  // Requirement 3: Default view is LoginForm for Admin Login
  if (!currentUser) {
    return <TerminalLoginForm onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex antialiased">
      
      {/* Left Sidebar Navigation */}
      <TerminalSidebarNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        
        {/* Top Navbar */}
        <TerminalNavbar
          user={currentUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dynamic Screen View */}
        <main className="p-6 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          
          {dbLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-cyan-700 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">Menghubungkan ke Real-time Database Firestore TOS...</p>
            </div>
          ) : (
            <>
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <TerminalDashboardOverview
                  yardBlocks={yardBlocks}
                  equipments={equipments}
                  berths={berths}
                  vesselCalls={vesselCalls}
                  gateTransactions={gateTransactions}
                  onNavigateTab={setActiveTab}
                />
              )}

              {/* Master Data Screens */}
              {activeTab === 'master_yard' && <YardBlocksMaster yardBlocks={yardBlocks} />}
              {activeTab === 'master_equipment' && <EquipmentsMaster equipments={equipments} />}
              {activeTab === 'master_berths' && <BerthsMaster berths={berths} />}
              {activeTab === 'master_categories' && <CategoriesMaster categories={categories} />}
              {activeTab === 'master_lines' && <ShippingLinesMaster shippingLines={shippingLines} />}

              {/* Transaksi Data Screens */}
              {activeTab === 'tx_vessel_calls' && (
                <VesselCallsTx
                  vesselCalls={vesselCalls}
                  berths={berths}
                  shippingLines={shippingLines}
                />
              )}
              {activeTab === 'tx_gate' && (
                <GateTransactionsTx
                  gateTransactions={gateTransactions}
                  yardBlocks={yardBlocks}
                  categories={categories}
                />
              )}
              {activeTab === 'tx_jobs' && (
                <ContainerJobsTx
                  containerJobs={containerJobs}
                  equipments={equipments}
                />
              )}

              {/* Laporan & Analitik Screens */}
              {activeTab === 'rpt_throughput' && (
                <ThroughputReports
                  vesselCalls={vesselCalls}
                  gateTransactions={gateTransactions}
                />
              )}
              {activeTab === 'rpt_yor' && <YardOccupancyReports yardBlocks={yardBlocks} />}
              {activeTab === 'rpt_productivity' && (
                <EquipmentProductivityReports
                  equipments={equipments}
                  containerJobs={containerJobs}
                />
              )}
            </>
          )}

        </main>

      </div>

    </div>
  );
}
