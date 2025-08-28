import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { exportToPDF, exportToExcel, exportToCSV, generateInvoiceData } from "@/utils/exportUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  DollarSign,
  Calendar,
  Loader2
} from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Invoice {
  id: number
  number: string
  customer_id: number
  customer_name: string
  customer_email: string
  date: string
  due_date: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount_rate: number
  discount_amount: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  notes?: string
  created_at: string
  updated_at: string
}


export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const navigate = useNavigate()

  // Fetch invoices from API
  const fetchInvoices = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/invoices?limit=100')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        // Transform database data to match UI expectations
        const transformedInvoices = data.data.map((invoice: any) => ({
          ...invoice,
          date: invoice.date || new Date().toISOString().split('T')[0],
          due_date: invoice.due_date || new Date().toISOString().split('T')[0],
          subtotal: Number(invoice.subtotal) || 0,
          tax_amount: Number(invoice.tax_amount) || 0,
          discount_amount: Number(invoice.discount_amount) || 0,
          total: Number(invoice.total) || 0,
          tax_rate: Number(invoice.tax_rate) || 0,
          discount_rate: Number(invoice.discount_rate) || 0,
          customer_name: invoice.customer_name || 'Unknown Customer',
          customer_email: invoice.customer_email || ''
        }))
        setInvoices(transformedInvoices)
        console.log(`✅ Loaded ${transformedInvoices.length} invoices`)
      } else {
        console.error('API returned unsuccessful response:', data)
        setInvoices([])
      }
    } catch (error) {
      console.error('❌ Error fetching invoices:', error)
      setInvoices([])
      // Don't alert on every error, just log it
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchInvoices()
  }, [])

  // Calculate stats from actual data
  const stats = {
    totalInvoices: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0),
    paidAmount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
    pendingAmount: invoices.filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled').reduce((sum, inv) => sum + inv.total, 0),
  }

  const toggleInvoiceSelection = (invoiceId: number) => {
    setSelectedInvoices(prev =>
      prev.includes(invoiceId.toString())
        ? prev.filter(id => id !== invoiceId.toString())
        : [...prev, invoiceId.toString()]
    )
  }

  const toggleSelectAll = () => {
    setSelectedInvoices(prev =>
      prev.length === filteredInvoices.length ? [] : filteredInvoices.map(i => i.id.toString())
    )
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.number.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterType === "all" || invoice.status === filterType
    
    return matchesSearch && matchesFilter
  })

  const handleDeleteSelected = async () => {
    if (selectedInvoices.length === 0 || !confirm(`Are you sure you want to delete ${selectedInvoices.length} invoices?`)) {
      return
    }

    try {
      for (const invoiceId of selectedInvoices) {
        await fetch(`/api/invoices/${invoiceId}`, {
          method: 'DELETE'
        })
      }
      setSelectedInvoices([])
      fetchInvoices() // Refresh the invoice list
      alert('Selected invoices have been deleted successfully')
    } catch (error) {
      console.error('Error deleting invoices:', error)
      alert('Failed to delete invoices')
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
      sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      paid: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      overdue: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
    }
    return colors[status as keyof typeof colors] || colors.draft
  }


  const handleAddInvoice = () => {
    navigate("/invoices/create")
  }

  const handleEditInvoice = (invoice: Invoice) => {
    navigate(`/invoices/edit/${invoice.id}`)
  }

  const handleDeleteInvoice = async (invoice: Invoice) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoice.number}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        alert(`Invoice ${invoice.number} has been deleted successfully`)
        fetchInvoices() // Refresh the list
      } else {
        alert(data.message || 'Failed to delete invoice')
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      alert('Failed to delete invoice')
    }
  }

  const handleViewInvoice = (invoice: Invoice) => {
    navigate(`/invoices/details/${invoice.id}`)
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Invoices</h1>
          <p className="text-muted-foreground">Track and manage all your invoice transactions</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedInvoices.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedInvoices.length})
            </Button>
          )}
          <Button size="sm" onClick={handleAddInvoice}>
            <Plus className="mr-2 h-4 w-4" />
            Add Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Amount
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paid Amount
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.paidAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Amount
            </CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.pendingAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle>Invoices</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full lg:w-60"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading invoices...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 w-12">
                      <Checkbox 
                        checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Invoice</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Due Date</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox 
                          checked={selectedInvoices.includes(invoice.id.toString())}
                          onCheckedChange={() => toggleInvoiceSelection(invoice.id)}
                        />
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-sm font-medium">{invoice.number}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{invoice.customer_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{invoice.customer_name}</div>
                            <div className="text-sm text-muted-foreground">{invoice.customer_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{new Date(invoice.date).toLocaleDateString()}</td>
                      <td className="p-4 text-sm font-medium">${invoice.total.toFixed(2)}</td>
                      <td className="p-4 text-sm">{new Date(invoice.due_date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <Badge variant="secondary" className={getStatusColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent  align="end">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewInvoice(invoice)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditInvoice(invoice)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditInvoice(invoice)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 cursor-pointer"
                              onClick={() => handleDeleteInvoice(invoice)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
