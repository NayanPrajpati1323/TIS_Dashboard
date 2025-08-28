import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
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
  FileText,
  DollarSign,
  TrendingDown,
  Calendar,
  RefreshCw,
  Download,
  Send
} from "lucide-react"

interface CreditNote {
  id: string
  creditNoteNumber: string
  customer: string
  customerAvatar?: string
  invoiceNumber: string
  date: string
  amount: number
  reason: string
  status: "Draft" | "Sent" | "Applied" | "Cancelled"
  type: "Full Refund" | "Partial Refund" | "Product Return" | "Service Adjustment" | "Discount"
  createdAt: string
}

const sampleCreditNotes: CreditNote[] = [
  {
    id: "1",
    creditNoteNumber: "CN00001",
    customer: "John Smith",
    customerAvatar: "/placeholder.svg",
    invoiceNumber: "INV00025",
    date: "2024-02-15",
    amount: 250.00,
    reason: "Product return - defective item",
    status: "Applied",
    type: "Product Return",
    createdAt: "2024-02-15"
  },
  {
    id: "2",
    creditNoteNumber: "CN00002",
    customer: "Sarah Johnson",
    customerAvatar: "/placeholder.svg",
    invoiceNumber: "INV00024",
    date: "2024-02-14",
    amount: 150.00,
    reason: "Service not delivered as promised",
    status: "Sent",
    type: "Service Adjustment",
    createdAt: "2024-02-14"
  },
  {
    id: "3",
    creditNoteNumber: "CN00003",
    customer: "Michael Brown",
    customerAvatar: "/placeholder.svg",
    invoiceNumber: "INV00023",
    date: "2024-02-12",
    amount: 500.00,
    reason: "Bulk discount adjustment",
    status: "Applied",
    type: "Discount",
    createdAt: "2024-02-12"
  },
  {
    id: "4",
    creditNoteNumber: "CN00004",
    customer: "Emily Davis",
    customerAvatar: "/placeholder.svg",
    invoiceNumber: "INV00022",
    date: "2024-02-10",
    amount: 75.00,
    reason: "Partial refund for damaged goods",
    status: "Draft",
    type: "Partial Refund",
    createdAt: "2024-02-10"
  },
  {
    id: "5",
    creditNoteNumber: "CN00005",
    customer: "David Wilson",
    customerAvatar: "/placeholder.svg",
    invoiceNumber: "INV00021",
    date: "2024-02-08",
    amount: 1200.00,
    reason: "Full order cancellation",
    status: "Cancelled",
    type: "Full Refund",
    createdAt: "2024-02-08"
  }
]

const filterTabs = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "applied", label: "Applied" },
  { value: "cancelled", label: "Cancelled" }
]

export default function CreditNotes() {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>(sampleCreditNotes)
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const stats = {
    totalNotes: creditNotes.length,
    totalAmount: creditNotes.reduce((sum, note) => sum + note.amount, 0),
    appliedNotes: creditNotes.filter(note => note.status === "Applied").length,
    draftNotes: creditNotes.filter(note => note.status === "Draft").length
  }

  const toggleNoteSelection = (noteId: string) => {
    setSelectedNotes(prev =>
      prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    )
  }

  const toggleSelectAll = () => {
    setSelectedNotes(prev =>
      prev.length === filteredNotes.length ? [] : filteredNotes.map(note => note.id)
    )
  }

  const filteredNotes = creditNotes.filter(note => {
    const matchesSearch = note.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.creditNoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.reason.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    
    const statusMap: Record<string, string[]> = {
      draft: ["Draft"],
      sent: ["Sent"],
      applied: ["Applied"],
      cancelled: ["Cancelled"]
    }
    
    return matchesSearch && statusMap[activeTab]?.includes(note.status)
  })

  const getStatusColor = (status: string) => {
    const colors = {
      Draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
      Sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      Applied: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
    }
    return colors[status as keyof typeof colors] || colors.Draft
  }

  const getTypeColor = (type: string) => {
    const colors = {
      "Full Refund": "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      "Partial Refund": "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      "Product Return": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      "Service Adjustment": "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      "Discount": "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
    }
    return colors[type as keyof typeof colors] || colors.Discount
  }

  const handleDeleteNote = (noteId: string) => {
    setCreditNotes(prev => prev.filter(note => note.id !== noteId))
    setSelectedNotes(prev => prev.filter(id => id !== noteId))
  }

  const handleDeleteSelected = () => {
    setCreditNotes(prev => prev.filter(note => !selectedNotes.includes(note.id)))
    setSelectedNotes([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Credit Notes</h1>
          <p className="text-muted-foreground">Manage refunds, returns, and adjustments</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedNotes.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedNotes.length})
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Credit Note
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Credit Notes
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Amount
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Applied Notes
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.appliedNotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Draft Notes
            </CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftNotes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs and Table */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b px-6 pt-6">
              <TabsList className="grid grid-cols-5 w-full h-auto p-1 bg-muted/50">
                {filterTabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className="text-xs px-2 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 pb-4">
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search credit notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Table */}
            <TabsContent value={activeTab} className="m-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 w-12">
                        <Checkbox 
                          checked={selectedNotes.length === filteredNotes.length && filteredNotes.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Credit Note</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Invoice</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotes.map((note) => (
                      <tr key={note.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <Checkbox 
                            checked={selectedNotes.includes(note.id)}
                            onCheckedChange={() => toggleNoteSelection(note.id)}
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{note.creditNoteNumber}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-40">
                              {note.reason}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={note.customerAvatar} />
                              <AvatarFallback>{note.customer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{note.customer}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-mono">{note.invoiceNumber}</td>
                        <td className="p-4">
                          <Badge className={`${getTypeColor(note.type)} border-0`}>
                            {note.type}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm font-medium">-${note.amount.toFixed(2)}</td>
                        <td className="p-4">
                          <Badge className={`${getStatusColor(note.status)} border-0`}>
                            {note.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">{note.date}</td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {note.status === "Draft" && (
                                <DropdownMenuItem>
                                  <Send className="mr-2 h-4 w-4" />
                                  Send
                                </DropdownMenuItem>
                              )}
                              {note.status === "Sent" && (
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Apply Credit
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteNote(note.id)}
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
