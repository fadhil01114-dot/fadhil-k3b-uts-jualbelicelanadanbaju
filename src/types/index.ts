export type ProductCategory = 'Kaos & Polo' | 'Kemeja & Jacket' | 'Celana & Shorts';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  description: string;
  sizes: string[];
  stock: number;
  image: string;
  rating: number;
  soldCount: number;
  badge?: 'BEST SELLER' | 'NEW' | 'DISKON' | 'HOT';
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export type PaymentMethodType = 'qris' | 'bca_va' | 'mandiri_va' | 'bri_va' | 'credit_card';

export type OrderStatus = 
  | 'pending_payment'
  | 'proof_uploaded'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'shipped'
  | 'completed';

export interface OrderItem {
  productId: string;
  name: string;
  category: string;
  selectedSize: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingMethod: string;
  shippingCost: number;
  items: OrderItem[];
  subtotal: number;
  totalAmount: number;
  promoCode?: string;
  promoDiscount?: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: OrderStatus;
  paymentProofUrl?: string;
  paymentNotes?: string;
  rejectionReason?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string;
}

export interface StoreNotification {
  id: string;
  title: string;
  message: string;
  type: 'new_order' | 'proof_uploaded' | 'status_change' | 'stock_low';
  orderId?: string;
  read: boolean;
  createdAt: string;
}

export interface SalesReportFilter {
  startDate?: string;
  endDate?: string;
  category?: string;
}
