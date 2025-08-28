import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Copy,
  ChevronLeft,
  ChevronRight,
  FileText
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { exportToExcel, exportToPDF, generateCustomerData } from "@/lib/import-export"

interface Quotation {
  id: number
  number: string
  customer_id: number
  customer_name: string
  customer_email: string
  date: string
  expiry_date: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount_rate: number
  discount_amount: number
  total: number
  status: "accepted" | "declined" | "expired" | "sent" | "draft"
  notes?: string
  created_at: string
  updated_at: string
}

export default function Quotations() {
  const navigate = useNavigate()
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedQuotations, setSelectedQuotations] = useState<string[]>([])

  // Fetch quotations from API
  const fetchQuotations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/quotations?limit=100')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        // Transform database data to match UI expectations
        const transformedQuotations = data.data.map((quotation: any) => ({
          ...quotation,
          date: quotation.date || new Date().toISOString().split('T')[0],
          expiry_date: quotation.expiry_date || new Date().toISOString().split('T')[0],
          subtotal: Number(quotation.subtotal) || 0,
          tax_amount: Number(quotation.tax_amount) || 0,
          discount_amount: Number(quotation.discount_amount) || 0,
          total: Number(quotation.total) || 0,
          tax_rate: Number(quotation.tax_rate) || 0,
          discount_rate: Number(quotation.discount_rate) || 0,
          customer_name: quotation.customer_name || 'Unknown Customer',
          customer_email: quotation.customer_email || ''
        }))
        setQuotations(transformedQuotations)
        console.log(`✅ Loaded ${transformedQuotations.length} quotations`)
      } else {
        console.error('API returned unsuccessful response:', data)
        setQuotations([])
      }
    } catch (error) {
      console.error('❌ Error fetching quotations:', error)
      setQuotations([])
      // Don't alert on every error, just log it
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchQuotations()
  }, [])

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    const colors = {
      accepted: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400", 
      declined: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400", 
      expired: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
    }
    return colors[normalizedStatus as keyof typeof colors] || colors.draft
  }

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case "accepted":
        return <CheckCircle className="h-3 w-3" />
      case "rejected":
      case "declined":
        return <XCircle className="h-3 w-3" />
      case "expired":
        return <Clock className="h-3 w-3" />
      case "sent":
        return <Send className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  const toggleQuotationSelection = (quotationId: number) => {
    setSelectedQuotations(prev =>
      prev.includes(quotationId.toString())
        ? prev.filter(id => id !== quotationId.toString())
        : [...prev, quotationId.toString()]
    )
  }

  const toggleSelectAll = () => {
    setSelectedQuotations(prev =>
      prev.length === filteredQuotations.length ? [] : filteredQuotations.map(q => q.id.toString())
    )
  }

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quotation.number.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || quotation.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const handleDeleteSelected = async () => {
    if (selectedQuotations.length === 0 || !confirm(`Are you sure you want to delete ${selectedQuotations.length} quotations?`)) {
      return
    }

    try {
      for (const quotationId of selectedQuotations) {
        await fetch(`/api/quotations/${quotationId}`, {
          method: 'DELETE'
        })
      }
      setSelectedQuotations([])
      fetchQuotations() // Refresh the quotation list
      alert('Selected quotations have been deleted successfully')
    } catch (error) {
      console.error('Error deleting quotations:', error)
      alert('Failed to delete quotations')
    }
  }

  const paginatedQuotations = filteredQuotations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage)

  const handleExport = () => {
    const exportData = {
      headers: ["Quotation ID", "Customer", "Created On", "Status", "Amount"],
      rows: quotations.map(quote => [
        quote.number,
        quote.customer_name,
        new Date(quote.date).toLocaleDateString(),
        quote.status.charAt(0).toUpperCase() + quote.status.slice(1),
        `$${quote.total.toFixed(2)}`
      ]),
      title: "Quotations Report",
      filename: "quotations-export"
    }
    exportToExcel(exportData)
    alert("Quotations exported to Excel successfully")
  }

  const handleDeleteQuotation = async (quotationId: number) => {
    if (!confirm('Are you sure you want to delete this quotation?')) {
      return
    }

    try {
      const response = await fetch(`/api/quotations/${quotationId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        alert('Quotation deleted successfully')
        fetchQuotations() // Refresh the list
      } else {
        alert(data.message || 'Failed to delete quotation')
      }
    } catch (error) {
      console.error('Error deleting quotation:', error)
      alert('Failed to delete quotation')
    }
  }

  // Function to add new quotation (called from CreateQuotation page)
  const addQuotation = (newQuotation: Omit<Quotation, "id">) => {
    const quotation = {
      ...newQuotation,
      id: Date.now()
    }
    setQuotations(prev => [quotation, ...prev])
  }

  // Make addQuotation available globally for CreateQuotation page
  if (typeof window !== 'undefined') {
    (window as any).addQuotation = addQuotation
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Quotations</h1>
          <p className="text-muted-foreground">Track and manage your quotation proposals</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedQuotations.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedQuotations.length})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => navigate("/quotations/create")}>
            <Plus className="mr-2 h-4 w-4" />
            New Quotation
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Quotation ID</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Created On</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedQuotations.map((quotation) => (
                  <tr key={quotation.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <span className="font-medium text-primary">{quotation.number}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {quotation.customer_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{quotation.customer_name}</span>
                          <div className="text-sm text-muted-foreground">{quotation.customer_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{new Date(quotation.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(quotation.status)} border-0 flex items-center gap-1 w-fit`}>
                        {getStatusIcon(quotation.status)}
                        {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/quotations/details/${quotation.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/quotations/create?edit=${quotation.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteQuotation(quotation.id)}
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

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows Per Page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">Entries</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {Math.min((currentPage - 1) * itemsPerPage + 1, filteredQuotations.length)} - {Math.min(currentPage * itemsPerPage, filteredQuotations.length)} of {filteredQuotations.length}
              </span>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                    const page = currentPage <= 2 ? i + 1 : currentPage - 1 + i
                    if (page > totalPages) return null
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8"
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
