import React, { useState } from 'react';
import { 
  BarChart3, Package, ShoppingCart, Users, CheckCircle2, XCircle, 
  Eye, Edit, Trash2, Plus, Download, FileCheck, Search, Filter, 
  TrendingUp, ArrowUpRight, Check, X, ShieldAlert, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { Product, Order, Customer, ProductCategory, OrderStatus } from '../types';
import { 
  addProduct, updateProduct, deleteProduct, updateOrderStatus 
} from '../lib/db';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  customers,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'sales' | 'products' | 'proof_approvals' | 'orders' | 'customers'
  >('sales');

  // Filters & Modal States
  const [productSearch, setProductSearch] = useState<string>('');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  
  // Product Edit/Add Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product Form Fields
  const [pName, setPName] = useState<string>('');
  const [pCategory, setPCategory] = useState<ProductCategory>('Kaos & Polo');
  const [pPrice, setPPrice] = useState<number>(149000);
  const [pOriginalPrice, setPOriginalPrice] = useState<number>(199000);
  const [pStock, setPStock] = useState<number>(25);
  const [pDescription, setPDescription] = useState<string>('');
  const [pImage, setPImage] = useState<string>('');
  const [pBadge, setPBadge] = useState<string>('NEW');

  // Proof Approval View Modal
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Stats Computations
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'approved' || o.paymentStatus === 'shipped' || o.paymentStatus === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingApprovalOrders = orders.filter(o => o.paymentStatus === 'proof_uploaded');
  const itemsSold = orders
    .filter(o => o.paymentStatus === 'approved' || o.paymentStatus === 'shipped' || o.paymentStatus === 'completed')
    .reduce((sum, o) => sum + o.items.reduce((is, i) => is + i.quantity, 0), 0);

  // Sales by Category calculation
  const categorySalesMap: Record<string, number> = {
    'Kaos & Polo': 0,
    'Kemeja & Jacket': 0,
    'Celana & Shorts': 0,
  };
  orders
    .filter(o => o.paymentStatus === 'approved' || o.paymentStatus === 'shipped' || o.paymentStatus === 'completed')
    .forEach(o => {
      o.items.forEach(i => {
        if (categorySalesMap[i.category] !== undefined) {
          categorySalesMap[i.category] += i.price * i.quantity;
        }
      });
    });

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPCategory('Kaos & Polo');
    setPPrice(149000);
    setPOriginalPrice(199000);
    setPStock(25);
    setPDescription('Pakaian Nevada original berbahan katun pilihan, adem dan tahan lama.');
    setPImage('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80');
    setPBadge('NEW');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPCategory(prod.category);
    setPPrice(prod.price);
    setPOriginalPrice(prod.originalPrice || prod.price);
    setPStock(prod.stock);
    setPDescription(prod.description);
    setPImage(prod.image);
    setPBadge(prod.badge || 'NEW');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pImage || pPrice <= 0) return;

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: pName,
        category: pCategory,
        price: pPrice,
        originalPrice: pOriginalPrice,
        stock: pStock,
        description: pDescription,
        image: pImage,
        badge: pBadge as any,
      });
    } else {
      await addProduct({
        name: pName,
        category: pCategory,
        price: pPrice,
        originalPrice: pOriginalPrice,
        stock: pStock,
        description: pDescription,
        image: pImage,
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.8,
        soldCount: 0,
        badge: pBadge as any,
      });
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini dari database?')) {
      await deleteProduct(id);
    }
  };

  // Approval Handlers
  const handleApprovePayment = async (orderId: string) => {
    await updateOrderStatus(orderId, 'approved');
    setSelectedProofOrder(null);
    alert('✅ Pembayaran disetujui! Stok produk telah dikurangi secara otomatis.');
  };

  const handleRejectPayment = async (orderId: string) => {
    if (!rejectionReason) {
      alert('Mohon tuliskan alasan penolakan!');
      return;
    }
    await updateOrderStatus(orderId, 'rejected', rejectionReason);
    setSelectedProofOrder(null);
    setRejectionReason('');
    alert('❌ Pembayaran ditolak. Notifikasi dikirimkan ke pelanggan.');
  };

  // Export Sales Report CSV
  const handleExportCSV = () => {
    const csvRows = [
      ['Kode Pesanan', 'Tanggal', 'Nama Pelanggan', 'Email', 'Status', 'Total (Rp)'],
      ...orders.map(o => [
        o.orderCode,
        new Date(o.createdAt).toLocaleDateString('id-ID'),
        `"${o.customerName}"`,
        o.customerEmail,
        o.paymentStatus,
        o.totalAmount
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Sales_Nevada_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/90 backdrop-blur-md flex flex-col">
      
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded shadow">
            NEVADA ADMIN
          </div>
          <h2 className="text-base font-extrabold hidden sm:block">
            Panel Kelola Toko & Database Real-time
          </h2>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
        >
          Tutup Admin Panel ✕
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 overflow-y-auto">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-800 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'sales', label: 'Laporan Sales & Analitik', icon: BarChart3 },
            { id: 'products', label: `Kelola Produk & Stok (${products.length})`, icon: Package },
            { id: 'proof_approvals', label: `Approval Bukti Transfer (${pendingApprovalOrders.length})`, icon: FileCheck, badge: pendingApprovalOrders.length },
            { id: 'orders', label: `Kelola Order & Riwayat (${orders.length})`, icon: ShoppingCart },
            { id: 'customers', label: `Data Pelanggan (${customers.length})`, icon: Users },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* TAB 1: LAPORAN SALES */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-800 text-white rounded-2xl border border-slate-700 shadow space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Total Pendapatan Disetujui</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-slate-400">Dari pesanan lunas & dikirim</div>
              </div>

              <div className="p-5 bg-slate-800 text-white rounded-2xl border border-slate-700 shadow space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Total Pesanan Masuk</span>
                  <ShoppingCart className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-black text-white">{orders.length} Order</div>
                <div className="text-[11px] text-slate-400">Tersimpan di Firestore</div>
              </div>

              <div className="p-5 bg-slate-800 text-white rounded-2xl border border-slate-700 shadow space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Perlu Approval Bukti</span>
                  <FileCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400">
                  {pendingApprovalOrders.length} Pesanan
                </div>
                <div className="text-[11px] text-slate-400">Menunggu verifikasi admin</div>
              </div>

              <div className="p-5 bg-slate-800 text-white rounded-2xl border border-slate-700 shadow space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Item Pakaian Terjual</span>
                  <Package className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">{itemsSold} Pcs</div>
                <div className="text-[11px] text-slate-400">Baju, Kemeja & Celana</div>
              </div>
            </div>

            {/* Visual Sales Chart & Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Sales Category Breakdown */}
              <div className="lg:col-span-1 p-5 bg-slate-800 text-white rounded-2xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <h3 className="font-extrabold text-sm">Penjualan per Kategori</h3>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 text-xs text-red-400 font-bold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                </div>

                <div className="space-y-3">
                  {Object.entries(categorySalesMap).map(([cat, val]) => {
                    const pct = totalRevenue > 0 ? Math.round((val / totalRevenue) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-1 text-xs">
                        <div className="flex justify-between font-semibold">
                          <span>{cat}</span>
                          <span className="font-bold text-slate-300">Rp {val.toLocaleString('id-ID')} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-red-500 h-full transition-all duration-500"
                            style={{ width: `${Math.max(5, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order History Table Quick Preview */}
              <div className="lg:col-span-2 p-5 bg-slate-800 text-white rounded-2xl border border-slate-700 space-y-3">
                <h3 className="font-extrabold text-sm border-b border-slate-700 pb-2">
                  Transaksi Penjualan Terbaru
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-2">Kode</th>
                        <th className="p-2">Pelanggan</th>
                        <th className="p-2">Total</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-slate-700/30">
                          <td className="p-2 font-mono font-bold text-red-400">{o.orderCode}</td>
                          <td className="p-2 font-semibold">{o.customerName}</td>
                          <td className="p-2 font-black">Rp {o.totalAmount.toLocaleString('id-ID')}</td>
                          <td className="p-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">
                              {o.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: KELOLA PRODUK & STOK */}
        {activeTab === 'products' && (
          <div className="space-y-4 bg-slate-800 p-5 rounded-2xl border border-slate-700 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-700 pb-4">
              <div>
                <h3 className="font-extrabold text-base">Katalog Produk & Manajemen Stok</h3>
                <p className="text-xs text-slate-400">Tambah, ubah harga, stok, atau deskripsi produk Nevada di database.</p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Produk Baru</span>
              </button>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono">
                  <tr>
                    <th className="p-3">Produk</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Harga</th>
                    <th className="p-3">Stok</th>
                    <th className="p-3">Terjual</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-700/30">
                      <td className="p-3 flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded-lg bg-slate-900 shrink-0" />
                        <div>
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-[10px] text-slate-400">Ukuran: {p.sizes.join(', ')}</div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-slate-300">{p.category}</td>
                      <td className="p-3 font-bold text-amber-400">Rp {p.price.toLocaleString('id-ID')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                          p.stock <= 0 ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          p.stock < 10 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-emerald-950 text-emerald-300'
                        }`}>
                          {p.stock} pcs
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-bold">{p.soldCount} pcs</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200"
                            title="Edit Produk"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 bg-red-950 hover:bg-red-900 rounded-lg text-red-300"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: APPROVAL BUKTI PEMBAYARAN */}
        {activeTab === 'proof_approvals' && (
          <div className="space-y-4 bg-slate-800 p-5 rounded-2xl border border-slate-700 text-white">
            <div>
              <h3 className="font-extrabold text-base">Approval Bukti Transfer dari Pelanggan</h3>
              <p className="text-xs text-slate-400">Verifikasi kelengkapan resi/bukti pembayaran sebelum memproses pesanan.</p>
            </div>

            {pendingApprovalOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Tidak ada antrean bukti pembayaran yang menunggu persetujuan.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingApprovalOrders.map(order => (
                  <div key={order.id} className="p-4 bg-slate-900 rounded-2xl border border-amber-500/30 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-amber-500 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded">
                          BUKTI TERUNGGAH
                        </span>
                        <h4 className="font-mono font-black text-red-400 text-sm mt-1">{order.orderCode}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-white">Rp {order.totalAmount.toLocaleString('id-ID')}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{order.paymentMethod}</div>
                      </div>
                    </div>

                    <div className="text-xs space-y-1 text-slate-300 border-t border-slate-800 pt-2">
                      <div>Pelanggan: <strong className="text-white">{order.customerName}</strong> ({order.customerPhone})</div>
                      <div>Alamat: <span className="text-slate-400">{order.shippingAddress}</span></div>
                    </div>

                    {/* Proof Preview Button */}
                    {order.paymentProofUrl && (
                      <div className="p-2 bg-slate-800 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium truncate">Bukti Transfer Lampiran</span>
                        <button
                          onClick={() => setSelectedProofOrder(order)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Periksa Resi
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleApprovePayment(order.id)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Setujui Pembayaran
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Masukkan alasan penolakan (misal: Bukti buram / nominal tidak sesuai):');
                          if (reason) updateOrderStatus(order.id, 'rejected', reason);
                        }}
                        className="py-2 px-3 bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold text-xs rounded-xl"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: KELOLA ORDER & RIWAYAT */}
        {activeTab === 'orders' && (
          <div className="space-y-4 bg-slate-800 p-5 rounded-2xl border border-slate-700 text-white">
            <h3 className="font-extrabold text-base">Kelola Pesanan & Riwayat Transaksi</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono">
                  <tr>
                    <th className="p-3">Kode</th>
                    <th className="p-3">Pelanggan</th>
                    <th className="p-3">Item</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Ubah Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-700/30">
                      <td className="p-3 font-mono font-bold text-red-400">{o.orderCode}</td>
                      <td className="p-3">
                        <div className="font-bold">{o.customerName}</div>
                        <div className="text-[10px] text-slate-400">{o.customerEmail}</div>
                      </td>
                      <td className="p-3 text-slate-300">{o.items.length} Barang</td>
                      <td className="p-3 font-black text-amber-400">Rp {o.totalAmount.toLocaleString('id-ID')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-200">
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={o.paymentStatus}
                          onChange={(e) => {
                            const newStatus = e.target.value as OrderStatus;
                            let resi = o.trackingNumber;
                            if (newStatus === 'shipped') {
                              resi = prompt('Masukkan Nomor Resi Pengiriman (e.g. JNE8820192):') || 'JNE-' + Math.floor(Math.random() * 900000);
                            }
                            updateOrderStatus(o.id, newStatus, undefined, resi);
                          }}
                          className="bg-slate-900 text-white text-xs p-1.5 rounded-lg border border-slate-700"
                        >
                          <option value="pending_payment">Pending Payment</option>
                          <option value="proof_uploaded">Proof Uploaded</option>
                          <option value="approved">Approved</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: DATA PELANGGAN */}
        {activeTab === 'customers' && (
          <div className="space-y-4 bg-slate-800 p-5 rounded-2xl border border-slate-700 text-white">
            <h3 className="font-extrabold text-base">Data Pelanggan Toko</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono">
                  <tr>
                    <th className="p-3">Nama Pelanggan</th>
                    <th className="p-3">Email & Kontak</th>
                    <th className="p-3">Alamat</th>
                    <th className="p-3">Total Order</th>
                    <th className="p-3">Total Belanja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-700/30">
                      <td className="p-3 font-bold text-white">{c.name}</td>
                      <td className="p-3">
                        <div>{c.email}</div>
                        <div className="text-[10px] text-slate-400">{c.phone}</div>
                      </td>
                      <td className="p-3 text-slate-300 max-w-xs truncate">{c.address}</td>
                      <td className="p-3 font-bold text-slate-200">{c.totalOrders} Transaksi</td>
                      <td className="p-3 font-black text-amber-400">Rp {c.totalSpent.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modal Add / Edit Product */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-800 text-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-700 shadow-2xl">
            <h3 className="font-extrabold text-base">
              {editingProduct ? 'Edit Produk Nevada' : 'Tambah Produk Nevada Baru'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Nama Produk *</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={e => setPName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Kategori *</label>
                  <select
                    value={pCategory}
                    onChange={e => setPCategory(e.target.value as ProductCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Kaos & Polo">Kaos & Polo</option>
                    <option value="Kemeja & Jacket">Kemeja & Jacket</option>
                    <option value="Celana & Shorts">Celana & Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Badge</label>
                  <select
                    value={pBadge}
                    onChange={e => setPBadge(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="BEST SELLER">BEST SELLER</option>
                    <option value="NEW">NEW</option>
                    <option value="DISKON">DISKON</option>
                    <option value="HOT">HOT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Harga (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={e => setPPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Harga Coret</label>
                  <input
                    type="number"
                    value={pOriginalPrice}
                    onChange={e => setPOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Stok *</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={e => setPStock(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL Gambar Produk *</label>
                <input
                  type="text"
                  required
                  value={pImage}
                  onChange={e => setPImage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Deskripsi Produk</label>
                <textarea
                  rows={2}
                  value={pDescription}
                  onChange={e => setPDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 hover:bg-red-500 font-bold text-white rounded-xl"
                >
                  Simpan Produk
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proof Review Image Modal */}
      {selectedProofOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-800">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-sm">Review Resi {selectedProofOrder.orderCode}</h4>
              <button onClick={() => setSelectedProofOrder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="aspect-4/3 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              <img
                src={selectedProofOrder.paymentProofUrl}
                alt="Bukti Transfer"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div>Total Tagihan: <strong className="text-amber-400">Rp {selectedProofOrder.totalAmount.toLocaleString('id-ID')}</strong></div>
              <div>Catatan: <span className="text-slate-400">{selectedProofOrder.paymentNotes || 'Tidak ada'}</span></div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleApprovePayment(selectedProofOrder.id)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl"
              >
                Setujui & Kurangi Stok
              </button>
              <button
                onClick={() => setSelectedProofOrder(null)}
                className="py-2 px-4 bg-slate-800 text-slate-300 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
