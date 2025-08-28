//register model
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  created_at?: Date;
}

// Customer model
export interface Customer {
  id?: number
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  created_at?: Date
  updated_at?: Date
}

// Category model
export interface Category {
  id?: number
  name: string
  description?: string
  created_at?: Date
  updated_at?: Date
}

// Product model
export interface Product {
  id?: number
  name: string
  sku: string
  description?: string
  price: number
  cost?: number
  stock_quantity?: number
  unit?: string
  status?: 'active' | 'inactive'
  // UI compatibility fields
  sellingPrice?: number
  purchasePrice?: number
  stock?: number
  type?: 'Product' | 'Service'
  image?: string
}

// Invoice model
export interface Invoice {
  id?: number
  number: string
  customer_id: number
  date: string
  due_date?: string
  subtotal?: number
  tax_rate?: number
  tax_amount?: number
  discount_rate?: number
  discount_amount?: number
  total: number
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  created_at?: Date
  updated_at?: Date
  customer?: Customer
  items?: InvoiceItem[]
}

// Invoice item model
export interface InvoiceItem {
  id?: number
  invoice_id: number
  product_id: number
  description?: string
  quantity: number
  unit_price: number
  total: number
  created_at?: Date
  product?: Product
}

// Quotation model
export interface Quotation {
  id?: number
  number: string
  customer_id: number
  date: string
  expiry_date?: string
  subtotal?: number
  tax_rate?: number
  tax_amount?: number
  discount_rate?: number
  discount_amount?: number
  total: number
  status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  notes?: string
  created_at?: Date
  updated_at?: Date
  customer?: Customer
  items?: QuotationItem[]
}

// Quotation item model
export interface QuotationItem {
  id?: number
  quotation_id: number
  product_id: number
  description?: string
  quantity: number
  unit_price: number
  total: number
  created_at?: Date
  product?: Product
}

// Inventory transaction model
export interface InventoryTransaction {
  id?: number
  product_id: number
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reference_type: 'invoice' | 'purchase' | 'adjustment' | 'initial'
  reference_id?: number
  notes?: string
  created_at?: Date
  product?: Product
}

// Sales analytics model
export interface SalesAnalytics {
  id?: number
  date: string
  total_sales?: number
  total_invoices?: number
  total_customers?: number
  total_products_sold?: number
  created_at?: Date
  updated_at?: Date
}

// Dashboard analytics
export interface DashboardStats {
  totalSales: number
  totalInvoices: number
  totalCustomers: number
  totalProducts: number
  recentInvoices: Invoice[]
  recentCustomers: Customer[]
  salesChart: { date: string; amount: number }[]
  topProducts: { product: Product; quantity: number; revenue: number }[]
  monthlyRevenue: { month: string; revenue: number }[]
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T = any> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
export interface Profile {
  id: number;
  profile_image?: string; // optional
  name: string;
  email: string;
  gender: "Male" | "Female" | "Other";
  dob: string; // ISO date string: YYYY-MM-DD
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  postal_code?: string;
  created_at?: string;
  updated_at?: string;
}
